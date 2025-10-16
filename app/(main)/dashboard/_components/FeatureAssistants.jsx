"use client"
import { BlurFade } from '@/components/magicui/blur-fade';
import { Button } from '@/components/ui/button';
import { CoachingOptions } from '@/services/Options';
import { useUser } from '@stackframe/stack'
import Image from 'next/image';
import React from 'react'
import UserInputDialog from './UserInputDialog';
import ProfileDailog from './ProfileDailog';
import { Sparkles, ArrowRight } from 'lucide-react';

function FeatureAssistants() {
    const user = useUser();
    return (
        <div>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
                <div>
                    <div className='flex items-center gap-2 mb-2'>
                        <Sparkles className='w-5 h-5 text-primary' />
                        <h2 className='font-medium text-muted-foreground'>My Workspace</h2>
                    </div>
                    <h2 className='text-3xl md:text-4xl font-bold text-foreground'>
                        Welcome back, {user?.displayName || 'Coach'}
                    </h2>
                    <p className='text-muted-foreground mt-2'>Choose a coaching mode to begin your session</p>
                </div>
                <ProfileDailog>
                    <Button className='cursor-pointer shadow-sm hover:shadow-md transition-all'>
                        View Profile
                    </Button>
                </ProfileDailog>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-10'>
                {CoachingOptions.map((option,index)=>(
                    <BlurFade key={option.icon} delay={0.1 + index * 0.05} inView>
                        <UserInputDialog coachingOption={option}>
                            <div className='group relative p-5 bg-card border border-border rounded-2xl 
                            hover:border-primary/50 transition-all duration-300 cursor-pointer
                            hover:shadow-xl hover:-translate-y-1 flex flex-col justify-center items-center'>
                                <div className='relative mb-4'>
                                    <div className='absolute inset-0 bg-primary/10 rounded-full blur-xl 
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                                    <Image 
                                        src={option.icon} 
                                        alt={option.name} 
                                        width={150}
                                        height={150}
                                        className='h-[80px] w-[80px] object-contain group-hover:scale-110 
                                        transition-transform duration-300 relative z-10'
                                    />
                                </div>
                                <h2 className='text-sm font-semibold text-center text-card-foreground mb-1'>
                                    {option.name}
                                </h2>
                                <div className='flex items-center gap-1 text-xs text-primary opacity-0 
                                group-hover:opacity-100 transition-opacity duration-300'>
                                    <span>Start</span>
                                    <ArrowRight className='w-3 h-3' />
                                </div>
                            </div>
                        </UserInputDialog>
                    </BlurFade>
                ))}
            </div>
        </div>
    )
}

export default FeatureAssistants