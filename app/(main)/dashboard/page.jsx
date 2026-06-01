import React from 'react'
import FeatureAssistants from './_components/FeatureAssistants'
import History from './_components/History'
import Feedback from './_components/Feedback'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

function Dashboard() {
  return (
    <div className='space-y-12'>
        <FeatureAssistants />

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