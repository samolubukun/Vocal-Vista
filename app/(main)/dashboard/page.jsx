"use client"
import React, { useContext } from 'react'
import FeatureAssistants from './_components/FeatureAssistants'
import History from './_components/History'
import Feedback from './_components/Feedback'
import { UserContext } from '@/app/_context/UserContext'
import { Award, Flame } from 'lucide-react'

function Dashboard() {
  const { userData } = useContext(UserContext);

  return (
    <div className='space-y-12 pb-16'>
        <FeatureAssistants />

        {/* Real-time Gamified Speaking Mastery Panel */}
        <div className="bg-card border border-border rounded-3xl p-6 md:p-8 bg-gradient-to-br from-card via-card to-primary/5 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-border/40">
                <div className="space-y-1">
                    <h2 className="text-xl font-extrabold text-foreground flex items-center gap-2">
                        <Award className="w-5.5 h-5.5 text-primary" />
                        <span>🏆 Speaking Mastery & Badge Milestones</span>
                    </h2>
                    <p className="text-xs text-muted-foreground">Level up your speaking skills and earn active badges by practicing daily.</p>
                </div>
                <div className="flex items-center gap-2">
                    {userData?.streakCount ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-black uppercase tracking-wider shadow-sm animate-pulse">
                            <Flame className="w-4 h-4 fill-amber-500" />
                            <span>🔥 {userData.streakCount} Day Streak</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-muted border border-border text-muted-foreground text-xs font-black uppercase tracking-wider shadow-sm">
                            <Flame className="w-4 h-4" />
                            <span>0 Day Streak</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Badge 1: Consistency Pro (5 Day Streak) */}
                    <div className={`relative p-5 rounded-2xl border transition-all hover:shadow-md ${
                        userData?.streakCount && userData.streakCount >= 5
                            ? 'bg-amber-500/5 border-amber-500/20 text-amber-500'
                            : 'bg-muted/10 border-border/40 text-muted-foreground opacity-60'
                    }`}>
                        <div className="flex items-center gap-4">
                            <span className="text-3xl p-2.5 bg-background rounded-xl border border-border/40 shadow-sm animate-bounce" style={{ animationDuration: '3s' }}>🔥</span>
                            <div className="space-y-0.5">
                                <h3 className="text-sm font-extrabold text-foreground leading-tight">Consistency Pro</h3>
                                <span className="text-[10px] font-bold opacity-85 block">5 Day Streak</span>
                                <span className="text-[11px] font-bold text-primary mt-1 block">
                                    {userData?.streakCount && userData.streakCount >= 5 ? "✔️ Earned!" : `Progress: ${userData?.streakCount || 0}/5`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Badge 2: Consistency Elite (15 Day Streak) */}
                    <div className={`relative p-5 rounded-2xl border transition-all hover:shadow-md ${
                        userData?.streakCount && userData.streakCount >= 15
                            ? 'bg-amber-600/5 border-amber-600/20 text-amber-600 dark:text-amber-400'
                            : 'bg-muted/10 border-border/40 text-muted-foreground opacity-60'
                    }`}>
                        <div className="flex items-center gap-4">
                            <span className="text-3xl p-2.5 bg-background rounded-xl border border-border/40 shadow-sm animate-bounce" style={{ animationDuration: '4.5s' }}>👑</span>
                            <div className="space-y-0.5">
                                <h3 className="text-sm font-extrabold text-foreground leading-tight">Consistency Elite</h3>
                                <span className="text-[10px] font-bold opacity-85 block font-sans">15 Day Streak</span>
                                <span className="text-[11px] font-bold text-primary mt-1 block">
                                    {userData?.streakCount && userData.streakCount >= 15 ? "✔️ Earned!" : `Progress: ${userData?.streakCount || 0}/15`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Badge 3: Talkative Maestro (10 Speaking Minutes) */}
                    <div className={`relative p-5 rounded-2xl border transition-all hover:shadow-md ${
                        userData?.totalSpeakingMinutes && userData.totalSpeakingMinutes >= 10
                            ? 'bg-indigo-500/5 border-indigo-500/20 text-indigo-500'
                            : 'bg-muted/10 border-border/40 text-muted-foreground opacity-60'
                    }`}>
                        <div className="flex items-center gap-4">
                            <span className="text-3xl p-2.5 bg-background rounded-xl border border-border/40 shadow-sm animate-bounce" style={{ animationDuration: '4s' }}>🎙️</span>
                            <div className="space-y-0.5">
                                <h3 className="text-sm font-extrabold text-foreground leading-tight">Talkative Maestro</h3>
                                <span className="text-[10px] font-bold opacity-85 block font-sans">10 Mins Active</span>
                                <span className="text-[11px] font-bold text-primary mt-1 block">
                                    {userData?.totalSpeakingMinutes && userData.totalSpeakingMinutes >= 10 ? "✔️ Earned!" : `Progress: ${userData?.totalSpeakingMinutes || 0}/10`}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Badge 4: Vocal Master (60 Speaking Minutes) */}
                    <div className={`relative p-5 rounded-2xl border transition-all hover:shadow-md ${
                        userData?.totalSpeakingMinutes && userData.totalSpeakingMinutes >= 60
                            ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500'
                            : 'bg-muted/10 border-border/40 text-muted-foreground opacity-60'
                    }`}>
                        <div className="flex items-center gap-4">
                            <span className="text-3xl p-2.5 bg-background rounded-xl border border-border/40 shadow-sm animate-bounce" style={{ animationDuration: '5s' }}>🎓</span>
                            <div className="space-y-0.5">
                                <h3 className="text-sm font-extrabold text-foreground leading-tight">Vocal Master</h3>
                                <span className="text-[10px] font-bold opacity-85 block font-sans">60 Mins Active</span>
                                <span className="text-[11px] font-bold text-primary mt-1 block">
                                    {userData?.totalSpeakingMinutes && userData.totalSpeakingMinutes >= 60 ? "✔️ Earned!" : `Progress: ${userData?.totalSpeakingMinutes || 0}/60`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dynamic Achievements Summary Card */}
                <div className="p-5 rounded-2xl border border-border bg-muted/15 space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground">My Earned Badges</h3>
                    {userData?.unlockedBadges && userData.unlockedBadges.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {userData.unlockedBadges.map((badge, idx) => (
                                <span key={idx} className="text-[10px] font-extrabold bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full uppercase tracking-wide">
                                    🎖️ {badge === "DailyStreak5" ? "Consistency Pro" : badge === "DailyStreak15" ? "Consistency Elite" : badge === "Talkative" ? "Talkative Maestro" : badge === "VocalMaster" ? "Vocal Master" : badge}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-xs text-muted-foreground italic leading-relaxed pt-1">
                            Complete your first active session to begin earning badges!
                        </p>
                    )}
                </div>
            </div>
        </div>

        <div id="activity-logs" className='border-t border-border pt-12 scroll-mt-20'>
            <h2 className='text-2xl font-bold text-foreground mb-6'>Your Activity</h2>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                <div className='bg-card border border-border rounded-3xl p-6 hover:shadow-md transition-shadow bg-gradient-to-b from-card to-muted/5'>
                    <History limit={5} />
                </div>
                <div className='bg-card border border-border rounded-3xl p-6 hover:shadow-md transition-shadow bg-gradient-to-b from-card to-muted/5'>
                    <Feedback limit={5} />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard