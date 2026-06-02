"use client"

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from '@/components/ui/button';
import { useUser } from "@stackframe/stack";
import { 
    Mic, BookOpen, Brain, Sparkles, Trophy, Users, Target, Zap, 
    ChevronRight, CheckCircle2, Star, Volume2, ShieldCheck, AudioLines, Sparkle,
    ArrowRight, MessageSquare, Headphones, Award, Speech, BarChart3
} from 'lucide-react';

export default function LandingPage() {
    const user = useUser();
    const router = useRouter();
    const [activeCoach, setActiveCoach] = useState(0);

    // Auto-redirect authenticated users directly to the dashboard if they are logging in
    useEffect(() => {
        if (user && typeof window !== "undefined") {
            const isInitiating = sessionStorage.getItem('initiating_login');
            const referrer = document.referrer || "";
            // Route straight to dashboard if flag is set, or if they are returning from the login handler
            if (isInitiating === 'true' || referrer.includes('/handler/sign-in') || referrer.includes('/handler/sign-up')) {
                sessionStorage.removeItem('initiating_login');
                router.replace('/dashboard');
            }
        }
    }, [user, router]);

    const handleGetStarted = () => {
        if (typeof window !== "undefined") {
            sessionStorage.setItem('initiating_login', 'true');
        }
        router.push('/dashboard');
    };

    const coaches = [
        { name: "Ethan", role: "Executive & Business Coach", voice: "Helios (Authoritative)", avatar: "👨‍💼", desc: "Specializes in boardroom presentations, technical mock interviews, and high-impact executive speech patterns." },
        { name: "Sofia", role: "Public Speaking & Keynote Coach", voice: "Luna (Encouraging)", avatar: "👩‍🏫", desc: "Perfect for keynote rehearsals, confidence building, pacing control, and dynamic voice modulation." },
        { name: "Justin", role: "Debate & Rhetoric Specialist", voice: "Zeus (Analytical)", avatar: "👨‍⚖️", desc: "Master logical reasoning, spontaneous debate rebuttals, conversational flow, and rapid argumentation structure." },
        { name: "Amy", role: "Language & ESL Specialist", voice: "Stella (Warm)", avatar: "👩‍⚕️", desc: "Focuses on pronunciation accuracy, structural fluency, conversational speech, and active accent learning." },
        { name: "Brian", role: "Leadership & Presentation Master", voice: "Zeus (Clear)", avatar: "👨‍💻", desc: "Provides structured logic coaching, presentation delivery metrics, leadership posture, and professional storytelling." }
    ];

    const features = [
        { icon: Mic, title: "Sub-Second Audio Stream", desc: "A singular bi-directional WebSocket connection that streams audio in real-time with sub-second, conversation-like response times." },
        { icon: BookOpen, title: "Interactive Exercises", desc: "Toggle between Mock Interviews, Presentation Prep, Debate Labs, Language Learning, and soothing Meditation Sprints." },
        { icon: Brain, title: "Active Interruption", desc: "Speak naturally. The conversational engine detects voice overlays, kills speaker streams, and handles dynamic context shifts on-the-fly." },
        { icon: Trophy, title: "Gemini Feedback Summaries", desc: "Every call triggers a comprehensive diagnostic summary highlighting verbal pacing, fillers, grammar, and improvement steps." },
        { icon: Users, title: "Expert Aura Cast", desc: "Switch between custom AI expert personas, each matching specialized Aura model configurations for tailored feedback." },
        { icon: Target, title: "Protected Billing Sandbox", desc: "Dynamic character monitoring bills accounts in real-time, auto-suspending connections to prevent surprise token charges." }
    ];

    const steps = [
        { icon: Users, title: "Choose Your Coach", desc: "Select from our roster of five specialized AI expert personas, each configured with unique voice models and professional focus areas." },
        { icon: Speech, title: "Pick Practice Mode", desc: "Choose from 10+ active scenarios including Mock Interviews, Keynote Rehearsals, Spontaneous Debates, or soothing Meditation." },
        { icon: Mic, title: "Speak Naturally", desc: "Start a live audio session. Our real-time streaming agent listens, processes context, and speaks back instantly with sub-second lag." },
        { icon: BarChart3, title: "Review Insights", desc: "After hanging up, receive structured AI performance feedback cards, transcripts, and custom notes to track your progress." }
    ];

    const useCases = [
        { badge: "Career Growth", title: "Ace Job Interviews", desc: "Simulate intense, industry-specific technical panels. Practice answering hard questions under pressure and get immediate feedback on your structured delivery." },
        { badge: "Leadership", title: "Deliver Keynote Speeches", desc: "Rehearse executive board presentations or public keynotes. Train on breathing pacing, eliminating filler words, and keeping your tone engaging." },
        { badge: "Fluency", title: "Master A New Language", desc: "Practice conversational fluency with friendly, encouraging native AI speakers who provide pronunciation reviews and syntax correction." },
        { badge: "Confidence", title: "Engage In Spontaneous Debates", desc: "Sharpen your logical reasoning and conversational reflexes by defending arguments against a sharp, analytical AI sparring partner." }
    ];

    const stats = [
        { value: "240ms", label: "Average Response Latency" },
        { value: "5", label: "Dynamic Aura Coaches" },
        { value: "100%", label: "Real-Time Bi-Directional WebSocket" },
        { value: "Zero", label: "Stitched HTTP API Lag" }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-x-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl pointer-events-none"></div>
            <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border transition-all">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">
                    <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                        <div className="relative w-8 h-8 sm:w-10 sm:h-10 transition-transform group-hover:scale-110 shrink-0">
                            <Image 
                                src="/logo.svg" 
                                alt="Vocal Vista Logo" 
                                fill
                                className="object-contain"
                            />
                        </div>
                        <span className="text-base sm:text-xl font-bold tracking-tight text-foreground whitespace-nowrap">
                            Vocal<span className="text-primary font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">Vista</span>
                        </span>
                    </Link>
                    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                        {user ? (
                            <Button 
                                onClick={handleGetStarted}
                                className="px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl transition-all shadow-md font-semibold flex items-center gap-1 sm:gap-1.5 shrink-0"
                            >
                                Open App
                                <ChevronRight size={14} className="shrink-0" />
                            </Button>
                        ) : (
                            <Button 
                                onClick={handleGetStarted}
                                className="px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl transition-all shadow-md font-semibold shrink-0"
                            >
                                Start Coaching
                            </Button>
                        )}
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-20 lg:py-32 px-6 overflow-hidden">
                    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                        {/* Left Column */}
                        <div className="lg:col-span-7 space-y-6 text-left">

                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                                Master your speech with <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-indigo-500">Live Voice AI</span>
                            </h1>

                            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
                                Experience low-latency, back-and-forth speech coaching. Engage in mock interviews, public speaking prep, and argument practice with immediate, highly personalized feedback.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button 
                                    className="w-full sm:w-auto px-8 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/95 rounded-2xl 
                                    transition-all hover:scale-[1.02] shadow-lg shadow-primary/10 group font-semibold"
                                    onClick={handleGetStarted}
                                >
                                    {user ? "Open App" : "Start Session Free"}
                                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform animate-none sm:animate-bounce-horizontal" />
                                </Button>
                                <Button 
                                    variant="outline"
                                    className="w-full sm:w-auto px-8 py-6 text-lg rounded-2xl border-border bg-card/50 hover:bg-muted/10 transition-all font-semibold"
                                    onClick={handleGetStarted}
                                >
                                    Choose Coach
                                </Button>
                            </div>
                        </div>

                        {/* Right Column: Dynamic Live Speech Visualizer Simulator */}
                        <div className="lg:col-span-5 flex justify-center">
                            <div className="relative w-full max-w-md p-6 sm:p-8 bg-gradient-to-b from-card via-card to-muted/10 rounded-[32px] border border-border shadow-2xl overflow-hidden">
                                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                                <div className="relative flex flex-col items-center text-center space-y-6">
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
                                        <div className="relative w-28 h-28 bg-gradient-to-tr from-primary to-indigo-500 rounded-full flex items-center justify-center border-4 border-background shadow-xl">
                                            <AudioLines className="w-12 h-12 text-primary-foreground animate-bounce" />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="font-bold text-xl">VocalVista Voice Agent</h3>
                                        <p className="text-xs text-primary font-semibold tracking-wider uppercase animate-pulse">Connected over WebSocket</p>
                                    </div>

                                    {/* Animated simulated Sound Waveform */}
                                    <div className="flex items-end gap-1.5 h-16 justify-center w-full px-6 py-2 bg-muted/20 rounded-2xl border border-border/60">
                                        <div className="w-1 bg-primary rounded-full h-8 animate-pulse" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-1 bg-purple-500 rounded-full h-12 animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                                        <div className="w-1 bg-indigo-500 rounded-full h-16 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                                        <div className="w-1 bg-primary rounded-full h-10 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                        <div className="w-1 bg-purple-500 rounded-full h-6 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                        <div className="w-1 bg-indigo-500 rounded-full h-14 animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                                        <div className="w-1 bg-primary rounded-full h-7 animate-pulse" style={{ animationDelay: '0.15s' }}></div>
                                    </div>

                                    <p className="text-sm italic text-muted-foreground">
                                        "Hello! I am your AI communication expert. Ready to start our training?"
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="border-y border-border py-12 bg-muted/10 relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center space-y-2">
                                    <div className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/80">
                                        {stat.value}
                                    </div>
                                    <div className="text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16 sm:py-20 lg:py-32 px-4 sm:px-6 bg-muted/10 relative overflow-hidden border-t border-border">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="text-center max-w-3xl mx-auto space-y-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/5 rounded-full border border-indigo-500/10">
                                <Sparkle className="w-4 h-4 text-indigo-500 animate-spin-slow" />
                                <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Top-Tier Capabilities</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                                Powerful Features built for Mastery
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                High-performance tools designed to transform speaking abilities and maximize conversational flow.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div 
                                    key={index} 
                                    className="bg-card p-6 sm:p-8 rounded-3xl border border-border hover:border-primary/50 
                                    transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary to-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
                                    <div className="w-14 h-14 rounded-2xl bg-primary/5 mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <feature.icon className="w-7 h-7 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed text-sm">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Coach Selection Spotlight */}
                <section className="py-16 sm:py-20 lg:py-32 px-4 sm:px-6 bg-background relative border-t border-border">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="text-center max-w-3xl mx-auto space-y-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-500/5 rounded-full border border-purple-500/10">
                                <Users className="w-4 h-4 text-purple-500" />
                                <span className="text-xs font-semibold text-purple-500 uppercase tracking-wider">Meet the Experts</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                                Handcrafted AI Coaching Cast
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Select specialized coaches tailored to specific presentation, interview, or conversational requirements.
                            </p>
                        </div>

                        {/* Interactive Selector */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center">
                            {/* Selector buttons */}
                            <div className="lg:col-span-5 space-y-4">
                                {coaches.map((coach, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveCoach(index)}
                                        className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 sm:gap-5 cursor-pointer
                                        ${activeCoach === index 
                                            ? 'bg-card border-primary shadow-lg ring-1 ring-primary' 
                                            : 'bg-card/40 border-border hover:bg-card/80 hover:border-border/80'}`}
                                    >
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/5 flex items-center justify-center text-2xl sm:text-3xl shadow-sm border border-border shrink-0">
                                            {coach.avatar}
                                        </div>
                                        <div className="space-y-0.5">
                                            <h3 className="font-bold text-base sm:text-lg">{coach.name}</h3>
                                            <p className="text-xs text-muted-foreground font-medium">{coach.role}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Detailed Spotlight display Card */}
                            <div className="lg:col-span-7 bg-card p-6 sm:p-10 rounded-[32px] border border-border shadow-xl space-y-6 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full filter blur-3xl pointer-events-none"></div>
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <span className="text-xs font-semibold uppercase tracking-wider text-primary">Active Spotlight Persona</span>
                                        <h3 className="text-2xl sm:text-3xl font-extrabold">{coaches[activeCoach].name}</h3>
                                    </div>
                                    <div className="px-4 py-1.5 bg-primary/5 rounded-full border border-primary/20 flex items-center gap-2">
                                        <Volume2 className="w-4 h-4 text-primary" />
                                        <span className="text-sm font-semibold text-primary">{coaches[activeCoach].voice}</span>
                                    </div>
                                </div>
                                
                                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                                    "{coaches[activeCoach].desc}"
                                </p>

                                <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="text-xs sm:text-sm text-muted-foreground font-medium">
                                        Active Coaching Model: <span className="font-bold text-foreground">GPT-4o</span>
                                    </div>
                                    <Button onClick={handleGetStarted} className="w-full sm:w-auto rounded-xl flex items-center justify-center gap-2">
                                        Choose {coaches[activeCoach].name}
                                        <ChevronRight size={16} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Brand-New Section 1: How It Works */}
                <section className="py-16 sm:py-20 lg:py-32 px-4 sm:px-6 bg-muted/10 relative overflow-hidden border-t border-border">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="text-center max-w-3xl mx-auto space-y-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
                                <Headphones className="w-4 h-4 text-primary" />
                                <span className="text-xs font-semibold text-primary uppercase tracking-wider">Simple Workflow</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                                How VocalVista Works
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Complete your verbal training in four intuitive, lightning-fast steps.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {steps.map((step, index) => (
                                <div key={index} className="bg-card p-6 sm:p-8 rounded-3xl border border-border shadow-sm flex flex-col items-start space-y-6 relative overflow-hidden">
                                    <div className="absolute top-4 right-4 text-6xl font-extrabold text-muted/10 select-none">
                                        0{index + 1}
                                    </div>
                                    <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center shrink-0">
                                        <step.icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-bold text-lg">{step.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Brand-New Section 2: Dynamic Practice Use Cases */}
                <section className="py-16 sm:py-20 lg:py-32 px-4 sm:px-6 bg-background relative overflow-hidden border-t border-border">
                    <div className="max-w-7xl mx-auto space-y-16">
                        <div className="text-center max-w-3xl mx-auto space-y-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/5 rounded-full border border-indigo-500/10">
                                <Award className="w-4 h-4 text-indigo-500" />
                                <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">Targeted Training</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                                Tailored to Your Speaking Goals
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                Practice real-life scenarios and achieve concrete conversational outcomes.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {useCases.map((useCase, index) => (
                                <div 
                                    key={index}
                                    className="bg-card/40 hover:bg-card p-6 sm:p-8 rounded-[32px] border border-border transition-all duration-300 shadow-sm flex flex-col justify-between space-y-6"
                                >
                                    <div className="space-y-4">
                                        <span className="inline-block px-3 py-1 bg-primary/5 rounded-full border border-primary/10 text-xs font-bold text-primary">
                                            {useCase.badge}
                                        </span>
                                        <h3 className="text-2xl font-bold">{useCase.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{useCase.desc}</p>
                                    </div>
                                    <div className="flex items-center gap-2 text-primary font-semibold text-sm cursor-pointer hover:underline" onClick={handleGetStarted}>
                                        Explore Scenario
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Call To Action */}
                <section className="py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-card to-muted/10 relative overflow-hidden border-t border-border">
                    <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full filter blur-3xl pointer-events-none"></div>

                    <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
                        <div className="w-16 h-16 bg-primary/5 border border-primary/20 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                            <Zap className="w-8 h-8 text-primary animate-pulse" />
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
                            Elevate your Voice Quality Today
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Join hundreds of active professionals, engineers, and public speakers sharpening their vocabulary, delivery, and confidence through conversational coaching.
                        </p>
                        
                        <div className="flex justify-center">
                            <Button 
                                onClick={handleGetStarted}
                                className="px-10 py-7 text-lg bg-primary text-primary-foreground hover:bg-primary/95 rounded-2xl 
                                transition-all hover:scale-[1.02] shadow-lg shadow-primary/10 font-bold group"
                            >
                                {user ? "Open App" : "Get Started Free"}
                                <ChevronRight className="ml-2 w-5.5 h-5.5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>

                        <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-primary" />
                                <span>Secured by Stack Auth</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                <span>No Card Required</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-card/50 py-16 px-6">
                <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-6">
                    {/* Centered Logo */}
                    <div className="relative w-12 h-12">
                        <Image 
                            src="/logo.svg" 
                            alt="Vocal Vista Logo" 
                            fill
                            className="object-contain"
                        />
                    </div>
                    
                    {/* Centered Brand Name */}
                    <span className="text-xl font-bold tracking-tight text-foreground">
                        Vocal<span className="text-primary font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">Vista</span>
                    </span>

                    {/* Centered Description */}
                    <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                        Real-time AI voice coaching. Conversational flow practice with sub-second feedback.
                    </p>

                    {/* Separator line */}
                    <div className="w-16 h-px bg-border"></div>

                    {/* Copyright & Designed By info */}
                    <div className="space-y-3 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        <p>© {new Date().getFullYear()} VOCALVISTA. ALL RIGHTS RESERVED.</p>
                        <p className="normal-case tracking-normal font-medium text-sm text-muted-foreground">
                            Designed and developed by{" "}
                            <a 
                                href="https://samuelolubukun.netlify.app/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-indigo-500 hover:text-indigo-600 dark:text-primary dark:hover:text-primary/80 hover:underline font-semibold transition-colors"
                            >
                                Samuel Olubukun
                            </a>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
