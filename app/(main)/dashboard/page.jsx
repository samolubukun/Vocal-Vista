import React from 'react'
import FeatureAssistants from './_components/FeatureAssistants'
import History from './_components/History'
import Feedback from './_components/Feedback'

function Dashboard() {
  return (
    <div className='space-y-12'>
        <FeatureAssistants />

        <div className='border-t border-border pt-12'>
            <h2 className='text-2xl font-bold text-foreground mb-6'>Your Activity</h2>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                <div className='bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow'>
                    <History />
                </div>
                <div className='bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow'>
                    <Feedback />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard