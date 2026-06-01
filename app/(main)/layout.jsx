import React from 'react'
import AppHeader from './_components/AppHeader'

function DashboardLayout({children}) {
  return (
    <div className="min-h-screen bg-background">
        <AppHeader />
        <main className="max-w-7xl mx-auto px-6 py-10 w-full">
            {children}
        </main>
    </div>
  )
}

export default DashboardLayout