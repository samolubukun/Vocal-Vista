"use client"

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from '@/components/ui/button';
import { Camera, Calendar, TrendingUp, MessageCircle, Sparkles, ShoppingBag, ChevronRight, CheckCircle2, Star, Shield, Scan, Heart, Upload, Play } from 'lucide-react';

export default function LandingPage() {
    const router = useRouter();

    const handleGetStarted = () => {
      router.push('/dashboard');
    };

    const features = [
        { icon: Scan, title: "AI Skin Scan", desc: "Detects acne, pimples, and eczema instantly with dermatology-grade accuracy using advanced AI." },
        { icon: Calendar, title: "Daily Tracker", desc: "Log your skincare products, habits, and see trends over time to understand what works." },
        { icon: TrendingUp, title: "Progress Visuals", desc: "View side-by-side improvements in photos and scores to track your skin journey." },
        { icon: MessageCircle, title: "AI Chat Companion", desc: "Ask skincare questions and get science-backed answers from your personal AI dermatologist." },
        { icon: Sparkles, title: "Smart Recommendations", desc: "AI suggests what works best for your skin type and concern based on your data." },
        { icon: ShoppingBag, title: "Product Purchase", desc: "Order dermatologist-approved products directly through our verified partners." }
    ];

    const testimonials = [
        { 
            name: "Amy Johnson", 
            role: "Ontario, Canada", 
            text: "Réstoir Health transformed my skincare routine! The AI scan detected issues I didn't even know I had, and the recommendations actually work.",
            image: "/rhamy.jpg"
        },
        { 
            name: "Brian Mensah", 
            role: "Accra, Ghana", 
            text: "Finally, a skincare app that understands African skin. The daily tracker helped me identify triggers for my breakouts.",
            image: "/rhbrian.jpg"
        },
        { 
            name: "Justin Okafor", 
            role: "Lagos, Nigeria", 
            text: "The progress tracking is incredible. Seeing my skin improve week by week keeps me motivated to stick to my routine.",
            image: "/rhjustin.jpg"
        }
    ];

    const howItWorks = [
        { step: "1", title: "Take or upload your selfie", desc: "Capture a clear photo of your skin" },
        { step: "2", title: "Let AI scan and recommend care", desc: "Our AI analyzes and provides insights" },
        { step: "3", title: "Track your daily progress", desc: "Monitor improvements over time" },
        { step: "4", title: "Watch your confidence return", desc: "See real results in weeks" }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-2">
                    <Link href="/" className="flex items-center">
                        <Image 
                            src="/logo.png" 
                            alt="Réstoir Health Logo" 
                            width={180}
                            height={180}
                            className="rounded-lg"
                        />
                    </Link>
                    <div className="flex items-center gap-4">
                        <Button 
                            onClick={handleGetStarted}
                            className="px-5 py-2 text-white hover:opacity-90 rounded-full transition-all hover:scale-105 shadow-lg"
                            style={{background: 'linear-gradient(135deg, #E8C77A 0%, #C9A44A 45%, #8FAF6A 100%)'}}
                        >
                            Get Started
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-14 md:py-20 px-4 overflow-hidden bg-white">
                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="grid lg:grid-cols-2 gap-10 items-center lg:ml-20">
                            {/* Left Content */}
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{background: 'linear-gradient(135deg, rgba(232, 199, 122, 0.15) 0%, rgba(201, 164, 74, 0.15) 45%, rgba(143, 175, 106, 0.15) 100%)', border: '1px solid #C9A44A'}}>
                                    <Sparkles className="w-4 h-4" style={{color: '#C9A44A'}} />
                                    <span className="text-sm font-medium" style={{color: '#8FAF6A'}}>AI-Powered Skincare</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-gray-900">
                                    Restore your skin confidence with{' '}
                                    <span className="text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(135deg, #E8C77A 0%, #C9A44A 45%, #8FAF6A 100%)'}}>
                                        AI-powered care
                                    </span>
                                </h1>
                                <p className="text-lg md:text-xl mb-8 text-gray-600 max-w-xl">
                                    Réstoir Health helps you detect, track, and manage acne, pimples, and eczema 
                                    through smart, personalized skincare powered by AI.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Button 
                                        className="px-8 py-6 text-lg text-white rounded-full 
                                        transition-all hover:scale-105 shadow-lg group"
                                        style={{background: 'linear-gradient(135deg, #E8C77A 0%, #C9A44A 45%, #8FAF6A 100%)'}}
                                        onClick={handleGetStarted}
                                    >
                                        Try Free AI Scan
                                        <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                    <Button 
                                        variant="outline"
                                        className="px-8 py-6 text-lg rounded-full border-gray-300 text-gray-700 hover:bg-gray-50 transition-all group"
                                        onClick={handleGetStarted}
                                    >
                                        <Play className="mr-2 w-5 h-5" />
                                        Watch Demo
                                    </Button>
                                </div>
                            </div>
                            
                            {/* Right Image */}
                            <div className="relative flex justify-center">
                                <div className="relative overflow-hidden bg-transparent shadow-none" style={{maxWidth: '420px'}}>
                                    <Image 
                                        src="/rhmodel.png" 
                                        alt="Skin care model" 
                                        width={420}
                                        height={450}
                                        className="w-full h-auto object-cover bg-transparent"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Problem Section */}
                <section className="py-18 px-4 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-10 items-center">
                            {/* Left Image */}
                            <div className="relative order-2 lg:order-1">
                                <div className="relative rounded-none overflow-hidden bg-transparent shadow-none" style={{maxWidth: '420px'}}>
                                    <Image 
                                        src="/rhmodel2.png" 
                                        alt="Skin concerns" 
                                        width={420}
                                        height={700}
                                        className="w-full h-auto object-cover bg-transparent"
                                    />
                                </div>
                            </div>
                            
                            {/* Right Content */}
                            <div className="order-1 lg:order-2">
                                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
                                    Millions struggle with skin issues that affect their{' '}
                                    <span className="text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(135deg, #E8C77A 0%, #C9A44A 45%, #8FAF6A 100%)'}}>
                                        confidence
                                    </span>
                                </h2>
                                <p className="text-lg text-gray-600 mb-8">
                                    Inconsistent routines, trial-and-error products, and limited dermatologist access 
                                    make skincare confusing and frustrating especially in Africa.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-rose-500">✕</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Expensive dermatologist visits</h4>
                                            <p className="text-gray-500 text-sm">Hard to access and unaffordable for many</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-rose-500">✕</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">Generic skincare advice</h4>
                                            <p className="text-gray-500 text-sm">One-size-fits-all doesn't work for everyone</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
                                            <span className="text-rose-500">✕</span>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900">No way to track progress</h4>
                                            <p className="text-gray-500 text-sm">Hard to know if products are actually working</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works - Upload Section */}
                <section className="py-18 px-4 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-14">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
                                How It Works
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Your journey to healthier skin in four simple steps
                            </p>
                        </div>
                        
                        <div className="grid lg:grid-cols-2 gap-10 items-center">
                            {/* Left - Upload Image */}
                            <div className="relative flex justify-center order-2 lg:order-1">
                                <div className="relative rounded-none overflow-hidden bg-transparent p-6 shadow-none max-w-md">
                                    <Image 
                                        src="/rhupload.png" 
                                        alt="Upload your photo" 
                                        width={450}
                                        height={450}
                                        className="w-full h-auto object-contain rounded-none bg-transparent"
                                    />
                                </div>
                            </div>
                            
                            {/* Right - Steps */}
                            <div className="space-y-4 order-1 lg:order-2">
                                {howItWorks.map((item, index) => (
                                    <div 
                                        key={index} 
                                        className="flex gap-3 items-start p-3 rounded-xl bg-white border border-gray-200 transition-colors"
                                        style={{'--hover-border': '#C9A44A'}}
                                        onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--hover-border)'}
                                        onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                                    >
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold text-white" style={{background: 'linear-gradient(135deg, #E8C77A 0%, #C9A44A 45%, #8FAF6A 100%)'}}>
                                            {item.step}
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900 mb-0.5">{item.title}</h3>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 px-4 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
                                Everything You Need for{' '}
                                <span className="text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(135deg, #E8C77A 0%, #C9A44A 45%, #8FAF6A 100%)'}}>
                                    Healthy Skin
                                </span>
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Powerful AI features designed to transform your skincare journey.
                            </p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => (
                                <div 
                                    key={index} 
                                    className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg
                                    transition-all duration-300 hover:-translate-y-1 group"
                                    style={{'--hover-border': '#C9A44A'}}
                                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--hover-border)'}
                                    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                                >
                                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors" style={{background: 'linear-gradient(135deg, rgba(232, 199, 122, 0.15) 0%, rgba(201, 164, 74, 0.15) 45%, rgba(143, 175, 106, 0.15) 100%)'}}>
                                        <feature.icon className="w-7 h-7" style={{color: '#C9A44A'}} />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                                    <p className="text-gray-500 leading-relaxed">
                                        {feature.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-20 px-4 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gray-900">
                                Real Results,{' '}
                                <span className="text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(135deg, #E8C77A 0%, #C9A44A 45%, #8FAF6A 100%)'}}>
                                    Real People
                                </span>
                            </h2>
                            <p className="text-lg text-gray-600">
                                See how Réstoir Health transformed their skin confidence
                            </p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {testimonials.map((testimonial, index) => (
                                <div 
                                    key={index} 
                                    className="bg-white p-6 rounded-2xl border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5" style={{fill: '#C9A44A', color: '#C9A44A'}} />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        "{testimonial.text}"
                                    </p>
                                    <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                                        <Image 
                                            src={testimonial.image}
                                            alt={testimonial.name}
                                            width={48}
                                            height={48}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                            <div className="text-sm text-gray-500">{testimonial.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-4 bg-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{background: 'linear-gradient(135deg, rgba(232, 199, 122, 0.2) 0%, rgba(201, 164, 74, 0.2) 45%, rgba(143, 175, 106, 0.2) 100%)'}}>
                            <Camera className="w-10 h-10" style={{color: '#C9A44A'}} />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">
                            Ready to Transform{' '}
                            <span className="text-transparent bg-clip-text" style={{backgroundImage: 'linear-gradient(135deg, #E8C77A 0%, #C9A44A 45%, #8FAF6A 100%)'}}>
                                Your Skin?
                            </span>
                        </h2>
                        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
                            Join thousands of users who have restored their skin confidence 
                            with AI-powered personalized skincare.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button 
                                onClick={handleGetStarted}
                                className="px-10 py-6 text-lg text-white rounded-full 
                                transition-all hover:scale-105 shadow-lg group"
                                style={{background: 'linear-gradient(135deg, #E8C77A 0%, #C9A44A 45%, #8FAF6A 100%)'}}
                            >
                                Start Your Free Scan
                                <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                        <div className="flex items-center justify-center gap-6 mt-10 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" style={{color: '#8FAF6A'}} />
                                <span>No credit card required</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" style={{color: '#8FAF6A'}} />
                                <span>Free scans included</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Image 
                            src="/logo.png" 
                            alt="Réstoir Health Logo" 
                            width={32}
                            height={32}
                            className="rounded-lg"
                        />
                        <span className="text-gray-600 text-sm">
                            © {new Date().getFullYear()} Réstoir Health
                        </span>
                    </div>
                    <p className="text-sm text-gray-500">Empowering healthier skin worldwide.</p>
                </div>
            </footer>
        </div>
    );
}
