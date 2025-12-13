import React from 'react'
import AppHeader from './_components/AppHeader'

function DashboardLayout({children}) {
  return (
    <div className='min-h-screen bg-background'>
        <AppHeader />
        <div className='p-4 md:p-6 lg:p-8 xl:p-10 mt-16 md:mt-20 lg:mt-24 max-w-7xl mx-auto'>
            {children}
        </div>
    </div>
  )
}

export default DashboardLayout