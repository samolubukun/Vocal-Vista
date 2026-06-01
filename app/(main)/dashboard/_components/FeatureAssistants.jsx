"use client"
import { BlurFade } from '@/components/magicui/blur-fade';
import { Button } from '@/components/ui/button';
import { CoachingOptions } from '@/services/Options';
import { useUser } from '@stackframe/stack'
import Image from 'next/image';
import React from 'react'
import UserInputDialog from './UserInputDialog';
import ProfileDailog from './ProfileDailog';
import { Sparkles, ArrowRight, Layers, BookOpen, MessageSquare } from 'lucide-react';
import { useState } from 'react';

function FeatureAssistants() {
    const user = useUser();
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredOptions = CoachingOptions.filter((option) => {
        const isLecture = 
            option.name === 'Topic Based Lecture' ||
            option.name === 'Learn Language' ||
            option.name === 'Meditation' ||
            option.name === 'Presentation Practice' ||
            option.name === 'Storytelling' ||
            option.name === 'Pronunciation Drill';
            
        if (activeFilter === 'lectures') return isLecture;
        if (activeFilter === 'feedback') return !isLecture;
        return true;
    });

    const isLectureMode = (name) => {
        return name === 'Topic Based Lecture' ||
            name === 'Learn Language' ||
            name === 'Meditation' ||
            name === 'Presentation Practice' ||
            name === 'Storytelling' ||
            name === 'Pronunciation Drill';
    }

    return (
        <div>
            <div className='flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8 border-b border-border/40 pb-6'>
                <div>
                    <div className='flex items-center gap-2 mb-2'>
                        <Sparkles className='w-5 h-5 text-primary' />
                        <h2 className='font-medium text-muted-foreground'>My Workspace</h2>
                    </div>
                    <h2 className='text-3xl md:text-4xl font-bold text-foreground tracking-tight'>
                        Welcome back, {user?.displayName || 'Coach'}
                    </h2>
                    <p className='text-muted-foreground mt-1 text-sm sm:text-base'>Choose a coaching mode to begin your session</p>
                </div>
                
                {/* Premium Segmented Filter Tab */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto self-stretch lg:self-center">
                    <div className="bg-muted/40 p-1 rounded-2xl border border-border/60 flex items-center gap-1 shadow-sm overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden w-full sm:w-auto">
                        <button 
                            onClick={() => setActiveFilter('all')}
                            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                                activeFilter === 'all' 
                                    ? 'bg-background text-primary shadow-sm border border-border/40' 
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <Layers size={13} className="shrink-0" />
                            <span>All Modes</span>
                        </button>
                        <button 
                            onClick={() => setActiveFilter('lectures')}
                            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                                activeFilter === 'lectures' 
                                    ? 'bg-background text-indigo-600 dark:text-indigo-400 shadow-sm border border-border/40' 
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <BookOpen size={13} className="shrink-0" />
                            <span>Lectures & Speeches</span>
                        </button>
                        <button 
                            onClick={() => setActiveFilter('feedback')}
                            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-[10px] sm:text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                                activeFilter === 'feedback' 
                                    ? 'bg-background text-purple-600 dark:text-purple-400 shadow-sm border border-border/40' 
                                    : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                            <MessageSquare size={13} className="shrink-0" />
                            <span>Prep & Feedback</span>
                        </button>
                    </div>
                    <ProfileDailog>
                        <Button className='w-full sm:w-auto cursor-pointer shadow-sm hover:shadow-md transition-all h-10 px-4 rounded-xl font-bold text-xs'>
                            View Profile
                        </Button>
                    </ProfileDailog>
                </div>
            </div>

            {/* Unified Grid with Dynamic Categorized Badges */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-6'>
                {filteredOptions.map((option, index) => {
                    const lecture = isLectureMode(option.name);
                    return (
                        <BlurFade key={option.icon} delay={0.02 + index * 0.02} inView>
                            <UserInputDialog coachingOption={option}>
                                <div className={`group relative p-5 bg-card border rounded-3xl 
                                transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 
                                flex flex-col justify-center items-center h-full min-h-[170px] ${
                                    lecture ? 'hover:border-indigo-500/40' : 'hover:border-purple-500/40'
                                }`}>
                                    
                                    {/* Category Indicator Badge */}
                                    <span className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase ${
                                        lecture 
                                            ? 'bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 border-indigo-500/10' 
                                            : 'bg-purple-500/5 text-purple-600 dark:text-purple-400 border-purple-500/10'
                                    }`}>
                                        {lecture ? 'Lecture' : 'Prep'}
                                    </span>

                                    <div className='relative mb-4 mt-2'>
                                        <div className={`absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                                            lecture ? 'bg-indigo-500/10' : 'bg-purple-500/10'
                                        }`}></div>
                                        <Image 
                                            src={option.icon} 
                                            alt={option.name} 
                                            width={150}
                                            height={150}
                                            className='h-[75px] w-[75px] object-contain group-hover:scale-110 
                                            transition-transform duration-300 relative z-10'
                                        />
                                    </div>
                                    <h2 className='text-xs sm:text-sm font-bold text-center text-card-foreground mb-1 leading-snug'>
                                        {option.name}
                                    </h2>
                                    <div className={`flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold ${
                                        lecture ? 'text-indigo-500' : 'text-purple-500'
                                    }`}>
                                        <span>Start</span>
                                        <ArrowRight className='w-3 h-3' />
                                    </div>
                                </div>
                            </UserInputDialog>
                        </BlurFade>
                    )
                })}
            </div>
        </div>
    )
}

export default FeatureAssistants