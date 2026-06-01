'use client'
import { UserContext } from '@/app/_context/UserContext';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { CoachingOptions } from '@/services/Options';
import { useConvex, useMutation } from 'convex/react'
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';


function Feedback({ limit }) {
  const convex=useConvex();
  const {userData}=useContext(UserContext);
  const [discussionRoomList,setDiscussionRoomList]=useState([]);
  const deleteDiscussionRoom = useMutation(api.DiscussionRoom.DeleteDiscussionRoom);

  useEffect(()=>{
    userData&&GetDiscussionRooms();
  },[userData])
  const GetDiscussionRooms=async()=>{
    const result = await convex.query(api.DiscussionRoom.GetAllDiscussionRoom,{
      uid:userData?._id
    });
    console.log(result);
    setDiscussionRoomList(result);
  }

  const GetAbstractImages = (option)=>{
    const coachingOption=CoachingOptions.find((item)=>item.name==option)

    return coachingOption?.abstract??'/ab1.png';
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this feedback? This action cannot be undone.')) {
      try {
        await deleteDiscussionRoom({ id });
        toast('Feedback deleted successfully');
        GetDiscussionRooms(); // Refresh the list
      } catch (error) {
        console.error('Error deleting feedback:', error);
        toast('Failed to delete feedback. Please try again.');
      }
    }
  }

  const filteredList = discussionRoomList.filter((item)=> 
    item.coachingOption=='Mock Interview'||
    item.coachingOption=='Ques Ans Prep'||
    item.coachingOption=='Debate Practice'||
    item.coachingOption=='Confidence Coaching'
  );

  const displayList = limit ? filteredList.slice(0, limit) : filteredList;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start sm:items-center gap-4">
        <div className="space-y-0.5">
          <h2 className='font-bold text-xl text-foreground flex items-center gap-2'>
            Feedback
          </h2>
          <p className='text-xs text-muted-foreground'>Detailed analysis of your interviews, debates, and Q&A sparring sessions.</p>
        </div>
        {limit && (
          <Link href="/my-sessions">
            <Button variant="ghost" size="sm" className="cursor-pointer text-xs font-bold text-muted-foreground hover:text-indigo-600 hover:bg-indigo-500/10 border border-transparent px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5">
              View All <ArrowRight size={13} />
            </Button>
          </Link>
        )}
      </div>
      {displayList?.length === 0 && (
        <p className='text-muted-foreground text-sm py-4'>You don't have any previous feedback yet.</p>
      )}
      <div className='divide-y divide-border/60'>
        {displayList.map((item, index)=> (
            <div key={index} className='py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group transition-colors hover:bg-muted/5 rounded-xl px-2'>
              <div className='flex gap-4 items-center'>
                <Image src={GetAbstractImages(item.coachingOption)} alt='abstract'
                  width={60}
                  height={60}
                  className='rounded-full h-12 w-12 object-cover border border-border shadow-sm bg-background'
                />
                <div className="space-y-0.5">
                  <h3 className='font-semibold text-foreground text-sm sm:text-base leading-snug'>{item.topic}</h3>
                  <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground'>
                    <span className="font-medium text-primary">{item.coachingOption}</span>
                    <span className="text-border">•</span>
                    <span className="px-1.5 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold text-[9px] uppercase tracking-wide border border-purple-500/10">Prep</span>
                    <span className="text-border">•</span>
                    <span>{moment(item._creationTime).fromNow()}</span>
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-2 self-end sm:self-center'>
                <Link href={'/view-summary/'+item._id}>
                  <Button 
                    variant='outline' 
                    size='sm' 
                    className='cursor-pointer text-xs font-bold px-3 py-1.5 h-8 transition-all hover:bg-indigo-600 hover:text-white hover:border-indigo-600'
                  >
                    View Feedback
                  </Button>
                </Link>
                <Button 
                  variant='ghost' 
                  size='icon'
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(item._id);
                  }}
                  className='cursor-pointer h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10'
                  aria-label="Delete feedback"
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default Feedback