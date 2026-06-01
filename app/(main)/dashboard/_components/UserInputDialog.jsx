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
  

const impromptuTopics = [
    "Should artificial intelligence have human rights?",
    "Why coffee is the greatest invention in human history.",
    "If you could travel back in time, what advice would you give your teenage self?",
    "Should social media apps be banned for children under sixteen?",
    "Is landing on Mars worth the astronomical financial cost?",
    "Why remote work is superior to returning to traditional physical offices.",
    "The profound impact of vocal training on modern executive leaders.",
    "If you could immediately master any foreign language, which one and why?",
    "Why public speaking skills are more critical than core technical coding skills."
];

function UserInputDialog({children, coachingOption}) {
    const [selectedExpert, setSelectedExpert] = useState();
    const [topic, setTopic] = useState();
    const [isChallenge, setIsChallenge] = useState(false);
    const [isCustomScenario, setIsCustomScenario] = useState(false);
    const [jobTitle, setJobTitle] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [focusPoints, setFocusPoints] = useState("");

    const createDiscussionRoom = useMutation(api.DiscussionRoom.CreateNewRoom);
    const [loading,setLoading]=useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const router=useRouter();
    const {userData}=useContext(UserContext);

    const OnClickNext = async()=>{
        setLoading(true);
        const randomTopic = impromptuTopics[Math.floor(Math.random() * impromptuTopics.length)];
        const result=await createDiscussionRoom({
            topic: isChallenge ? `Impromptu Challenge: ${randomTopic}` : (isCustomScenario ? `Interview Prep for ${jobTitle} at ${companyName}` : topic),
            coachingOption: coachingOption?.name,
            expertName: selectedExpert,
            uid: userData?._id,
            isChallenge: isChallenge,
            challengeTopic: isChallenge ? randomTopic : undefined,
            challengeTimeLimit: isChallenge ? 60 : undefined,
            customScenario: isCustomScenario ? {
                jobTitle: jobTitle,
                companyName: companyName || "Target Company",
                focusPoints: focusPoints ? [focusPoints] : ["Behavioral and Technical skills"]
            } : undefined
        });
        console.log(result);
        setLoading(false);
        setOpenDialog(false);
        router.push('/discussion-room/' + result);
    }

    return (
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="max-w-lg rounded-3xl p-6 md:p-8 w-[92vw] sm:w-full">
          <DialogHeader className="text-left mb-2">
            <DialogTitle className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <span>{coachingOption.name}</span>
            </DialogTitle>
            <DialogDescription>
              Configure your practice preferences below to start your real-time session.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-2">
              {/* Mode Toggles using grid grid-cols-3 to guarantee horizontal fit */}
              <div className="grid grid-cols-3 gap-1 p-1 bg-muted/40 rounded-xl border border-border/40">
                  <button
                      type="button"
                      onClick={() => {
                          setIsChallenge(false);
                          setIsCustomScenario(false);
                      }}
                      className={`py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                          !isChallenge && !isCustomScenario
                              ? 'bg-background text-primary shadow-sm border border-border/20'
                              : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                      Regular
                  </button>
                  <button
                      type="button"
                      onClick={() => {
                          setIsChallenge(true);
                          setIsCustomScenario(false);
                      }}
                      className={`py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                          isChallenge
                              ? 'bg-background text-indigo-500 shadow-sm border border-border/20'
                              : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                      ⚡ Challenge
                  </button>
                  <button
                      type="button"
                      onClick={() => {
                          setIsChallenge(false);
                          setIsCustomScenario(true);
                      }}
                      className={`py-2 rounded-lg text-[10px] sm:text-xs font-bold transition-all cursor-pointer ${
                          isCustomScenario
                              ? 'bg-background text-purple-500 shadow-sm border border-border/20'
                              : 'text-muted-foreground hover:text-foreground'
                      }`}
                  >
                      🎯 Custom Prep
                  </button>
              </div>

              {/* Impromptu Challenge Active Indicator */}
              {isChallenge && (
                  <div className="p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                      <h4 className="text-xs font-extrabold text-indigo-500 uppercase tracking-wider">1-Min Impromptu Challenge</h4>
                      <p className="text-xs text-muted-foreground leading-normal">
                          You will be given a surprise random topic. Speak clearly for 60 seconds without exceeding 3 filler words to earn bonus badges!
                      </p>
                  </div>
              )}

              {/* Custom Scenario Form */}
              {isCustomScenario && (
                  <div className="space-y-3.5 p-4 bg-purple-500/5 rounded-2xl border border-purple-500/10 animate-in fade-in slide-in-from-top-1 duration-200">
                      <h4 className="text-xs font-extrabold text-purple-500 uppercase tracking-wider">Configure Custom Interview</h4>
                      <div className="space-y-3">
                          <div>
                              <label className="block text-[11px] font-bold text-foreground mb-1 uppercase tracking-wider">Target Role / Job Title</label>
                              <input 
                                  type="text"
                                  placeholder="e.g. Senior Software Engineer"
                                  value={jobTitle}
                                  onChange={(e) => setJobTitle(e.target.value)}
                                  className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                              />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                              <div>
                                  <label className="block text-[11px] font-bold text-foreground mb-1 uppercase tracking-wider">Target Company</label>
                                  <input 
                                      type="text"
                                      placeholder="e.g. Google"
                                      value={companyName}
                                      onChange={(e) => setCompanyName(e.target.value)}
                                      className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                  />
                              </div>
                              <div>
                                  <label className="block text-[11px] font-bold text-foreground mb-1 uppercase tracking-wider">Focus Points</label>
                                  <input 
                                      type="text"
                                      placeholder="e.g. Behavioral / Tech"
                                      value={focusPoints}
                                      onChange={(e) => setFocusPoints(e.target.value)}
                                      className="w-full px-3 py-2 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                                  />
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {/* Regular Topic Input */}
              {!isChallenge && !isCustomScenario && (
                  <div className="space-y-2">
                      <h2 className="text-foreground font-semibold text-sm">
                        Enter a practice topic or scenario
                      </h2>
                      <Textarea 
                        placeholder="e.g. Preparing for a senior engineer system design interview, or overcoming public speaking fillers..." 
                        className="min-h-[90px] rounded-xl border-border bg-muted/20 focus-visible:ring-primary text-foreground text-sm" 
                        onChange={(e)=>setTopic(e.target.value)}
                      />
                  </div>
              )}

              {/* Specialized Coaching Expert Selection */}
              <div className="space-y-3">
                  <h2 className="text-foreground font-semibold text-sm">
                    Select your specialized coaching expert
                  </h2>
                  <div className="grid grid-cols-5 gap-2.5">
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
                                      className={`rounded-2xl h-12 w-12 sm:h-14 sm:w-14 object-cover transition-all shadow-sm
                                      ${selectedExpert === expert.name 
                                          ? 'ring-2 ring-primary ring-offset-2 scale-105' 
                                          : 'border border-border opacity-70 group-hover:opacity-100 group-hover:scale-105'
                                      }`}
                                  />
                              </div>
                              <span className={`text-[10px] sm:text-xs font-bold transition-colors ${
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

              {/* Form Footer Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-border/60">
                <DialogClose asChild>
                    <Button variant="ghost" className="cursor-pointer rounded-xl font-semibold text-sm px-5">Cancel</Button>
                </DialogClose>
                <Button 
                    disabled={
                        (!isChallenge && !isCustomScenario && !topic) || 
                        (isCustomScenario && !jobTitle) ||
                        !selectedExpert || 
                        loading
                    } 
                    onClick={OnClickNext} 
                    className="cursor-pointer rounded-xl font-semibold text-sm px-6 flex items-center gap-2 shadow-sm"
                >
                    {loading && <LoaderCircle className="animate-spin w-4 h-4" />}
                    Start Session
                </Button>
              </div>
          </div>
        </DialogContent>
      </Dialog>
    )
}

export default UserInputDialog