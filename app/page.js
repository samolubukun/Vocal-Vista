"use client"

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { Mic, BookOpen, Brain, Sparkles, Trophy, Users, Target, Zap, ChevronRight, CheckCircle2, Star } from 'lucide-react';

export default function LandingPage() {
    const router = useRouter();

    const handleGetStarted = () => {
      router.push('/dashboard');
    };

    const features = [
        { icon: Mic, title: "Real-time Analysis", desc: "Instant AI feedback on speech patterns, tone, pace, and delivery with millisecond precision." },
        { icon: BookOpen, title: "10+ Practice Modes", desc: "Interview prep, presentations, debates, storytelling, language learning, and more." },
        { icon: Brain, title: "Smart AI Coaching", desc: "Personalized insights and improvement suggestions tailored to your speaking style." },
        { icon: Trophy, title: "Track Progress", desc: "Monitor your growth with detailed analytics and historical performance metrics." },
        { icon: Users, title: "Expert Voices", desc: "Choose from professional voice coaches with diverse expertise and backgrounds." },
        { icon: Target, title: "Goal-Oriented", desc: "Set objectives and receive structured guidance to achieve your speaking goals." }
    ];

    const stats = [
        { value: "50K+", label: "Active Users" },
        { value: "1M+", label: "Sessions Completed" },
        { value: "95%", label: "Satisfaction Rate" },
        { value: "10+", label: "Practice Modes" }
    ];

    const testimonials = [
        { name: "Sarah Chen", role: "Software Engineer", text: "Helped me ace my technical interviews. The mock interview feature is incredibly realistic!" },
        { name: "Marcus Johnson", role: "Sales Director", text: "My presentation skills improved dramatically. The real-time feedback is a game-changer." },
        { name: "Elena Rodriguez", role: "ESL Student", text: "Perfect for language learning. My pronunciation has never been better!" }
    ];

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
                    <Link href="/">
                        <div className="relative w-40 h-12">
                            <Image 
                                src="/logo.svg" 
                                alt="AI Voice Coach" 
                                fill
                                className="object-contain"
                            />
                        </div>
                    </Link>
                    <Button 
                        onClick={handleGetStarted}
                        className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg transition-all hover:scale-105 shadow-sm"
                    >
                        Start Coaching
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-20 md:py-32 px-4 bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
                    <div className="absolute inset-0 bg-grid-pattern opacity-6"></div>
                    <svg className="hero-accent" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#6C5CE7" stopOpacity="0.9"/>
                                <stop offset="100%" stopColor="#00B894" stopOpacity="0.9"/>
                            </linearGradient>
                        </defs>
                        <circle cx="300" cy="200" r="180" fill="url(#g1)" />
                    </svg>
                    <div className="max-w-7xl mx-auto text-center relative z-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 glass mb-6 rounded-full border border-primary/20">
                            <Sparkles className="w-4 h-4 text-brand" />
                            <span className="text-sm font-medium text-foreground">AI-Powered Voice Coaching</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                            Master Your Voice,<br/>Transform Your Impact
                        </h1>
                        <p className="text-lg md:text-xl mb-10 text-muted-foreground max-w-3xl mx-auto">
                            Elevate your speaking skills with real-time AI feedback. Perfect for interviews, presentations, 
                            language learning, and confident communication in any scenario.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button 
                                className="px-8 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl 
                                transition-all hover:scale-105 shadow-lg group"
                                onClick={handleGetStarted}
                            >
                                Start Free Session
                                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button 
                                variant="outline"
                                className="px-8 py-6 text-lg rounded-xl transition-all hover:scale-105"
                                onClick={handleGetStarted}
                            >
                                View Demo
                            </Button>
                        </div>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-3xl md:text-4xl font-bold text-foreground mb-2 blur-sm hover:blur-none transition-all duration-300">
                                      {stat.value}
                                    </div>
                                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 md:py-32 px-4 bg-muted/30">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                                Everything You Need to Excel
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Powerful features designed to transform your speaking abilities and boost your confidence.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div 
                                    key={index} 
                                    className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 
                                    transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group card-accent-hover"
                                >
                                    <div className="icon-badge bg-primary/8 mb-5 group-hover:bg-primary/16 transition-colors">
                                        <feature.icon className="w-7 h-7 text-brand" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3 text-card-foreground">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-20 md:py-32 px-4 bg-background">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
                                Loved by Speakers Worldwide
                            </h2>
                            <p className="text-lg text-muted-foreground">
                                See how AI Voice Coach transformed their communication skills
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial, index) => (
                                <div 
                                    key={index} 
                                    className="bg-card p-8 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300"
                                >
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-primary text-primary" />
                                        ))}
                                    </div>
                                    <p className="text-card-foreground mb-6 leading-relaxed italic">
                                        "{testimonial.text}"
                                    </p>
                                    <div className="border-t border-border pt-4">
                                        <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                                        <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 md:py-32 px-4 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
                    <div className="max-w-4xl mx-auto text-center">
                        <Zap className="w-16 h-16 text-primary mx-auto mb-6" />
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
                            Ready to Transform Your Speaking?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
                            Join thousands of professionals, students, and public speakers who have elevated 
                            their communication skills with AI-powered coaching.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button 
                                onClick={handleGetStarted}
                                className="px-10 py-6 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl 
                                transition-all hover:scale-105 shadow-lg group"
                            >
                                Begin Your Journey
                                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                        <div className="flex items-center justify-center gap-6 mt-10 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-primary" />
                                <span>Free trial included</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-border bg-muted/30">
                <div className="max-w-7xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Vocal Vista. Empowering confident communicators worldwide.</p>
                </div>
            </footer>
        </div>
    );
}
