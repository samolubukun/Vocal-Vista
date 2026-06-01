"use client"
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { CoachingExpert, CoachingOptions } from '@/services/Options';
import { UserButton } from '@stackframe/stack';
import { useMutation, useQuery } from 'convex/react';
import { Loader2Icon, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useContext, useEffect, useRef, useState } from 'react';
import ChatBox from './_components/ChatBox';
import { toast } from 'sonner';
import { UserContext } from '@/app/_context/UserContext';
import { DeepgramClient, AgentEvents } from "@deepgram/sdk";

function DiscussionRoom() {
    const { roomid } = useParams();
    const { userData, setUserData } = useContext(UserContext);
    const router = useRouter();
    const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
    
    // Core states
    const [expert, setExpert] = useState();
    const [enableMic, setEnableMic] = useState(false);
    const [connected, setConnected] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
    const [conversation, setConversation] = useState([]);
    const [transcribe, setTranscribe] = useState('');
    const [enableFeedbackNotes, setEnableFeedbackNotes] = useState(false);
    const [sessionTime, setSessionTime] = useState(0);

    // Ref to keep a fresh reference of userData to avoid stale state in interval
    const userDataRef = useRef(userData);
    useEffect(() => {
        userDataRef.current = userData;
    }, [userData]);

    // Mutation calls
    const UpdateConversation = useMutation(api.DiscussionRoom.UpdateConversation);
    const updateUserToken = useMutation(api.users.UpdateUserToken);

    // Deepgram Voice Agent connection refs
    const agentClientRef = useRef(null);

    // Browser Audio Playback Refs (Output)
    const audioContextRef = useRef(null);
    const nextStartTimeRef = useRef(0);
    const audioQueueRef = useRef([]);
    const currentAudioSourceRef = useRef(null);

    // Microphone Capture Refs (Input)
    const streamRef = useRef(null);
    const micAudioContextRef = useRef(null);
    const micSourceRef = useRef(null);
    const micProcessorRef = useRef(null);

    // Voice Map for Experts
    const voiceMap = {
        'Ethan': 'aura-helios-en',
        'Sofia': 'aura-luna-en',
        'Justin': 'aura-zeus-en',
        'Amy': 'aura-stella-en',
        'Brian': 'aura-zeus-en',
        'default': 'aura-asteria-en'
    };

    useEffect(() => {
        if (DiscussionRoomData) {
            const Expert = CoachingExpert.find(item => item.name === DiscussionRoomData.expertName);
            setExpert(Expert);
        }
    }, [DiscussionRoomData]);

    const formatTime = (secs) => {
        const mins = Math.floor(secs / 60);
        const remainingSecs = secs % 60;
        return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
    };

    const triggerMinuteBilling = async () => {
        const currentUserId = userDataRef.current?._id;
        const currentCredits = userDataRef.current?.credits;
        if (currentUserId) {
            try {
                const nextCredits = Math.max(0, Number(currentCredits) - 2);
                const result = await updateUserToken({
                    id: currentUserId,
                    credits: nextCredits
                });
                if (result && typeof result.credits === 'number') {
                    setUserData(prev => ({
                        ...prev,
                        credits: result.credits
                    }));
                    if (result.credits <= 0) {
                        toast('You have exhausted your credits. Please upgrade to continue.');
                        stopMicStream();
                        stopSpeakerAudio();
                        if (agentClientRef.current) {
                            agentClientRef.current.disconnect();
                            agentClientRef.current = null;
                        }
                        setEnableMic(false);
                        setConnected(false);
                    }
                }
            } catch (err) {
                console.error("❌ Billing error:", err);
            }
        }
    };

    // Live Session Timer & Billing System
    useEffect(() => {
        let timerInterval;
        if (connected) {
            // Charge the first minute (2 credits) right when connection starts
            const chargeFirstMinute = async () => {
                const currentUserId = userDataRef.current?._id;
                const currentCredits = userDataRef.current?.credits;
                if (currentUserId) {
                    try {
                        const nextCredits = Math.max(0, Number(currentCredits) - 2);
                        const result = await updateUserToken({
                            id: currentUserId,
                            credits: nextCredits
                        });
                        if (result && typeof result.credits === 'number') {
                            setUserData(prev => ({
                                ...prev,
                                credits: result.credits
                            }));
                        }
                    } catch (err) {
                        console.error("❌ Initial billing error:", err);
                    }
                }
            };
            chargeFirstMinute();

            setSessionTime(0);
            timerInterval = setInterval(() => {
                setSessionTime(prev => {
                    const nextTime = prev + 1;
                    // Every 60 seconds (1 minute), charge another 2 credits
                    if (nextTime > 0 && nextTime % 60 === 0) {
                        triggerMinuteBilling();
                    }
                    return nextTime;
                });
            }, 1000);
        } else {
            setSessionTime(0);
        }

        return () => {
            if (timerInterval) {
                clearInterval(timerInterval);
            }
        };
    }, [connected]);

    // === BROWSER SPEAKER AUDIO PLAYBACK ===
    const getAudioContext = async () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }
        return audioContextRef.current;
    };

    const stopSpeakerAudio = () => {
        if (currentAudioSourceRef.current) {
            try {
                currentAudioSourceRef.current.stop();
            } catch (e) {
                // Already stopped
            }
            currentAudioSourceRef.current = null;
        }
        audioQueueRef.current = [];
        nextStartTimeRef.current = 0;
        setIsAgentSpeaking(false);
    };

    const playAgentAudioChunk = async (audioChunk) => {
        try {
            const audioContext = await getAudioContext();
            const currentTime = audioContext.currentTime;

            if (nextStartTimeRef.current < currentTime) {
                nextStartTimeRef.current = currentTime;
            }

            audioQueueRef.current.push(audioChunk);

            while (audioQueueRef.current.length > 0) {
                const chunk = audioQueueRef.current.shift();
                const audioData = new Int16Array(chunk.buffer);

                if (audioData.length === 0) continue;

                // Create mono channel buffer at Deepgram Agent default 24kHz rate
                const buffer = audioContext.createBuffer(1, audioData.length, 24000);
                const channelData = buffer.getChannelData(0);

                // Convert Int16 PCM samples to Float32 [-1, 1]
                for (let i = 0; i < audioData.length; i++) {
                    channelData[i] = audioData[i] / 0x7FFF;
                }

                const source = audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(audioContext.destination);

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current += buffer.duration;
                setIsAgentSpeaking(true);

                source.onended = () => {
                    // Reset speaking state when queue plays to completion
                    if (audioContext.currentTime >= nextStartTimeRef.current - 0.1) {
                        if (audioQueueRef.current.length === 0) {
                            setIsAgentSpeaking(false);
                        }
                    }
                };

                currentAudioSourceRef.current = source;
            }
        } catch (error) {
            console.error("❌ Audio Queue error:", error);
        }
    };

    // === MICROPHONE RECORDING & STREAMING ===
    const startMicStream = async (clientInstance) => {
        try {
            const isFirefox = navigator.userAgent.includes('Firefox');
            
            // Build browser constraints
            const constraints = isFirefox ? {
                audio: { echoCancellation: true }
            } : {
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: 24000,
                    channelCount: 1
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            const micContext = new (window.AudioContext || window.webkitAudioContext)({
                sampleRate: isFirefox ? undefined : 24000
            });
            micAudioContextRef.current = micContext;

            const source = micContext.createMediaStreamSource(stream);
            micSourceRef.current = source;

            // ScriptProcessor captures small PCM packets for real-time latency
            const processor = micContext.createScriptProcessor(2048, 1, 1);
            micProcessorRef.current = processor;

            processor.onaudioprocess = (e) => {
                if (!clientInstance || clientInstance.connectionState === 'closed') return;

                const inputData = e.inputBuffer.getChannelData(0);
                let processedData = inputData;

                // Handle downsampling from Firefox default 48kHz to 24kHz
                if (isFirefox && e.inputBuffer.sampleRate === 48000) {
                    const downsampledLength = Math.floor(inputData.length / 2);
                    processedData = new Float32Array(downsampledLength);
                    for (let i = 0; i < downsampledLength; i++) {
                        processedData[i] = inputData[i * 2];
                    }
                }

                // Normalization
                const pcmData = new Int16Array(processedData.length);
                for (let i = 0; i < processedData.length; i++) {
                    const sample = Math.max(-1, Math.min(1, processedData[i]));
                    pcmData[i] = Math.round(sample * 0x7FFF);
                }

                try {
                    clientInstance.send(pcmData.buffer);
                } catch (err) {
                    console.error("❌ Send error:", err);
                }
            };

            source.connect(processor);
            processor.connect(micContext.destination);
            setIsRecording(true);
        } catch (error) {
            console.error("❌ Mic access error:", error);
            toast(`Microphone error: ${error.message}`);
        }
    };

    const stopMicStream = () => {
        if (micProcessorRef.current) {
            micProcessorRef.current.disconnect();
            micProcessorRef.current = null;
        }
        if (micSourceRef.current) {
            micSourceRef.current.disconnect();
            micSourceRef.current = null;
        }
        if (micAudioContextRef.current) {
            micAudioContextRef.current.close();
            micAudioContextRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsRecording(false);
    };

    // === START V2V DEEPGRAM SESSION ===
    const connectToServer = async () => {
        setLoading(true);
        const currentCredits = Number(userData?.credits ?? 0);
        
        if (currentCredits <= 0) {
            toast('You have no credits left — please upgrade to continue.');
            setLoading(false);
            return;
        }
        try {
            // 1. Fetch short-lived token from our secure proxy route
            const tokenResponse = await fetch('/api/token');
            if (!tokenResponse.ok) {
                const text = await tokenResponse.text();
                throw new Error(text || "Failed to fetch temporary voice agent token.");
            }
            const { token } = await tokenResponse.json();

            // 2. Initialize Agent client using the short-lived proxy token
            const agentClient = new DeepgramClient({ key: token }).agent();
            agentClientRef.current = agentClient;

            // 3. Set up event handlers
            agentClient.once(AgentEvents.Welcome, () => {
                const coachingOption = CoachingOptions.find(item => item.name === DiscussionRoomData.coachingOption);
                const customPrompt = coachingOption.prompt.replace('{user_topic}', DiscussionRoomData.topic);

                const voice = voiceMap[expert?.name] || voiceMap.default;

                const settings = {
                    audio: {
                        input: { encoding: "linear16", sample_rate: 24000 },
                        output: { encoding: "linear16", sample_rate: 24000, container: "none" }
                    },
                    agent: {
                        greeting: `Hi there! I'm ${expert?.name}, your ${DiscussionRoomData?.coachingOption} coach. Welcome to our session on ${DiscussionRoomData?.topic}. Let's get started.`,
                        listen: { provider: { type: "deepgram", model: "nova-2" } },
                        speak: { provider: { type: "deepgram", model: voice } },
                        think: { 
                            provider: { type: "open_ai", model: "gpt-4o" },
                            prompt: customPrompt
                        }
                    }
                };

                agentClient.configure(settings);
            });

            agentClient.once(AgentEvents.SettingsApplied, () => {
                setConnected(true);
                setEnableMic(true);
                setLoading(false);
                toast('Connected to Deepgram Voice Agent!');

                // Start Streaming Microphone input
                startMicStream(agentClient);
            });

            agentClient.on(AgentEvents.Audio, (audioChunk) => {
                playAgentAudioChunk(audioChunk);
            });

            agentClient.on(AgentEvents.UserStartedSpeaking, () => {
                // Interruption Support: halt playback immediately and clear queue
                stopSpeakerAudio();
            });

            agentClient.on(AgentEvents.ConversationText, async (message) => {
                // Direct V2V transcripts
                setConversation(prev => [...prev, {
                    role: message.role,
                    content: message.content
                }]);
                
                // Track current interim speech
                if (message.role === 'user') {
                    setTranscribe(message.content);
                }

                // Billing removed per character, now per minute
            });

            agentClient.on(AgentEvents.Error, (err) => {
                console.error("❌ Agent error:", err);
                const errMsg = err?.message || JSON.stringify(err) || "Unknown connection error";
                toast(`Agent error: ${errMsg}`);
            });

            agentClient.on(AgentEvents.Close, () => {
                setConnected(false);
            });

            agentClient.keepAlive();
            const interval = setInterval(() => {
                if (agentClientRef.current) {
                    agentClientRef.current.keepAlive();
                } else {
                    clearInterval(interval);
                }
            }, 8000);

        } catch (error) {
            console.error("❌ Connection failed:", error);
            setLoading(false);
            toast(`Connection failed: ${error.message}`);
        }
    };

    // === END DEEPGRAM SESSION ===
    const disconnect = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Stop input microphone streaming
            stopMicStream();

            // Stop output audio queue
            stopSpeakerAudio();

            // Disconnect Deepgram WebSocket client
            if (agentClientRef.current) {
                agentClientRef.current.disconnect();
                agentClientRef.current = null;
            }

            // Close Audio Contexts
            if (audioContextRef.current) {
                await audioContextRef.current.close();
                audioContextRef.current = null;
            }

            setEnableMic(false);
            setConnected(false);
            setTranscribe('');
            toast('Disconnected!');

            // Save conversation state to database
            await UpdateConversation({
                id: DiscussionRoomData._id,
                conversation: conversation
            });
        } catch (error) {
            console.error("❌ Disconnect error:", error);
        } finally {
            setLoading(false);
            setEnableFeedbackNotes(true);
        }
    };

    // Unused, per-minute billing is handled via triggerMinuteBilling inside useEffect

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
                        
                        {/* Live Timer Pill */}
                        {connected && (
                            <div className='absolute top-6 right-6 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md shadow-sm'>
                                <div className='h-1.5 w-1.5 rounded-full bg-indigo-500 animate-pulse'></div>
                                <span className='text-xs font-bold text-indigo-600 dark:text-indigo-400 tracking-wider'>{formatTime(sessionTime)}</span>
                            </div>
                        )}

                        {/* Content */}
                        <div className='relative h-full flex flex-col justify-center items-center p-8'>
                            {/* Avatar */}
                            <div className='relative mb-6'>
                                {isAgentSpeaking && (
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
                                            ${isAgentSpeaking ? 'scale-110 ring-4 ring-primary/30' : ''} transition-all duration-300`}
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
                                    border-4 border-primary/20 shadow-xl ${isAgentSpeaking ? 'scale-110 ring-4 ring-primary/30' : ''} 
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
                            {isAgentSpeaking ? (
                                <div className='flex items-center gap-2 text-primary'>
                                    <div className='flex gap-1'>
                                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce' style={{animationDelay: '0ms'}}></div>
                                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce' style={{animationDelay: '150ms'}}></div>
                                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce' style={{animationDelay: '300ms'}}></div>
                                    </div>
                                    <span className='text-sm font-medium'>Speaking...</span>
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
    );
}

export default DiscussionRoom;