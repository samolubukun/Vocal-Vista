import React from 'react'
import DashboardFeatures from './_components/DashboardFeatures'
import RecentScans from './_components/RecentScans'
import ProgressOverview from './_components/ProgressOverview'

function Dashboard() {
  return (
    <div className='space-y-8 md:space-y-12'>
        <DashboardFeatures />

        <div className='border-t border-border pt-8 md:pt-12'>
            <div className='flex items-center gap-3 mb-6'>
                <div className='w-1 h-8 bg-gradient-to-b from-emerald-500 to-cyan-500 rounded-full'></div>
                <h2 className='text-xl md:text-2xl font-bold text-foreground'>Your Skin Journey</h2>
            </div>
            <div className='grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8'>
                <div className='bg-card border border-border rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/20'>
                    <RecentScans />
                </div>
                <div className='bg-card border border-border rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/20'>
                    <ProgressOverview />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard