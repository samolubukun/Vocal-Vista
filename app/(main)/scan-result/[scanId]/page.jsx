'use client'
import React, { useEffect, useState, useContext } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { 
    ArrowLeft, 
    Camera, 
    Calendar, 
    TrendingUp, 
    AlertCircle, 
    CheckCircle, 
    ChevronRight,
    Sparkles,
    MessageCircle,
    Loader2,
    Clock,
    Sun,
    Moon,
    ChevronDown
} from 'lucide-react'
import Link from 'next/link'
import moment from 'moment'
import { ProductRecommendations } from '@/components/ProductRecommendations'

function ScanResultPage() {
    const params = useParams()
    const router = useRouter()
    const convex = useConvex()
    const [scan, setScan] = useState(null)
    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])
    const [loadingProducts, setLoadingProducts] = useState(false)
    const [usageGuide, setUsageGuide] = useState(null)
    const [loadingGuide, setLoadingGuide] = useState(false)
    const [expandedRoutine, setExpandedRoutine] = useState(0)

    useEffect(() => {
        if (params.scanId) {
            fetchScan()
        }
    }, [params.scanId])

    const fetchScan = async () => {
        try {
            setLoading(true)
            const result = await convex.query(api.skinScans.getSkinScan, {
                id: params.scanId
            })
            setScan(result)
            
            // Fetch product recommendations after getting scan
            if (result && result.analysis) {
                fetchProductRecommendations(result.analysis)
            }
        } catch (error) {
            console.error('Error fetching scan:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchProductRecommendations = async (analysis) => {
        try {
            // First, check if recommendations already exist in Convex
            const savedRecommendations = await convex.query(
                api.scanRecommendations.getScanProductRecommendations,
                { scanId: params.scanId }
            )

            if (savedRecommendations && savedRecommendations.products.length > 0) {
                // Use saved recommendations
                setProducts(savedRecommendations.products)
                fetchUsageGuide(savedRecommendations.products, analysis)
                return
            }

            // If not saved, fetch from API
            setLoadingProducts(true)
            const res = await fetch('/api/get-product-recommendations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ analysis })
            })
            
            if (res.ok) {
                const data = await res.json()
                const productsData = data.products || []
                
                // Save to Convex
                if (productsData.length > 0) {
                    await convex.mutation(
                        api.scanRecommendations.saveScanProductRecommendations,
                        {
                            scanId: params.scanId,
                            products: productsData
                        }
                    )
                }
                
                setProducts(productsData)
                
                // Fetch usage guide after getting products
                if (productsData.length > 0) {
                    fetchUsageGuide(productsData, analysis)
                }
            }
        } catch (error) {
            console.error('Error fetching product recommendations:', error)
        } finally {
            setLoadingProducts(false)
        }
    }

    const fetchUsageGuide = async (productList, analysis) => {
        try {
            // First, check if usage guide already exists in Convex
            const savedGuide = await convex.query(
                api.scanRecommendations.getProductUsageGuide,
                { scanId: params.scanId }
            )

            if (savedGuide && savedGuide.guide) {
                // Use saved guide
                setUsageGuide(savedGuide.guide)
                return
            }

            // If not saved, fetch from API
            setLoadingGuide(true)
            const res = await fetch('/api/product-usage-guide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    products: productList,
                    skinType: analysis?.skinType,
                    conditions: analysis?.conditions
                })
            })
            
            if (res.ok) {
                const data = await res.json()
                const guideText = data.guide
                
                // Save to Convex
                if (guideText) {
                    await convex.mutation(
                        api.scanRecommendations.saveProductUsageGuide,
                        {
                            scanId: params.scanId,
                            guide: guideText
                        }
                    )
                }
                
                setUsageGuide(guideText)
            }
        } catch (error) {
            console.error('Error fetching usage guide:', error)
        } finally {
            setLoadingGuide(false)
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

    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent'
        if (score >= 60) return 'Good'
        if (score >= 40) return 'Fair'
        return 'Needs Attention'
    }

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'severe': return 'text-red-500 bg-red-500/10'
            case 'moderate': return 'text-yellow-500 bg-yellow-500/10'
            default: return 'text-green-500 bg-green-500/10'
        }
    }

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-[60vh]'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            </div>
        )
    }

    if (!scan) {
        return (
            <div className='text-center py-12'>
                <AlertCircle className='w-12 h-12 text-muted-foreground mx-auto mb-4' />
                <h2 className='text-xl font-semibold mb-2'>Scan not found</h2>
                <p className='text-muted-foreground mb-4'>This scan may have been deleted or doesn't exist.</p>
                <Link href='/dashboard'>
                    <Button className='cursor-pointer bg-gradient-to-r from-[#E8C77A] via-[#C9A44A] to-[#8FAF6A] hover:from-[#E8C77A]/90 hover:via-[#C9A44A]/90 hover:to-[#8FAF6A]/90 text-white border-0'>
                        Return to Dashboard
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className='max-w-4xl mx-auto'>
            {/* Header */}
            <div className='flex items-center gap-4 mb-6'>
                <Link href='/dashboard'>
                    <Button 
                        variant='ghost' 
                        size='icon'
                        className='cursor-pointer'
                    >
                        <ArrowLeft className='w-5 h-5' />
                    </Button>
                </Link>
                <div>
                    <h1 className='text-2xl font-bold text-foreground'>Scan Results</h1>
                    <p className='text-sm text-muted-foreground'>
                        {moment(scan._creationTime).format('MMMM D, YYYY [at] h:mm A')}
                    </p>
                </div>
            </div>

            <div className='grid md:grid-cols-2 gap-6'>
                {/* Image and Score */}
                <div className='space-y-4'>
                    {/* Image */}
                    <div className='bg-card border border-border rounded-2xl overflow-hidden'>
                        <img 
                            src={scan.imageUrl} 
                            alt='Skin scan'
                            className='w-full h-auto object-cover'
                        />
                    </div>

                    {/* Score Card */}
                    <div className='bg-card border border-border rounded-2xl p-6'>
                        <div className='text-center'>
                            <p className='text-sm text-muted-foreground mb-2'>Overall Skin Score</p>
                            <div className='relative w-32 h-32 mx-auto mb-3'>
                                <svg className='w-full h-full transform -rotate-90'>
                                    <circle
                                        cx='64'
                                        cy='64'
                                        r='56'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeWidth='8'
                                        className='text-muted'
                                    />
                                    <circle
                                        cx='64'
                                        cy='64'
                                        r='56'
                                        fill='none'
                                        stroke='currentColor'
                                        strokeWidth='8'
                                        strokeDasharray={`${(scan.analysis?.overallScore / 100) * 352} 352`}
                                        className={getScoreColor(scan.analysis?.overallScore)}
                                    />
                                </svg>
                                <div className='absolute inset-0 flex items-center justify-center'>
                                    <span className={`text-4xl font-bold ${getScoreColor(scan.analysis?.overallScore)}`}>
                                        {scan.analysis?.overallScore}
                                    </span>
                                </div>
                            </div>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getScoreBg(scan.analysis?.overallScore)} text-white`}>
                                {getScoreLabel(scan.analysis?.overallScore)}
                            </span>
                        </div>

                        {scan.analysis?.skinType && (
                            <div className='mt-4 pt-4 border-t border-border text-center'>
                                <p className='text-sm text-muted-foreground'>Skin Type</p>
                                <p className='text-lg font-semibold capitalize'>{scan.analysis.skinType}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Analysis Details */}
                <div className='space-y-4'>
                    {/* Conditions Detected */}
                    <div className='bg-card border border-border rounded-2xl p-6'>
                        <h3 className='font-semibold text-foreground mb-4 flex items-center gap-2'>
                            <AlertCircle className='w-5 h-5 text-primary' />
                            Conditions Detected
                        </h3>
                        {scan.analysis?.conditions?.length > 0 ? (
                            <div className='space-y-3'>
                                {scan.analysis.conditions.map((condition, index) => (
                                    <div key={index} className='flex items-center justify-between p-3 bg-muted/50 rounded-xl'>
                                        <div>
                                            <p className='font-medium'>{condition.name}</p>
                                            <p className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${getSeverityColor(condition.severity)}`}>
                                                {condition.severity}
                                            </p>
                                        </div>
                                        <div className='text-right'>
                                            <p className='text-sm text-muted-foreground'>Confidence</p>
                                            <p className='font-semibold'>{condition.confidence}%</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className='text-muted-foreground'>No significant conditions detected</p>
                        )}
                    </div>

                    {/* Recommendations */}
                    <div className='bg-card border border-border rounded-2xl p-6'>
                        <h3 className='font-semibold text-foreground mb-4 flex items-center gap-2'>
                            <Sparkles className='w-5 h-5 text-primary' />
                            Recommendations
                        </h3>
                        <div className='space-y-2'>
                            {scan.analysis?.recommendations?.map((rec, index) => (
                                <div key={index} className='flex gap-3 items-start'>
                                    <CheckCircle className='w-5 h-5 text-green-500 mt-0.5 flex-shrink-0' />
                                    <p className='text-sm text-muted-foreground'>{rec}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Analysis */}
            {scan.analysis?.detailedAnalysis && (
                <div className='bg-card border border-border rounded-2xl p-6 mt-6'>
                    <h3 className='font-semibold text-foreground mb-4'>Detailed Analysis</h3>
                    <p className='text-muted-foreground whitespace-pre-line'>
                        {scan.analysis.detailedAnalysis}
                    </p>
                </div>
            )}

            {/* Product Recommendations */}
            {products.length > 0 && (
                <div className='bg-card border border-border rounded-2xl p-6 mt-6'>
                    <div className='flex items-center gap-2 mb-4'>
                        <Sparkles className='w-5 h-5 text-primary' />
                        <h3 className='font-semibold text-foreground'>Recommended Products</h3>
                    </div>
                    <p className='text-sm text-muted-foreground mb-4'>
                        Based on your skin analysis, these products from MedPlus may help improve your skin:
                    </p>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        {products.map((product, index) => (
                            <a
                                key={index}
                                href={product.url}
                                target='_blank'
                                rel='noopener noreferrer'
                                className='p-3 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors group border border-border hover:border-primary'
                            >
                                <p className='font-medium text-sm text-foreground group-hover:text-primary truncate'>
                                    {product.name}
                                </p>
                                {product.price && (
                                    <p className='text-xs text-muted-foreground mt-1'>
                                        ₦{product.price}
                                    </p>
                                )}
                                <p className='text-xs text-muted-foreground mt-2 opacity-70 flex items-center gap-1'>
                                    View on {product.source} <ChevronRight className='w-3 h-3' />
                                </p>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Loading Products */}
            {loadingProducts && (
                <div className='bg-card border border-border rounded-2xl p-6 mt-6 flex items-center justify-center gap-2'>
                    <Loader2 className='w-5 h-5 animate-spin text-primary' />
                    <p className='text-sm text-muted-foreground'>Finding recommended products...</p>
                </div>
            )}

            {/* How to Use Products Guide */}
            {usageGuide && (
                <div className='bg-card border border-border rounded-2xl p-6 mt-6'>
                    <div className='flex items-center gap-2 mb-2'>
                        <Clock className='w-5 h-5 text-primary' />
                        <h3 className='font-semibold text-lg text-foreground'>Personalized Routine Options</h3>
                    </div>
                    <p className='text-sm text-muted-foreground mb-6'>
                        Choose the routine option that works best for your budget, skin tolerance, and preferences. You don't need to use all products.
                    </p>
                    
                    <div className='space-y-2'>
                        {usageGuide.split('\n\n').reduce((routineOptions, section, index) => {
                            const lines = section.split('\n').filter(l => l.trim());
                            if (lines.length === 0) return routineOptions;

                            const isRoutineOption = section.toLowerCase().includes('routine option');
                            
                            if (isRoutineOption) {
                                // Extract routine number from first line
                                const firstLine = lines[0].replace(/[\*\#]/g, '').trim();
                                const routineNum = routineOptions.length;
                                
                                routineOptions.push({
                                    title: firstLine,
                                    sections: [section],
                                    index: index
                                });
                            } else if (routineOptions.length > 0) {
                                // Add to the last routine
                                routineOptions[routineOptions.length - 1].sections.push(section);
                            }
                            
                            return routineOptions;
                        }, []).map((routine, routineIndex) => {
                            const isExpanded = expandedRoutine === routineIndex;
                            
                            return (
                                <div key={routineIndex} className='border border-border rounded-lg overflow-hidden'>
                                    {/* Accordion Trigger */}
                                    <button
                                        onClick={() => setExpandedRoutine(isExpanded ? -1 : routineIndex)}
                                        className='w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors'
                                    >
                                        <div className='flex items-center gap-3'>
                                            <Sparkles className='w-5 h-5 text-amber-500' />
                                            <h4 className='font-semibold text-foreground text-left'>
                                                {routine.title}
                                            </h4>
                                        </div>
                                        <ChevronDown 
                                            className={`w-5 h-5 text-muted-foreground transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {/* Accordion Content */}
                                    {isExpanded && (
                                        <div className='border-t border-border p-4 bg-muted/20 space-y-4'>
                                            {routine.sections.map((section, sectionIndex) => {
                                                const lines = section.split('\n').filter(l => l.trim());
                                                if (lines.length === 0) return null;

                                                const isMorning = section.toLowerCase().includes('morning');
                                                const isEvening = section.toLowerCase().includes('evening');
                                                const isTips = section.toLowerCase().includes('important') || section.toLowerCase().includes('tips') || section.toLowerCase().includes('avoid');
                                                const isBestFor = section.toLowerCase().includes('best for');

                                                let headerIcon, bgColor;
                                                
                                                if (isMorning) {
                                                    headerIcon = <Sun className='w-5 h-5 text-yellow-500' />;
                                                    bgColor = 'bg-yellow-500/5 border-yellow-500/20';
                                                } else if (isEvening) {
                                                    headerIcon = <Moon className='w-5 h-5 text-blue-500' />;
                                                    bgColor = 'bg-blue-500/5 border-blue-500/20';
                                                } else if (isTips) {
                                                    headerIcon = <AlertCircle className='w-5 h-5 text-red-500' />;
                                                    bgColor = 'bg-red-500/5 border-red-500/20';
                                                } else {
                                                    headerIcon = <Sparkles className='w-5 h-5 text-pink-500' />;
                                                    bgColor = 'bg-pink-500/5 border-pink-500/20';
                                                }

                                                return (
                                                    <div key={sectionIndex} className={`border rounded-lg p-4 ${bgColor}`}>
                                                        {/* Section Header */}
                                                        {!lines[0].toLowerCase().includes('routine option') && (
                                                            <div className='flex items-center gap-2 mb-3'>
                                                                {headerIcon}
                                                                <h5 className='font-semibold text-foreground'>
                                                                    {lines[0].replace(/[\*\#]/g, '').trim()}
                                                                </h5>
                                                            </div>
                                                        )}

                                                        {/* Section Content */}
                                                        <div className={`space-y-2 ${!lines[0].toLowerCase().includes('routine option') ? 'ml-7' : ''}`}>
                                                            {lines.slice(lines[0].toLowerCase().includes('routine option') ? 1 : 1).map((line, lineIndex) => {
                                                                const trimmed = line.trim();
                                                                if (!trimmed) return null;

                                                                // Numbered items (1., 2., etc.)
                                                                if (/^\d+\./.test(trimmed)) {
                                                                    const content = trimmed.replace(/^\d+\.\s*/, '');
                                                                    return (
                                                                        <div key={lineIndex} className='flex gap-3'>
                                                                            <span className='font-semibold text-primary flex-shrink-0'>
                                                                                {trimmed.match(/^\d+/)[0]}.
                                                                            </span>
                                                                            <p className='text-sm text-foreground'>
                                                                                {content.split('**').map((part, i) =>
                                                                                    i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    );
                                                                }

                                                                // Bullet points
                                                                if (/^[•\-\*]/.test(trimmed)) {
                                                                    const content = trimmed.replace(/^[•\-\*]\s*/, '');
                                                                    return (
                                                                        <div key={lineIndex} className='flex gap-2'>
                                                                            <CheckCircle className='w-4 h-4 text-green-500 mt-0.5 flex-shrink-0' />
                                                                            <p className='text-sm text-foreground'>
                                                                                {content.split('**').map((part, i) =>
                                                                                    i % 2 === 0 ? part : <strong key={i}>{part}</strong>
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    );
                                                                }

                                                                // Regular text (potentially with bold)
                                                                return (
                                                                    <p key={lineIndex} className='text-sm text-muted-foreground leading-relaxed'>
                                                                        {trimmed.split('**').map((part, i) =>
                                                                            i % 2 === 0 ? part : <strong key={i} className='text-foreground'>{part}</strong>
                                                                        )}
                                                                    </p>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Loading Usage Guide */}
            {loadingGuide && products.length > 0 && (
                <div className='bg-card border border-border rounded-2xl p-6 mt-6 flex items-center justify-center gap-2'>
                    <Loader2 className='w-5 h-5 animate-spin text-primary' />
                    <p className='text-sm text-muted-foreground'>Creating your personalized routine guide...</p>
                </div>
            )}

            {/* Chat About This Scan */}
            <div className='bg-card border border-border rounded-2xl p-6 mt-6'>
                <h3 className='font-semibold text-foreground mb-4 flex items-center gap-2'>
                    <MessageCircle className='w-5 h-5' />
                    Ask about this scan
                </h3>
                <p className='text-sm text-muted-foreground mb-4'>
                    Have questions about your results? Chat with our AI skincare expert about this specific analysis.
                </p>
                <Link href={`/chat?scanId=${params.scanId}`}>
                    <Button className='cursor-pointer w-full bg-gradient-to-r from-[#E8C77A] via-[#C9A44A] to-[#8FAF6A] hover:from-[#E8C77A]/90 hover:via-[#C9A44A]/90 hover:to-[#8FAF6A]/90 text-white border-0'>
                        <MessageCircle className='w-4 h-4 mr-2' />
                        Chat about this scan
                    </Button>
                </Link>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-wrap gap-4 mt-6'>
                <Link href='/skin-scan'>
                    <Button className='cursor-pointer text-white' style={{background: 'linear-gradient(135deg, #E8C77A 0%, #C9A44A 45%, #8FAF6A 100%)'}}>
                        <Camera className='w-4 h-4 mr-2' />
                        New Scan
                    </Button>
                </Link>
                <Link href='/daily-tracker'>
                    <Button variant='outline' className='cursor-pointer'>
                        <Calendar className='w-4 h-4 mr-2' />
                        Log Today
                    </Button>
                </Link>
                <Link href='/chat'>
                    <Button variant='outline' className='cursor-pointer'>
                        <MessageCircle className='w-4 h-4 mr-2' />
                        Ask AI
                    </Button>
                </Link>
                <Link href='/progress'>
                    <Button variant='outline' className='cursor-pointer'>
                        <TrendingUp className='w-4 h-4 mr-2' />
                        View Progress
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default ScanResultPage
