'use client'
import React, { useState, useContext, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
    TrendingUp, 
    Calendar,
    Camera,
    ChevronLeft,
    ChevronRight,
    ArrowUp,
    ArrowDown,
    Minus,
    ArrowLeft
} from 'lucide-react'
import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { UserContext } from '@/app/_context/UserContext'
import moment from 'moment'
import Link from 'next/link'

function ProgressPage() {
    const { userData } = useContext(UserContext)
    const convex = useConvex()
    
    const [scans, setScans] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedIndex, setSelectedIndex] = useState(0)

    useEffect(() => {
        if (userData) {
            fetchScans()
        }
    }, [userData])

    const fetchScans = async () => {
        try {
            setLoading(true)
            const result = await convex.query(api.skinScans.getSkinScans, {
                uid: userData._id
            })
            setScans(result || [])
        } catch (error) {
            console.error('Error fetching scans:', error)
        } finally {
            setLoading(false)
        }
    }

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-500'
        if (score >= 60) return 'text-yellow-500'
        return 'text-red-500'
    }

    const getScoreBg = (score) => {
        if (score >= 80) return 'bg-green-500'
        if (score >= 60) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    const calculateTrend = () => {
        if (scans.length < 2) return { direction: 'stable', value: 0 }
        
        const currentScore = scans[0]?.analysis?.overallScore || 0
        const previousScore = scans[1]?.analysis?.overallScore || 0
        const diff = currentScore - previousScore
        
        return {
            direction: diff > 2 ? 'up' : diff < -2 ? 'down' : 'stable',
            value: diff
        }
    }

    const trend = calculateTrend()

    const getTrendIcon = () => {
        switch (trend.direction) {
            case 'up': return <ArrowUp className='w-4 h-4 text-green-500' />
            case 'down': return <ArrowDown className='w-4 h-4 text-red-500' />
            default: return <Minus className='w-4 h-4 text-yellow-500' />
        }
    }

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-[60vh]'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            </div>
        )
    }

    return (
        <div className='max-w-4xl mx-auto'>
            {/* Header */}
            <div className='flex items-center gap-3 mb-8'>
                <Link href='/dashboard'>
                    <Button variant='ghost' size='icon' className='cursor-pointer'>
                        <ArrowLeft className='w-5 h-5' />
                    </Button>
                </Link>
                <div>
                    <h1 className='text-3xl font-bold text-foreground'>Your Skin Journey</h1>
                    <p className='text-sm text-muted-foreground'>
                        Track your improvements over time with side-by-side comparisons
                    </p>
                </div>
            </div>

            {scans.length === 0 ? (
                <div className='bg-card border border-border rounded-2xl p-12 text-center'>
                    <Camera className='w-16 h-16 text-muted-foreground mx-auto mb-4' />
                    <h3 className='text-xl font-semibold mb-2'>No scans yet</h3>
                    <p className='text-muted-foreground mb-6'>
                        Start tracking your progress by taking your first skin scan
                    </p>
                    <Link href='/skin-scan'>
                        <Button className='cursor-pointer bg-gradient-to-r from-[#E8C77A] via-[#C9A44A] to-[#8FAF6A] hover:from-[#E8C77A]/90 hover:via-[#C9A44A]/90 hover:to-[#8FAF6A]/90 text-white border-0'>
                            <Camera className='w-4 h-4 mr-2' />
                            Take First Scan
                        </Button>
                    </Link>
                </div>
            ) : (
                <>
                    {/* Progress Stats */}
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
                        <div className='bg-card border border-border rounded-xl p-4 text-center'>
                            <p className='text-sm text-muted-foreground mb-1'>Total Scans</p>
                            <p className='text-3xl font-bold text-foreground'>{scans.length}</p>
                        </div>
                        <div className='bg-card border border-border rounded-xl p-4 text-center'>
                            <p className='text-sm text-muted-foreground mb-1'>Current Score</p>
                            <p className={`text-3xl font-bold ${getScoreColor(scans[0]?.analysis?.overallScore)}`}>
                                {scans[0]?.analysis?.overallScore || 0}
                            </p>
                        </div>
                        <div className='bg-card border border-border rounded-xl p-4 text-center'>
                            <p className='text-sm text-muted-foreground mb-1'>Best Score</p>
                            <p className='text-3xl font-bold text-green-500'>
                                {Math.max(...scans.map(s => s.analysis?.overallScore || 0))}
                            </p>
                        </div>
                        <div className='bg-card border border-border rounded-xl p-4 text-center'>
                            <p className='text-sm text-muted-foreground mb-1'>Trend</p>
                            <div className='flex items-center justify-center gap-1'>
                                {getTrendIcon()}
                                <span className={`text-lg font-bold 
                                    ${trend.direction === 'up' ? 'text-green-500' : 
                                      trend.direction === 'down' ? 'text-red-500' : 'text-yellow-500'}`}>
                                    {trend.value > 0 ? '+' : ''}{trend.value}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Comparison View */}
                    {scans.length >= 2 ? (
                        <div className='bg-card border border-border rounded-2xl p-6 mb-8'>
                            <h3 className='font-semibold text-foreground mb-4 flex items-center gap-2'>
                                <Calendar className='w-5 h-5 text-primary' />
                                Side-by-Side Comparison
                            </h3>
                            
                            <div className='grid md:grid-cols-2 gap-6'>
                                {/* Current/Selected Scan */}
                                <div>
                                    <div className='flex items-center justify-between mb-3'>
                                        <p className='text-sm text-muted-foreground'>
                                            {selectedIndex === 0 ? 'Latest' : `Scan ${scans.length - selectedIndex}`}
                                        </p>
                                        <p className='text-sm font-medium'>
                                            {moment(scans[selectedIndex]?._creationTime).format('MMM D, YYYY')}
                                        </p>
                                    </div>
                                    <div className='aspect-[4/3] rounded-xl overflow-hidden bg-muted mb-3'>
                                        <img 
                                            src={scans[selectedIndex]?.imageUrl} 
                                            alt='Skin scan'
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                    <div className='flex items-center justify-center gap-2'>
                                        <span className={`text-2xl font-bold ${getScoreColor(scans[selectedIndex]?.analysis?.overallScore)}`}>
                                            {scans[selectedIndex]?.analysis?.overallScore}
                                        </span>
                                        <span className='text-muted-foreground'>/100</span>
                                    </div>
                                </div>

                                {/* Comparison Scan */}
                                <div>
                                    <div className='flex items-center justify-between mb-3'>
                                        <p className='text-sm text-muted-foreground'>First Scan</p>
                                        <p className='text-sm font-medium'>
                                            {moment(scans[scans.length - 1]?._creationTime).format('MMM D, YYYY')}
                                        </p>
                                    </div>
                                    <div className='aspect-[4/3] rounded-xl overflow-hidden bg-muted mb-3'>
                                        <img 
                                            src={scans[scans.length - 1]?.imageUrl} 
                                            alt='First skin scan'
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                    <div className='flex items-center justify-center gap-2'>
                                        <span className={`text-2xl font-bold ${getScoreColor(scans[scans.length - 1]?.analysis?.overallScore)}`}>
                                            {scans[scans.length - 1]?.analysis?.overallScore}
                                        </span>
                                        <span className='text-muted-foreground'>/100</span>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className='flex items-center justify-center gap-4 mt-6'>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    onClick={() => setSelectedIndex(Math.min(selectedIndex + 1, scans.length - 1))}
                                    disabled={selectedIndex >= scans.length - 1}
                                    className='cursor-pointer'
                                >
                                    <ChevronLeft className='w-5 h-5' />
                                </Button>
                                <span className='text-sm text-muted-foreground'>
                                    Scan {scans.length - selectedIndex} of {scans.length}
                                </span>
                                <Button
                                    variant='outline'
                                    size='icon'
                                    onClick={() => setSelectedIndex(Math.max(selectedIndex - 1, 0))}
                                    disabled={selectedIndex <= 0}
                                    className='cursor-pointer'
                                >
                                    <ChevronRight className='w-5 h-5' />
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className='bg-card border border-border rounded-2xl p-6 mb-8 text-center'>
                            <p className='text-muted-foreground'>
                                Take at least 2 scans to see side-by-side comparison
                            </p>
                        </div>
                    )}

                    {/* All Scans History */}
                    <div className='bg-card border border-border rounded-2xl p-6'>
                        <h3 className='font-semibold text-foreground mb-4'>Scan History</h3>
                        <div className='space-y-3'>
                            {scans.map((scan, index) => (
                                <Link href={`/scan-result/${scan._id}`} key={scan._id}>
                                    <div className='flex items-center gap-4 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer'>
                                        <div className='w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0'>
                                            <img 
                                                src={scan.imageUrl} 
                                                alt='Scan thumbnail'
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                        <div className='flex-1'>
                                            <div className='flex items-center gap-2'>
                                                <p className='font-medium'>
                                                    {index === 0 ? 'Latest Scan' : `Scan ${scans.length - index}`}
                                                </p>
                                                {index === 0 && (
                                                    <span className='text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full'>
                                                        Latest
                                                    </span>
                                                )}
                                            </div>
                                            <p className='text-sm text-muted-foreground'>
                                                {moment(scan._creationTime).format('MMMM D, YYYY')}
                                            </p>
                                        </div>
                                        <div className='text-right'>
                                            <p className={`text-xl font-bold ${getScoreColor(scan.analysis?.overallScore)}`}>
                                                {scan.analysis?.overallScore}
                                            </p>
                                            <p className='text-xs text-muted-foreground'>score</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className='mt-8 text-center'>
                        <Link href='/skin-scan'>
                            <Button className='cursor-pointer bg-gradient-to-r from-[#E8C77A] via-[#C9A44A] to-[#8FAF6A] hover:from-[#E8C77A]/90 hover:via-[#C9A44A]/90 hover:to-[#8FAF6A]/90 text-white border-0'>
                                <Camera className='w-4 h-4 mr-2' />
                                Take New Scan
                            </Button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    )
}

export default ProgressPage
