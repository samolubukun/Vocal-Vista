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
import SummeryBox from '../_components/SummeryBox';

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
        <div className='-mt-10'>
            <div className='flex justify-between items-end'>
                <div className='flex gap-7 items-center'>
                    <Image src={GetAbstractImages(DiscussionRoomData?.coachingOption)} alt='abstract'
                        width={100}
                        height={100}
                        className='w-[70px] h-[70px] rounded-full'
                    />
                    <div>
                      <h2 className='font-bold text-lg'>{DiscussionRoomData?.topic}</h2>
                      <h2 className='text-gray-400'>{DiscussionRoomData?.coachingOption}</h2>
                    </div>
                </div>
                <div className='flex items-center gap-4'>
                    <h2 className='text-gray-400'>{moment(DiscussionRoomData?._creationTime).fromNow()}</h2>
                    <button
                        onClick={() => router.push('/dashboard')}
                        aria-label='Back to dashboard'
                        className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/10 hover:bg-muted/20 text-sm text-primary transition-shadow shadow-sm hover:shadow-md'
                    >
                        <ArrowLeft size={16} />
                        <span className='hidden sm:inline'>Back to dashboard</span>
                    </button>
                </div>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-5 gap-5 mt-5'>
                <div className='col-span-3'>
                    <h2 className='text-lg font-bold mb-6'>Summary of Your Conversation</h2>
                    <SummeryBox summery={DiscussionRoomData?.summery} />
                </div>
                <div className='col-span-2'>
                    <h2 className='text-lg font-bold mb-6'>Your Conversation</h2>
                    {DiscussionRoomData?.conversation&&<ChatBox conversation={DiscussionRoomData?.conversation} 
                        coachingOption={DiscussionRoomData?.coachingOption}
                        enableFeedbackNotes={false}
                    />}
                </div>
            </div>
        </div>
    )
}

export default ViewSummery