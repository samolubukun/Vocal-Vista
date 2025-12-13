import { UserContext } from '@/app/_context/UserContext'
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useUser } from '@stackframe/stack';
import { Wallet2, Scan, Sparkles } from 'lucide-react';
import Image from 'next/image';
import React, { useContext } from 'react'

function Credits() {
    const {userData}=useContext(UserContext);
    const user=useUser();

    const CalculateProgress=()=>{
        const maxScans = userData?.subscriptionId ? 1000 : 50;
        const credits = Number(userData?.credits ?? 0);
        const pct = maxScans > 0 ? (credits / maxScans) * 100 : 0;
        return Math.min(100, Math.max(0, Math.round(pct)));
    }

    return (
        <div>
            <div className='flex gap-5 items-center'>
                <Image src={user?.profileImageUrl} 
                alt={user?.displayName ? `${user.displayName} avatar` : 'User avatar'}
                width={60}
                height={60}
                className='rounded-full'
                />
                <div>
                    <h2 className='text-lg font-bold'>{user?.displayName}</h2>
                    <h2 className='text-gray-500'>{user?.primaryEmail}</h2>
                </div>
            </div>
            <hr className='my-3' />
            <div>
                <h2 className='font-bold flex items-center gap-2'>
                    <Scan className='w-4 h-4' /> Scan Credits
                </h2>
                <h2 className='text-muted-foreground'>{userData?.credits ?? 0}/{(userData?.subscriptionId ? 1000 : 50)} scans remaining</h2>
                <Progress value={CalculateProgress()} className='my-3'/>

                <div className='flex justify-between items-center mt-3'>
                    <h2 className='font-bold'>Current Plan</h2>
                    <h2 className='p-1 bg-secondary rounded-lg px-2'>
                        {userData?.subscriptionId ? 'Pro Plan' : 'Free Plan'}</h2>
                </div>

                <div className='mt-5 p-5 border rounded-2xl'>
                    <div className='flex justify-between'>
                        <div>
                            <h2 className='font-bold flex items-center gap-2'>
                                <Sparkles className='w-4 h-4 text-primary' /> Pro Plan
                            </h2>
                            <h2 className='text-sm text-muted-foreground'>1,000 scans/month</h2>
                            <h2 className='text-sm text-muted-foreground'>Unlimited AI chat</h2>
                            <h2 className='text-sm text-muted-foreground'>Priority support</h2>
                        </div>
                        <h2 className='font-bold'>$10/Month</h2>
                    </div>
                    <hr className='my-3'/>
                    <Button className='w-full cursor-pointer bg-gradient-to-r from-[#E8C77A] via-[#C9A44A] to-[#8FAF6A] hover:from-[#E8C77A]/90 hover:via-[#C9A44A]/90 hover:to-[#8FAF6A]/90 text-white border-0'> <Wallet2/> Upgrade $10</Button>
                </div>
            </div>
        </div>
    )
}

export default Credits