'use client'
import { api } from '@/convex/_generated/api';
import { CoachingOptions } from '@/services/Options';
import { useQuery } from 'convex/react';
import moment from 'moment';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import ChatBox from '../../discussion-room/[roomid]/_components/ChatBox';
import SummaryBox from '../_components/SummaryBox';

function ViewSummery() {
    const {roomid}=useParams();
    const DiscussionRoomData = useQuery(api.DiscussionRoom.GetDiscussionRoom, { id: roomid });
    const router = useRouter();
    console.log(DiscussionRoomData);

    const GetAbstractImages = (option)=>{
      const coachingOption=CoachingOptions.find((item)=>item.name==option)

      return coachingOption?.abstract??'/ab1.png';
    }
    
    return (
        <div className="space-y-8">
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border/60 pb-6'>
                <div className='flex gap-4 items-center'>
                    <button
                        onClick={() => router.push('/dashboard')}
                        aria-label='Back to dashboard'
                        className='inline-flex items-center justify-center w-10 h-10 rounded-xl border border-border bg-card hover:bg-muted text-foreground transition-all shadow-sm cursor-pointer shrink-0'
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <Image src={GetAbstractImages(DiscussionRoomData?.coachingOption)} alt='abstract'
                        width={70}
                        height={70}
                        className='w-14 h-14 rounded-full object-cover border border-border shadow-sm'
                    />
                    <div className="space-y-0.5">
                      <h1 className='font-extrabold text-xl sm:text-2xl text-foreground tracking-tight leading-snug'>{DiscussionRoomData?.topic || "Loading Session..."}</h1>
                      <p className='text-xs sm:text-sm font-semibold text-primary'>{DiscussionRoomData?.coachingOption}</p>
                    </div>
                </div>
                <div className='flex items-center justify-end gap-4'>
                    <span className='text-xs font-medium text-muted-foreground'>{moment(DiscussionRoomData?._creationTime).fromNow()}</span>
                </div>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-5 gap-8'>
                <div className='lg:col-span-3 space-y-4'>
                    <h2 className='text-lg font-bold text-foreground flex items-center gap-2'>
                      Summary Analysis Report
                    </h2>
                    <SummaryBox 
                        summery={DiscussionRoomData?.summery} 
                        coachingOption={DiscussionRoomData?.coachingOption}
                        conversation={DiscussionRoomData?.conversation}
                        roomid={roomid}
                    />
                </div>
                <div className='lg:col-span-2 space-y-4'>
                    <h2 className='text-lg font-bold text-foreground flex items-center gap-2'>
                      Dialogue Record Transcript
                    </h2>
                    {DiscussionRoomData?.conversation && (
                        <div className="border border-border/80 rounded-3xl p-1 bg-card/40 shadow-sm overflow-hidden">
                            <ChatBox 
                                conversation={DiscussionRoomData?.conversation} 
                                coachingOption={DiscussionRoomData?.coachingOption}
                                enableFeedbackNotes={false}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ViewSummery