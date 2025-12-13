'use client'
import React, { useState, useContext, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { 
    Calendar, 
    Plus, 
    X, 
    Droplets, 
    Moon, 
    Brain, 
    Utensils,
    Sparkles,
    Save,
    Loader2,
    CheckCircle,
    ArrowLeft
} from 'lucide-react'
import { useMutation, useConvex } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { UserContext } from '@/app/_context/UserContext'
import { toast } from 'sonner'
import moment from 'moment'

const productTypes = ['Cleanser', 'Toner', 'Serum', 'Moisturizer', 'Sunscreen', 'Treatment', 'Mask', 'Other']
const timeOfDayOptions = ['Morning', 'Evening', 'Both']
const skinFeelings = ['Great', 'Good', 'Normal', 'Irritated', 'Dry', 'Oily', 'Breaking out']
const stressLevels = ['Low', 'Medium', 'High']
const dietOptions = ['Healthy', 'Balanced', 'Moderate', 'Unhealthy']

function DailyTrackerPage() {
    const { userData } = useContext(UserContext)
    const convex = useConvex()
    const createDailyLog = useMutation(api.dailyLogs.createDailyLog)
    
    const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'))
    const [isSaving, setIsSaving] = useState(false)
    const [existingLog, setExistingLog] = useState(null)
    
    const [products, setProducts] = useState([])
    const [newProduct, setNewProduct] = useState({ name: '', type: 'Cleanser', timeOfDay: 'Morning' })
    const [showAddProduct, setShowAddProduct] = useState(false)
    
    const [habits, setHabits] = useState({
        waterIntake: 8,
        sleepHours: 7,
        stressLevel: 'Medium',
        diet: 'Balanced'
    })
    
    const [skinFeeling, setSkinFeeling] = useState('Normal')
    const [notes, setNotes] = useState('')

    useEffect(() => {
        if (userData && selectedDate) {
            fetchExistingLog()
        }
    }, [userData, selectedDate])

    const fetchExistingLog = async () => {
        try {
            const log = await convex.query(api.dailyLogs.getDailyLogByDate, {
                uid: userData._id,
                date: selectedDate
            })
            if (log) {
                setExistingLog(log)
                setProducts(log.productsUsed || [])
                setHabits(log.habits || { waterIntake: 8, sleepHours: 7, stressLevel: 'Medium', diet: 'Balanced' })
                setSkinFeeling(log.skinFeeling || 'Normal')
                setNotes(log.notes || '')
            } else {
                setExistingLog(null)
                setProducts([])
                setHabits({ waterIntake: 8, sleepHours: 7, stressLevel: 'Medium', diet: 'Balanced' })
                setSkinFeeling('Normal')
                setNotes('')
            }
        } catch (error) {
            console.error('Error fetching log:', error)
        }
    }

    const addProduct = () => {
        if (newProduct.name.trim()) {
            setProducts([...products, { ...newProduct }])
            setNewProduct({ name: '', type: 'Cleanser', timeOfDay: 'Morning' })
            setShowAddProduct(false)
        }
    }

    const removeProduct = (index) => {
        setProducts(products.filter((_, i) => i !== index))
    }

    const saveLog = async () => {
        if (!userData) {
            toast.error('Please log in to save your daily log')
            return
        }

        setIsSaving(true)
        try {
            await createDailyLog({
                uid: userData._id,
                date: selectedDate,
                productsUsed: products,
                habits: habits,
                skinFeeling: skinFeeling,
                notes: notes || undefined
            })
            toast.success('Daily log saved successfully!')
            setExistingLog({ ...existingLog, date: selectedDate })
        } catch (error) {
            console.error('Error saving log:', error)
            toast.error('Failed to save log. Please try again.')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className='max-w-3xl mx-auto'>
            <div className='flex items-center gap-3 mb-8'>
                <Link href='/dashboard'>
                    <Button variant='ghost' size='icon' className='cursor-pointer'>
                        <ArrowLeft className='w-5 h-5' />
                    </Button>
                </Link>
                <div>
                    <h1 className='text-3xl font-bold text-foreground'>Daily Tracker</h1>
                    <p className='text-sm text-muted-foreground'>
                        Log your skincare routine and habits to track what works
                    </p>
                </div>
            </div>

            {/* Date Selector */}
            <div className='bg-card border border-border rounded-2xl p-4 mb-6'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <Calendar className='w-5 h-5 text-primary' />
                        <div>
                            <p className='text-sm text-muted-foreground'>Log for</p>
                            <p className='font-semibold'>{moment(selectedDate).format('MMMM D, YYYY')}</p>
                        </div>
                    </div>
                    <input
                        type='date'
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        max={moment().format('YYYY-MM-DD')}
                        className='bg-muted border border-border rounded-lg px-3 py-2 text-sm'
                    />
                </div>
                {existingLog && (
                    <div className='mt-3 flex items-center gap-2 text-sm text-green-600'>
                        <CheckCircle className='w-4 h-4' />
                        Log exists for this date - editing will update it
                    </div>
                )}
            </div>

            {/* Products Used */}
            <div className='bg-card border border-border rounded-2xl p-6 mb-6'>
                <div className='flex items-center justify-between mb-4'>
                    <h3 className='font-semibold text-foreground flex items-center gap-2'>
                        <Sparkles className='w-5 h-5 text-primary' />
                        Products Used
                    </h3>
                    <Button 
                        variant='outline' 
                        size='sm' 
                        onClick={() => setShowAddProduct(true)}
                        className='cursor-pointer'
                    >
                        <Plus className='w-4 h-4 mr-1' />
                        Add Product
                    </Button>
                </div>

                {showAddProduct && (
                    <div className='bg-muted/50 rounded-xl p-4 mb-4'>
                        <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-3'>
                            <input
                                type='text'
                                placeholder='Product name'
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                className='bg-background border border-border rounded-lg px-3 py-2 text-sm'
                            />
                            <select
                                value={newProduct.type}
                                onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}
                                className='bg-background border border-border rounded-lg px-3 py-2 text-sm'
                            >
                                {productTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <select
                                value={newProduct.timeOfDay}
                                onChange={(e) => setNewProduct({ ...newProduct, timeOfDay: e.target.value })}
                                className='bg-background border border-border rounded-lg px-3 py-2 text-sm'
                            >
                                {timeOfDayOptions.map(time => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                        </div>
                        <div className='flex gap-2'>
                            <Button size='sm' onClick={addProduct} className='cursor-pointer bg-gradient-to-r from-[#E8C77A] via-[#C9A44A] to-[#8FAF6A] hover:from-[#E8C77A]/90 hover:via-[#C9A44A]/90 hover:to-[#8FAF6A]/90 text-white border-0'>Add</Button>
                            <Button size='sm' variant='ghost' onClick={() => setShowAddProduct(false)} className='cursor-pointer'>Cancel</Button>
                        </div>
                    </div>
                )}

                {products.length > 0 ? (
                    <div className='space-y-2'>
                        {products.map((product, index) => (
                            <div key={index} className='flex items-center justify-between p-3 bg-muted/30 rounded-xl'>
                                <div>
                                    <p className='font-medium'>{product.name}</p>
                                    <p className='text-xs text-muted-foreground'>{product.type} • {product.timeOfDay}</p>
                                </div>
                                <button onClick={() => removeProduct(index)} className='p-1 hover:bg-muted rounded'>
                                    <X className='w-4 h-4 text-muted-foreground' />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className='text-muted-foreground text-sm'>No products added yet</p>
                )}
            </div>

            {/* Habits */}
            <div className='bg-card border border-border rounded-2xl p-6 mb-6'>
                <h3 className='font-semibold text-foreground mb-4'>Daily Habits</h3>
                
                <div className='grid grid-cols-2 gap-4'>
                    {/* Water Intake */}
                    <div className='bg-muted/30 rounded-xl p-4'>
                        <div className='flex items-center gap-2 mb-2'>
                            <Droplets className='w-5 h-5 text-blue-500' />
                            <span className='font-medium'>Water Intake</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type='range'
                                min='0'
                                max='15'
                                value={habits.waterIntake}
                                onChange={(e) => setHabits({ ...habits, waterIntake: Number(e.target.value) })}
                                className='flex-1'
                            />
                            <span className='text-sm font-semibold w-20'>{habits.waterIntake} glasses</span>
                        </div>
                    </div>

                    {/* Sleep */}
                    <div className='bg-muted/30 rounded-xl p-4'>
                        <div className='flex items-center gap-2 mb-2'>
                            <Moon className='w-5 h-5 text-purple-500' />
                            <span className='font-medium'>Sleep Hours</span>
                        </div>
                        <div className='flex items-center gap-2'>
                            <input
                                type='range'
                                min='0'
                                max='12'
                                value={habits.sleepHours}
                                onChange={(e) => setHabits({ ...habits, sleepHours: Number(e.target.value) })}
                                className='flex-1'
                            />
                            <span className='text-sm font-semibold w-20'>{habits.sleepHours} hours</span>
                        </div>
                    </div>

                    {/* Stress */}
                    <div className='bg-muted/30 rounded-xl p-4'>
                        <div className='flex items-center gap-2 mb-2'>
                            <Brain className='w-5 h-5 text-orange-500' />
                            <span className='font-medium'>Stress Level</span>
                        </div>
                        <div className='flex gap-2'>
                            {stressLevels.map(level => (
                                <button
                                    key={level}
                                    onClick={() => setHabits({ ...habits, stressLevel: level })}
                                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors
                                        ${habits.stressLevel === level 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'bg-background border border-border hover:bg-muted'}`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Diet */}
                    <div className='bg-muted/30 rounded-xl p-4'>
                        <div className='flex items-center gap-2 mb-2'>
                            <Utensils className='w-5 h-5 text-green-500' />
                            <span className='font-medium'>Diet Quality</span>
                        </div>
                        <select
                            value={habits.diet}
                            onChange={(e) => setHabits({ ...habits, diet: e.target.value })}
                            className='w-full bg-background border border-border rounded-lg px-3 py-2 text-sm'
                        >
                            {dietOptions.map(diet => (
                                <option key={diet} value={diet}>{diet}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Skin Feeling */}
            <div className='bg-card border border-border rounded-2xl p-6 mb-6'>
                <h3 className='font-semibold text-foreground mb-4'>How does your skin feel today?</h3>
                <div className='flex flex-wrap gap-2'>
                    {skinFeelings.map(feeling => (
                        <button
                            key={feeling}
                            onClick={() => setSkinFeeling(feeling)}
                            className={`py-2 px-4 rounded-full text-sm font-medium transition-colors
                                ${skinFeeling === feeling 
                                    ? 'bg-primary text-primary-foreground' 
                                    : 'bg-muted hover:bg-muted/80'}`}
                        >
                            {feeling}
                        </button>
                    ))}
                </div>
            </div>

            {/* Notes */}
            <div className='bg-card border border-border rounded-2xl p-6 mb-6'>
                <h3 className='font-semibold text-foreground mb-4'>Additional Notes</h3>
                <Textarea
                    placeholder='Any observations, reactions, or things to remember...'
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                />
            </div>

            {/* Save Button */}
            <Button 
                className='w-full py-6 cursor-pointer bg-gradient-to-r from-[#E8C77A] via-[#C9A44A] to-[#8FAF6A] hover:from-[#E8C77A]/90 hover:via-[#C9A44A]/90 hover:to-[#8FAF6A]/90 text-white border-0 disabled:opacity-50'
                onClick={saveLog}
                disabled={isSaving}
            >
                {isSaving ? (
                    <>
                        <Loader2 className='w-5 h-5 mr-2 animate-spin' />
                        Saving...
                    </>
                ) : (
                    <>
                        <Save className='w-5 h-5 mr-2' />
                        Save Daily Log
                    </>
                )}
            </Button>
        </div>
    )
}

export default DailyTrackerPage
