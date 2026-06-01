"use client"

import React, { useState } from 'react';
import History from '../dashboard/_components/History';
import Feedback from '../dashboard/_components/Feedback';
import { ArrowLeft, BookOpen, MessageSquare } from 'lucide-react';
import Link from 'next/link';

function MySessions() {
    const [activeTab, setActiveTab] = useState('lectures');
    
    return (
        <div className="space-y-8">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-extrabold tracking-tight text-foreground">My Coaching Sessions</h1>
                    <p className="text-muted-foreground text-sm sm:text-base">
                        Your complete history of speech transcripts, feedback notes, and performance reviews.
                    </p>
                </div>
                <Link href="/dashboard" className="self-start sm:self-center">
                    <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-card hover:bg-muted text-sm font-semibold text-foreground transition-all shadow-sm cursor-pointer">
                        <ArrowLeft size={16} />
                        <span>Dashboard</span>
                    </button>
                </Link>
            </div>

            {/* Premium segmented tabs */}
            <div className="flex justify-center sm:justify-start">
                <div className="bg-muted/40 p-1.5 rounded-2xl border border-border/60 flex items-center gap-1 w-full sm:w-auto">
                    <button 
                        onClick={() => setActiveTab('lectures')}
                        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                            activeTab === 'lectures' 
                                ? 'bg-background text-primary shadow-sm border border-border/40' 
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <BookOpen size={16} />
                        <span>Lectures & Speeches</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('feedback')}
                        className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                            activeTab === 'feedback' 
                                ? 'bg-background text-primary shadow-sm border border-border/40' 
                                : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <MessageSquare size={16} />
                        <span>Expert Feedback</span>
                    </button>
                </div>
            </div>

            {/* Content card */}
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm bg-gradient-to-b from-card to-muted/5 min-h-[40vh]">
                {activeTab === 'lectures' ? (
                    <History />
                ) : (
                    <Feedback />
                )}
            </div>
        </div>
    )
}

export default MySessions;
