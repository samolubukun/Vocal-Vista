import { UserContext } from '@/app/_context/UserContext'
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@stackframe/stack';
import { Wallet2 } from 'lucide-react';
import Image from 'next/image';
import React, { useContext } from 'react'

function Credits() {
    const {userData}=useContext(UserContext);
    const user=useUser();

    const CalculateProgress=()=>{
        const maxTokens = userData?.subscriptionId ? 100000 : 10000;
        const credits = Number(userData?.credits ?? 0);
        const pct = maxTokens > 0 ? (credits / maxTokens) * 100 : 0;
        return Math.min(100, Math.max(0, Math.round(pct)));
    }

    return (
        <div className="space-y-6 pt-4">
            <div className='flex gap-4 items-center bg-muted/20 p-3 rounded-2xl border border-border/40'>
                <Image src={user?.profileImageUrl} 
                    alt={user?.displayName ? `${user.displayName} avatar` : 'User avatar'}
                    width={50}
                    height={50}
                    className='rounded-full border border-border shadow-sm bg-background'
                />
                <div className="space-y-0.5">
                    <h2 className='text-base font-bold text-foreground leading-none'>{user?.displayName}</h2>
                    <p className='text-xs text-muted-foreground'>{user?.primaryEmail}</p>
                </div>
            </div>
            
            <div className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <span className='font-bold text-sm text-foreground'>Token Usage Balance</span>
                        <span className="text-xs font-semibold text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border/40">
                            {(userData?.credits ?? 0).toLocaleString()} / {(userData?.subscriptionId ? 100000 : 10000).toLocaleString()} Credits
                        </span>
                    </div>
                    <Progress value={CalculateProgress()} className='h-2.5 rounded-full'/>
                </div>

                <div className='flex justify-between items-center bg-card p-3 rounded-xl border border-border/50'>
                    <span className='font-bold text-sm text-foreground'>Current Active Plan</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        userData?.subscriptionId 
                            ? 'bg-primary/10 border-primary/30 text-primary' 
                            : 'bg-muted border-border text-muted-foreground'
                    }`}>
                        {userData?.subscriptionId ? 'Pro Plan' : 'Free Sandbox'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default Credits