"use client"

import { UserButton } from '@stackframe/stack'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function AppHeader() {
    return (
        <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border w-full transition-all">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3.5">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="relative w-10 h-10 transition-transform group-hover:scale-105">
                        <Image 
                            src="/logo.svg" 
                            alt="Vocal Vista Logo" 
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">
                        Vocal<span className="text-primary font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">Vista</span>
                    </span>
                </Link>

                <div className="flex items-center gap-6">
                    <Link 
                        href="/my-sessions" 
                        className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
                    >
                        My Sessions
                    </Link>
                    <div className="h-4 w-px bg-border hidden sm:block"></div>
                    <UserButton />
                </div>
            </div>
        </header>
    )
}

export default AppHeader