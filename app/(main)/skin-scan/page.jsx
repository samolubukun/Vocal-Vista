'use client'
import React, { useState, useRef, useContext } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, Upload, Loader2, X, Sparkles, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { UserContext } from '@/app/_context/UserContext'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

function SkinScanPage() {
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [useCamera, setUseCamera] = useState(false)
    const [stream, setStream] = useState(null)
    const videoRef = useRef(null)
    const canvasRef = useRef(null)
    const fileInputRef = useRef(null)
    const { userData } = useContext(UserContext)
    const createSkinScan = useMutation(api.skinScans.createSkinScan)
    const router = useRouter()

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'user', width: 640, height: 480 } 
            })
            setStream(mediaStream)
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream
            }
            setUseCamera(true)
        } catch (error) {
            console.error('Error accessing camera:', error)
            toast.error('Unable to access camera. Please check permissions.')
        }
    }

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
        setUseCamera(false)
    }

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current
            const canvas = canvasRef.current
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            const ctx = canvas.getContext('2d')
            ctx.drawImage(video, 0, 0)
            
            canvas.toBlob((blob) => {
                compressImage(blob).then(compressed => {
                    setImage(compressed)
                    setImagePreview(canvas.toDataURL('image/jpeg', 0.7))
                    stopCamera()
                })
            }, 'image/jpeg', 0.7)
        }
    }

    const handleFileUpload = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('Image size should be less than 10MB')
                return
            }
            compressImage(file).then(compressedFile => {
                setImage(compressedFile)
                const reader = new FileReader()
                reader.onloadend = () => {
                    setImagePreview(reader.result)
                }
                reader.readAsDataURL(compressedFile)
            })
        }
    }

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                const img = new Image()
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    let width = img.width
                    let height = img.height

                    // Resize if too large
                    const maxWidth = 1200
                    const maxHeight = 1200
                    if (width > height) {
                        if (width > maxWidth) {
                            height *= maxWidth / width
                            width = maxWidth
                        }
                    } else {
                        if (height > maxHeight) {
                            width *= maxHeight / height
                            height = maxHeight
                        }
                    }

                    canvas.width = width
                    canvas.height = height
                    const ctx = canvas.getContext('2d')
                    ctx.drawImage(img, 0, 0, width, height)

                    canvas.toBlob((blob) => {
                        resolve(blob)
                    }, 'image/jpeg', 0.7)
                }
                img.src = e.target.result
            }
            reader.readAsDataURL(file)
        })
    }

    const clearImage = () => {
        setImage(null)
        setImagePreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const analyzeSkin = async () => {
        if (!image || !userData) {
            toast.error('Please upload an image first')
            return
        }

        setIsAnalyzing(true)
        
        try {
            // Convert image to base64
            let base64Image
            if (image instanceof Blob) {
                base64Image = await blobToBase64(image)
            } else {
                base64Image = imagePreview
            }

            // Send to analysis API
            const response = await fetch('/api/skin-analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    image: base64Image
                }),
            })

            if (!response.ok) {
                throw new Error('Analysis failed')
            }

            const analysisResult = await response.json()

            // Save to Convex
            const scanId = await createSkinScan({
                uid: userData._id,
                imageUrl: base64Image,
                analysis: {
                    overallScore: analysisResult.overallScore,
                    conditions: analysisResult.conditions,
                    recommendations: analysisResult.recommendations,
                    skinType: analysisResult.skinType,
                    detailedAnalysis: analysisResult.detailedAnalysis,
                }
            })

            toast.success('Skin analysis complete!')
            router.push(`/scan-result/${scanId}`)
            
        } catch (error) {
            console.error('Error analyzing skin:', error)
            toast.error('Failed to analyze skin. Please try again.')
        } finally {
            setIsAnalyzing(false)
        }
    }

    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        })
    }

    return (
        <div className='max-w-2xl mx-auto'>
            <div className='flex items-center gap-3 mb-8'>
                <Link href='/dashboard'>
                    <Button variant='ghost' size='icon' className='cursor-pointer'>
                        <ArrowLeft className='w-5 h-5' />
                    </Button>
                </Link>
                <div>
                    <h1 className='text-3xl font-bold text-foreground'>AI Skin Scan</h1>
                    <p className='text-sm text-muted-foreground'>
                        Take or upload a clear selfie for instant skin analysis
                    </p>
                </div>
            </div>

            <div className='bg-card border border-border rounded-2xl p-6'>
                {!imagePreview && !useCamera ? (
                    <div className='space-y-4'>
                        <div 
                            className='border-2 border-dashed border-border rounded-xl p-12 text-center cursor-pointer hover:border-primary/50 transition-colors'
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className='w-12 h-12 text-muted-foreground mx-auto mb-4' />
                            <h3 className='font-semibold text-foreground mb-2'>Upload a Photo</h3>
                            <p className='text-sm text-muted-foreground'>
                                Click to upload or drag and drop<br/>
                                PNG, JPG up to 10MB
                            </p>
                            <input
                                ref={fileInputRef}
                                type='file'
                                accept='image/*'
                                className='hidden'
                                onChange={handleFileUpload}
                            />
                        </div>

                        <div className='flex items-center gap-4'>
                            <div className='flex-1 h-px bg-border'></div>
                            <span className='text-sm text-muted-foreground'>or</span>
                            <div className='flex-1 h-px bg-border'></div>
                        </div>

                        <Button 
                            className='w-full py-6 cursor-pointer bg-gradient-to-r from-[#E8C77A] via-[#C9A44A] to-[#8FAF6A] hover:from-[#E8C77A]/90 hover:via-[#C9A44A]/90 hover:to-[#8FAF6A]/90 text-white border-0'
                            onClick={startCamera}
                        >
                            <Camera className='w-5 h-5 mr-2' />
                            Use Camera
                        </Button>
                    </div>
                ) : useCamera ? (
                    <div className='space-y-4'>
                        <div className='relative rounded-xl overflow-hidden bg-black aspect-[4/3]'>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className='w-full h-full object-cover'
                            />
                            <canvas ref={canvasRef} className='hidden' />
                        </div>

                        <div className='flex gap-3'>
                            <Button 
                                variant='outline' 
                                className='flex-1 cursor-pointer'
                                onClick={stopCamera}
                            >
                                Cancel
                            </Button>
                            <Button 
                                className='flex-1 cursor-pointer bg-gradient-to-r from-[#E8C77A] via-[#C9A44A] to-[#8FAF6A] hover:from-[#E8C77A]/90 hover:via-[#C9A44A]/90 hover:to-[#8FAF6A]/90 text-white border-0'
                                onClick={capturePhoto}
                            >
                                <Camera className='w-4 h-4 mr-2' />
                                Capture
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        <div className='relative rounded-xl overflow-hidden bg-muted aspect-[4/3]'>
                            <img 
                                src={imagePreview} 
                                alt='Skin scan preview'
                                className='w-full h-full object-cover'
                            />
                            <button
                                onClick={clearImage}
                                className='absolute top-3 right-3 p-2 bg-background/80 backdrop-blur rounded-full hover:bg-background transition-colors'
                            >
                                <X className='w-4 h-4' />
                            </button>
                        </div>

                        <Button 
                            className='w-full py-6 cursor-pointer bg-gradient-to-r from-[#E8C77A] via-[#C9A44A] to-[#8FAF6A] hover:from-[#E8C77A]/90 hover:via-[#C9A44A]/90 hover:to-[#8FAF6A]/90 text-white border-0 disabled:opacity-50'
                            onClick={analyzeSkin}
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                                    Analyzing your skin...
                                </>
                            ) : (
                                <>
                                    <Sparkles className='w-5 h-5 mr-2' />
                                    Analyze My Skin
                                </>
                            )}
                        </Button>

                        <Button 
                            variant='outline'
                            className='w-full cursor-pointer'
                            onClick={clearImage}
                            disabled={isAnalyzing}
                        >
                            Choose Different Photo
                        </Button>
                    </div>
                )}
            </div>

            {/* Tips */}
            <div className='mt-6 bg-muted/50 rounded-xl p-4'>
                <div className='flex items-start gap-3'>
                    <AlertCircle className='w-5 h-5 text-primary mt-0.5' />
                    <div>
                        <h4 className='font-semibold text-foreground mb-1'>Tips for best results</h4>
                        <ul className='text-sm text-muted-foreground space-y-1'>
                            <li>• Use good, natural lighting</li>
                            <li>• Remove makeup if possible</li>
                            <li>• Take a clear, front-facing photo</li>
                            <li>• Ensure your face fills most of the frame</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SkinScanPage
