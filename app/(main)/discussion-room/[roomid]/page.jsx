"use client"
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { AIModel, ConvertTextToSpeech, DeepgramSTTService } from '@/services/GlobalServices';
import { CoachingExpert } from '@/services/Options';
import { UserButton } from '@stackframe/stack';
import { useMutation, useQuery } from 'convex/react';
import { Loader2Icon } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation';
import ChatBox from './_components/ChatBox';
import { toast } from 'sonner';
import { UserContext } from '@/app/_context/UserContext';

function DiscussionRoom() {
    const { roomid } = useParams();
    const {userData,setUserData} = useContext(UserContext);
    const router = useRouter();
    const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
    const [expert, setExpert] = useState();
    const [enableMic, setEnableMic] = useState(false);
    const speechRecognition = useRef(null);
    const [transcribe, setTranscribe] = useState('');
    const [conversation, setConversation] = useState([]);
    const [userJustSpoke, setUserJustSpoke] = useState(false);
    const [loading,setLoading] = useState(false);
    const [aiResponding, setAiResponding] = useState(false);
    const [enableFeedbackNotes,setEnableFeedbackNotes] = useState(false);
    const UpdateConversation=useMutation(api.DiscussionRoom.UpdateConversation);
    const updateUserToken=useMutation(api.users.UpdateUserToken);
    
    useEffect(() => {
        if(DiscussionRoomData){
            const Expert = CoachingExpert.find(item => item.name === DiscussionRoomData.expertName);
            console.log(Expert);
            setExpert(Expert);
        }
    }, [DiscussionRoomData]);

    const connectToServer = async () => {
        setLoading(true);
        // Check credits: block if user has 0 or fewer remaining credits
        const currentCredits = Number(userData?.credits ?? 0);
        if (currentCredits <= 0) {
            toast('You have no credits left — please upgrade to continue.');
            setLoading(false);
            return;
        }
        try {
            // Initialize Deepgram STT
            speechRecognition.current = new DeepgramSTTService();
            await speechRecognition.current.initialize();

            // Set up speech recognition callbacks
            speechRecognition.current.setOnTranscript((transcript) => {
                    // Ignore interim transcripts while AI is responding to avoid picking up TTS
                    if (!aiResponding) {
                        setTranscribe(transcript);
                    }
            });

                speechRecognition.current.setOnFinalTranscript(async (finalTranscript) => {
                    // Ignore final transcripts that occur while AI is responding
                    if (!aiResponding && finalTranscript.trim()) {
                        setConversation(prev => [...prev, {
                            role: 'user',
                            content: finalTranscript
                        }]);
                        await updateUserTokenMethod(finalTranscript);
                        setTranscribe(''); // Clear interim transcript
                        setUserJustSpoke(true); // Trigger AI response
                    }
                });

            speechRecognition.current.setOnError((error) => {
                console.error('Speech recognition error:', error);
                toast(`Speech recognition error: ${error}`);
            });

            // Start speech recognition
            speechRecognition.current.start();
            
            setLoading(false);
            setEnableMic(true);
            toast('Connected to Deepgram STT...');
            
        } catch (error) {
            console.error("Error setting up speech recognition:", error);
            setLoading(false);
            toast(`Error: ${error.message}`);
        }
    }

    useEffect(() => {
        async function generateAIResponse() {
            if (userJustSpoke && !aiResponding && DiscussionRoomData) {
                setAiResponding(true);
                setUserJustSpoke(false); // Reset the trigger
                
                // Stop STT to prevent self-transcription
                if (speechRecognition.current && speechRecognition.current.isListening) {
                    speechRecognition.current.stop();
                }
                
                try {
                    // Get conversation history for context (last 8 messages)
                    const lastTwoMsg = conversation.slice(-8);
                    const aiResp = await AIModel(
                        DiscussionRoomData.topic,
                        DiscussionRoomData.coachingOption,
                        lastTwoMsg
                    );
                    
                    // Use Deepgram TTS for speech synthesis
                    try {
                        await ConvertTextToSpeech(aiResp.content, DiscussionRoomData.expertName);
                    } catch (error) {
                        console.error('Text-to-speech error:', error);
                    }
                    
                    // Add AI response to conversation
                    setConversation(prev => [...prev, aiResp]);
                    await updateUserTokenMethod(aiResp.content);
                } catch (error) {
                    console.error('AI response error:', error);
                } finally {
                    setAiResponding(false);
                    
                    // Restart STT after AI finishes speaking
                    if (speechRecognition.current && enableMic) {
                        try {
                            await speechRecognition.current.initialize();
                            speechRecognition.current.start();
                        } catch (error) {
                            console.error('Error restarting STT:', error);
                        }
                    }
                }
            }
        }        // Small delay to ensure conversation state is updated
        const timeoutId = setTimeout(() => {
            generateAIResponse();
        }, 500);
        
        return () => clearTimeout(timeoutId);
    }, [userJustSpoke, aiResponding, DiscussionRoomData, conversation])

    const disconnect = async(e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Stop speech recognition
            if (speechRecognition.current) {
                speechRecognition.current.stop();
            }
            
            setEnableMic(false);
            setUserJustSpoke(false); // Reset trigger
            setAiResponding(false); // Reset AI state
            toast('Disconnected!')
            
            await UpdateConversation({
                id: DiscussionRoomData._id,
                conversation: conversation
            });
        } catch (err) {
            console.error("Error updating conversation:", err);
        } finally {
            setLoading(false);
            setEnableFeedbackNotes(true);
        }
    }

    const updateUserTokenMethod=async(text)=>{
        // Count by characters (including spaces) — 1 credit per character
        const tokenCount = text ? text.length : 0;
        try{
            const result = await updateUserToken({
                id:userData._id,
                credits:Number(userData.credits)-Number(tokenCount)
            })

            // If server returned the clamped credits, update local state from it
            if(result && typeof result.credits === 'number'){
                setUserData(prev=>({
                    ...prev,
                    credits: result.credits
                }))

                // If credits hit zero, stop the session and notify user
                if(result.credits <= 0){
                    toast('You have exhausted your credits. Please upgrade to continue.');
                    // Stop and disable mic if active
                    if (speechRecognition.current) {
                        try{ speechRecognition.current.stop(); }catch(e){}
                    }
                    setEnableMic(false);
                }
            }
        }catch(err){
            console.error('Error updating user credits:', err);
            toast('Could not update credits. Please try again.');
        }
    }
    
    return (
        <div className='max-w-7xl mx-auto'>
            <div className='mb-8'>
                <div className='flex items-center gap-3 mb-2'>
                    <div className='h-10 w-1 bg-primary rounded-full'></div>
                    <h2 className='text-3xl font-bold text-foreground'>{DiscussionRoomData?.coachingOption}</h2>
                </div>
                <p className='text-muted-foreground ml-7'>Active coaching session with {expert?.name}</p>
                <div className='mt-4'>
                    <button
                        onClick={() => router.push('/dashboard')}
                        aria-label='Back to dashboard'
                        className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/10 hover:bg-muted/20 text-sm text-primary transition-shadow shadow-sm hover:shadow-md'
                    >
                        <ArrowLeft size={16} />
                        <span className='hidden sm:inline'>Back to dashboard</span>
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                <div className='lg:col-span-2 space-y-6'>
                    <div className='relative h-[65vh] bg-gradient-to-br from-card via-card to-muted/20 
                    rounded-3xl border border-border shadow-xl overflow-hidden'>
                        {/* Background decoration */}
                        <div className='absolute inset-0 bg-grid-pattern opacity-5'></div>
                        
                        {/* Content */}
                        <div className='relative h-full flex flex-col justify-center items-center p-8'>
                            {/* Avatar */}
                            <div className='relative mb-6'>
                                {aiResponding && (
                                    <div className='absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse'></div>
                                )}
                                {expert?.avatar ? (
                                    <div className='relative'>
                                        <Image 
                                            src={expert.avatar} 
                                            alt='Avatar'
                                            width={200}
                                            height={200}
                                            className={`h-32 w-32 rounded-full object-cover border-4 border-primary/20 shadow-xl
                                            ${aiResponding ? 'scale-110 ring-4 ring-primary/30' : ''} transition-all duration-300`}
                                        />
                                        {enableMic && (
                                            <div className='absolute -bottom-2 -right-2 h-8 w-8 bg-primary rounded-full 
                                            flex items-center justify-center shadow-lg animate-pulse'>
                                                <div className='h-3 w-3 bg-primary-foreground rounded-full'></div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className={`h-32 w-32 rounded-full bg-muted flex items-center justify-center 
                                    border-4 border-primary/20 shadow-xl ${aiResponding ? 'scale-110 ring-4 ring-primary/30' : ''} 
                                    transition-all duration-300`}>
                                        <svg xmlns="http://www.w3.org/2000/svg" className='h-16 w-16 text-muted-foreground' 
                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4.418 0-8 1.79-8 4v1h16v-1c0-2.21-3.582-4-8-4z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Coach Name */}
                            <h2 className='text-2xl font-bold text-card-foreground mb-2'>{expert?.name}</h2>
                            
                            {/* Status */}
                            {aiResponding ? (
                                <div className='flex items-center gap-2 text-primary'>
                                    <div className='flex gap-1'>
                                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce' style={{animationDelay: '0ms'}}></div>
                                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce' style={{animationDelay: '150ms'}}></div>
                                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce' style={{animationDelay: '300ms'}}></div>
                                    </div>
                                    <span className='text-sm font-medium'>Thinking...</span>
                                </div>
                            ) : enableMic ? (
                                <div className='flex items-center gap-2 text-primary'>
                                    <div className='h-2 w-2 bg-primary rounded-full animate-pulse'></div>
                                    <span className='text-sm font-medium'>Listening...</span>
                                </div>
                            ) : (
                                <p className='text-sm text-muted-foreground'>Ready to start coaching</p>
                            )}

                            {/* Transcription Display */}
                            {transcribe && (
                                <div className='mt-8 px-6 py-4 bg-primary/10 rounded-2xl border border-primary/20 
                                max-w-xl backdrop-blur-sm'>
                                    <p className='text-sm text-foreground text-center italic'>"{transcribe}"</p>
                                </div>
                            )}

                            {/* User Button */}
                            <div className='absolute bottom-6 right-6 bg-background/80 backdrop-blur-sm 
                            p-3 rounded-xl border border-border shadow-lg'>
                                <UserButton />
                            </div>
                        </div>
                    </div>

                    {/* Control Button */}
                    <div className='flex justify-center'>
                        {!enableMic ? (
                            <Button 
                                className='cursor-pointer px-12 py-6 text-lg rounded-2xl shadow-lg 
                                hover:shadow-xl transition-all hover:scale-105' 
                                onClick={connectToServer} 
                                disabled={loading}
                            > 
                                {loading && <Loader2Icon className='animate-spin mr-2' />} 
                                Start Session
                            </Button>
                        ) : (
                            <Button 
                                className='cursor-pointer px-12 py-6 text-lg rounded-2xl shadow-lg 
                                hover:shadow-xl transition-all hover:scale-105' 
                                variant='destructive' 
                                onClick={disconnect} 
                                disabled={loading}
                            >
                                {loading && <Loader2Icon className='animate-spin mr-2' />}
                                End Session
                            </Button>
                        )}
                    </div>
                </div>

                {/* Chat Section */}
                <div className='lg:col-span-1'>
                    <div className='bg-card border border-border rounded-3xl shadow-lg overflow-hidden'>
                        <div className='bg-gradient-to-r from-primary/10 to-accent/10 px-6 py-4 border-b border-border'>
                            <h3 className='font-semibold text-card-foreground'>Conversation</h3>
                        </div>
                        <ChatBox 
                            conversation={conversation} 
                            enableFeedbackNotes={enableFeedbackNotes} 
                            coachingOption={DiscussionRoomData?.coachingOption}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DiscussionRoom