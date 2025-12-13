"use client"
import { BlurFade } from '@/components/magicui/blur-fade';
import { Button } from '@/components/ui/button';
import { useUser } from '@stackframe/stack'
import React from 'react'
import ProfileDailog from './ProfileDailog';
import { Sparkles, ArrowRight, Camera, Calendar, TrendingUp, MessageCircle, Lightbulb, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const skinFeatures = [
    {
        name: 'AI Skin Scan',
        icon: Camera,
        description: 'Detect acne, pimples, and eczema with AI',
        href: '/skin-scan',
        color: 'bg-emerald-500/10 text-emerald-600'
    },
    {
        name: 'Daily Tracker',
        icon: Calendar,
        description: 'Log products and habits daily',
        href: '/daily-tracker',
        color: 'bg-blue-500/10 text-blue-600'
    },
    {
        name: 'Progress Visuals',
        icon: TrendingUp,
        description: 'View your skin improvement journey',
        href: '/progress',
        color: 'bg-purple-500/10 text-purple-600'
    },
    {
        name: 'AI Chat',
        icon: MessageCircle,
        description: 'Ask skincare questions anytime',
        href: '/chat',
        color: 'bg-orange-500/10 text-orange-600'
    },
    
];

function DashboardFeatures() {
    const user = useUser();
    return (
        <div>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8'>
                <div>
                    <div className='flex items-center gap-2 mb-2'>
                        <Sparkles className='w-5 h-5 text-primary' />
                        <h2 className='font-medium text-muted-foreground'>My Skin Dashboard</h2>
                    </div>
                    <h2 className='text-3xl md:text-4xl font-bold text-foreground'>
                        Welcome back, {user?.displayName || 'there'}
                    </h2>
                    <p className='text-muted-foreground mt-2'>Track, analyze, and improve your skin health</p>
                </div>
                <ProfileDailog>
                    <Button className='cursor-pointer shadow-sm hover:shadow-md transition-all text-white' style={{background: 'linear-gradient(135deg, #E8C77A 0%, #C9A44A 45%, #8FAF6A 100%)'}}>
                        View Profile
                    </Button>
                </ProfileDailog>
            </div>

            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mt-8 md:mt-10'>
                {skinFeatures.map((feature, index) => (
                    <BlurFade key={feature.name} delay={0.1 + index * 0.05} inView>
                        <Link href={feature.href}>
                            <div className='group relative p-4 md:p-5 bg-card border border-border rounded-xl md:rounded-2xl
                            hover:border-primary/50 transition-all duration-300 cursor-pointer
                            hover:shadow-xl hover:-translate-y-1 flex flex-col justify-center items-center h-full min-h-[120px] md:min-h-[140px]'>
                                <div className={`relative mb-3 md:mb-4 w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className='w-6 h-6 md:w-8 md:h-8' />
                                </div>
                                <h2 className='text-xs md:text-sm font-semibold text-center text-card-foreground mb-1 md:mb-2 leading-tight'>
                                    {feature.name}
                                </h2>
                                <p className='text-xs text-center text-muted-foreground leading-tight hidden sm:block'>
                                    {feature.description}
                                </p>
                                <div className='flex items-center gap-1 text-xs text-primary opacity-0
                                group-hover:opacity-100 transition-opacity duration-300 mt-2'>
                                    <span>Open</span>
                                    <ArrowRight className='w-3 h-3' />
                                </div>
                            </div>
                        </Link>
                    </BlurFade>
                ))}
            </div>
        </div>
    )
}

export default DashboardFeatures
