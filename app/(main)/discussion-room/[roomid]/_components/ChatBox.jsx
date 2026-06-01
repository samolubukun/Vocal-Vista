import { Button } from '@/components/ui/button'
import { api } from '@/convex/_generated/api';
import { AIModelToGenerateFeedbackAndNotes } from '@/services/GlobalServices'
import { useMutation } from 'convex/react';
import { LoaderCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { toast } from 'sonner';

function ChatBox({conversation,enableFeedbackNotes, coachingOption}) {

    const [loading,setLoading]=useState(false);
    const updateSummary = useMutation(api.DiscussionRoom.UpdateSummery)
    const {roomid}=useParams();
    const router = useRouter();
    
    const GenerateFeedbackNotes=async()=>{
        setLoading(true);
        try{
            const result = await AIModelToGenerateFeedbackAndNotes(coachingOption,conversation);
            console.log(result.content);
            await updateSummary({
                id:roomid,
                summery:result.content
            })
            setLoading(false);
            toast('Feedback/Notes Saved!')
            router.push('/view-summary/' + roomid);
        }
        catch(e)
        {
            setLoading(false);
            toast('Internal server error, Try again!')
        }
    }

    return (
        <div className='flex flex-col h-full'>
            <div className='flex-1 p-4 overflow-auto space-y-3 max-h-[58vh] scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent'>
                {conversation.length === 0 ? (
                    <div className='flex flex-col items-center justify-center h-full text-center p-8'>
                        <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4'>
                            <svg xmlns="http://www.w3.org/2000/svg" className='w-8 h-8 text-primary' fill="none" 
                            viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <p className='text-sm text-muted-foreground'>
                            Your conversation will appear here
                        </p>
                    </div>
                ) : (
                    conversation.map((item, index) => (
                        <div key={index} className={`flex ${item?.role === 'user' ? 'justify-end' : 'justify-start'} 
                        animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                            {item?.role === 'assistant' ? (
                                <div className='max-w-[85%] p-3 px-4 bg-primary/10 backdrop-blur-sm 
                                text-foreground rounded-2xl rounded-tl-sm border border-primary/20 shadow-sm'>
                                    <p className='text-sm leading-relaxed'>{item.content}</p>
                                </div>
                            ) : (
                                <div className='max-w-[85%] p-3 px-4 bg-muted backdrop-blur-sm 
                                text-foreground rounded-2xl rounded-tr-sm border border-border shadow-sm'>
                                    <p className='text-sm leading-relaxed'>{item.content}</p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
            
            {enableFeedbackNotes && (
                <div className='p-4 border-t border-border bg-muted/50'>
                    <Button 
                        onClick={GenerateFeedbackNotes} 
                        disabled={loading} 
                        className='w-full py-6 text-sm font-medium rounded-xl shadow-sm 
                        hover:shadow-md transition-all hover:scale-[1.02]'
                    >
                        {loading && <LoaderCircle className='animate-spin mr-2' />}
                        Generate Feedback & Notes
                    </Button>
                </div>
            )}
        </div>
    )
}

export default ChatBox