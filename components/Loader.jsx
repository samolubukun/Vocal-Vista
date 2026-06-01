"use client";

import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background">
            <div className="relative flex items-center justify-center">
                {/* Outer rotating card border representing speech stream cycles */}
                <div className="h-20 w-20 rounded-2xl border-2 border-primary/20 animate-[spin_3s_linear_infinite]" />
                {/* Inner reverse-rotating track representing intelligence loops */}
                <div className="absolute h-14 w-14 rounded-xl border-2 border-indigo-500/40 animate-[spin_1.5s_linear_infinite_reverse]" />
                {/* Center logo container */}
                <div className="absolute h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center shadow-sm">
                    <img src="/logo.svg" className="w-8 h-8 rounded-lg shrink-0 object-contain" alt="Logo" />
                </div>
            </div>
            <div className="mt-10 flex flex-col items-center gap-3">
                <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                    Vocal<span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">Vista</span>
                </h2>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
                    Initializing Workspace
                </p>
            </div>
        </div>
    );
};

export default Loader;
