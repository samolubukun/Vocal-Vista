import React, { useContext, useState } from 'react'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea'
import { CoachingExpert } from '@/services/Options'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { UserContext } from '@/app/_context/UserContext'
  

function UserInputDialog({children, coachingOption}) {
    const [selectedExpert, setSelectedExpert] = useState();
    const [topic, setTopic] = useState();
    const createDiscussionRoom = useMutation(api.DiscussionRoom.CreateNewRoom);
    const [loading,setLoading]=useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const router=useRouter();
    const {userData}=useContext(UserContext);

    const OnClickNext = async()=>{
        setLoading(true);
        const result=await createDiscussionRoom({
            topic:topic,
            coachingOption:coachingOption?.name,
            expertName:selectedExpert,
            uid:userData?._id
        });
        console.log(result);
        setLoading(false);
        setOpenDialog(false);
        router.push('/discussion-room/' + result);
    }

    return (
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-lg rounded-3xl p-6 md:p-8">
          <DialogHeader className="text-left">
            <DialogTitle className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <span>{coachingOption.name}</span>
            </DialogTitle>
            <DialogDescription asChild>
              <div className='mt-4 space-y-6'>
                  <div className="space-y-2">
                      <h2 className='text-foreground font-semibold text-sm'>
                        Enter a practice topic or scenario
                      </h2>
                      <Textarea 
                        placeholder="e.g. Preparing for a senior engineer system design interview, or overcoming public speaking fillers..." 
                        className='min-h-[90px] rounded-xl border-border bg-muted/20 focus-visible:ring-primary text-foreground text-sm' 
                        onChange={(e)=>setTopic(e.target.value)}
                      />
                  </div>

                  <div className="space-y-3">
                      <h2 className='text-foreground font-semibold text-sm'>
                        Select your specialized coaching expert
                      </h2>
                      <div className='grid grid-cols-5 gap-3.5'>
                          {CoachingExpert.map((expert,index)=>(
                              <div 
                                key={index} 
                                onClick={()=>setSelectedExpert(expert.name)}
                                className="flex flex-col items-center gap-1.5 cursor-pointer group"
                              >
                                  <div className="relative">
                                      <Image src={expert.avatar} alt={expert.name} 
                                          width={80}
                                          height={80}
                                          className={`rounded-2xl h-14 w-14 object-cover transition-all shadow-sm
                                          ${selectedExpert === expert.name 
                                              ? 'ring-2 ring-primary ring-offset-2 scale-105' 
                                              : 'border border-border opacity-70 group-hover:opacity-100 group-hover:scale-105'
                                          }`}
                                      />
                                  </div>
                                  <span className={`text-xs font-bold transition-colors ${
                                      selectedExpert === expert.name 
                                          ? 'text-primary' 
                                          : 'text-muted-foreground'
                                  }`}>
                                      {expert.name}
                                  </span>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className='flex gap-3 justify-end pt-4 border-t border-border/60'>
                    <DialogClose asChild>
                        <Button variant='ghost' className='cursor-pointer rounded-xl font-semibold text-sm px-5'>Cancel</Button>
                    </DialogClose>
                    <Button 
                        disabled={(!topic || !selectedExpert || loading)} 
                        onClick={OnClickNext} 
                        className='cursor-pointer rounded-xl font-semibold text-sm px-6 flex items-center gap-2 shadow-sm'
                    >
                        {loading && <LoaderCircle className='animate-spin w-4 h-4' />}
                        Start Session
                    </Button>
                  </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
}

export default UserInputDialog