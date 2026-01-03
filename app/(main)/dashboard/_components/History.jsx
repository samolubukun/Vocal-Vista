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
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

function History() {

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
    if (window.confirm('Are you sure you want to delete this lecture? This action cannot be undone.')) {
      try {
        await deleteDiscussionRoom({ id });
        toast('Lecture deleted successfully');
        GetDiscussionRooms(); // Refresh the list
      } catch (error) {
        console.error('Error deleting lecture:', error);
        toast('Failed to delete lecture. Please try again.');
      }
    }
  }

  return (
    <div>
      <h2 className='font-bold text-xl'>Your Previous Lectures</h2>
      {discussionRoomList?.length==0&&<h2 className='text-gray-400'>You don't have any previous lectures</h2>}
      <div className='mt-5'>
  {discussionRoomList.map((item, index)=> (item.coachingOption=='Topic Based Lecture'||item.coachingOption=='Learn Language'||item.coachingOption=='Meditation'||item.coachingOption=='Presentation Practice'||item.coachingOption=='Storytelling'||item.coachingOption=='Pronunciation Drill')&&
        (
          <div key={index} className='border-b-[1px] pb-3 mb-4 group flex justify-between items-center cursor-pointer'>
            <div className='flex gap-7 items-center'>
              <Image src={GetAbstractImages(item.coachingOption)} alt='abstract'
              width={70}
              height={70}
              className='rounded-full h-[50px] w-[50px]'
              />
              <div>
                <h2 className='font-bold'>{item.topic}</h2>
                <h2 className='text-gray-400'>{item.coachingOption}</h2>
                <h2 className='text-gray-400 text-sm'>{moment(item._creationTime).fromNow()}</h2>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <Link href={'/view-summery/'+item._id}>
                <Button variant='outline' className='invisible group-hover:visible cursor-pointer'>View Notes</Button>
              </Link>
              <Button 
                variant='outline' 
                size='sm'
                onClick={(e) => {
                  e.preventDefault();
                  handleDelete(item._id);
                }}
                className='invisible group-hover:visible cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50'
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default History