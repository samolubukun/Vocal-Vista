'use client'
import { UserContext } from '@/app/_context/UserContext';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react'
import React, { useContext, useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Minus, BarChart3 } from 'lucide-react';
import Link from 'next/link';

function ProgressOverview() {
  const convex = useConvex();
  const { userData } = useContext(UserContext);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({
    trend: 'stable',
    change: 0,
    avgScore: 0,
    totalScans: 0
  });

  useEffect(() => {
    if (userData) {
      fetchProgress();
    }
  }, [userData]);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      const result = await convex.query(api.skinScans.getSkinScans, {
        uid: userData?._id
      });
      setScans(result || []);
      
      if (result && result.length > 0) {
        const scores = result.map(s => s.analysis?.overallScore || 0);
        const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
        
        let trend = 'stable';
        let change = 0;
        
        if (result.length >= 2) {
          const recent = result.slice(0, 3);
          const recentAvg = recent.reduce((a, s) => a + (s.analysis?.overallScore || 0), 0) / recent.length;
          const older = result.slice(3, 6);
          if (older.length > 0) {
            const olderAvg = older.reduce((a, s) => a + (s.analysis?.overallScore || 0), 0) / older.length;
            change = Math.round(recentAvg - olderAvg);
            trend = change > 2 ? 'improving' : change < -2 ? 'declining' : 'stable';
          }
        }
        
        setProgress({
          trend,
          change,
          avgScore,
          totalScans: result.length
        });
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrendIcon = () => {
    switch (progress.trend) {
      case 'improving':
        return <TrendingUp className='w-5 h-5 text-green-500' />;
      case 'declining':
        return <TrendingDown className='w-5 h-5 text-red-500' />;
      default:
        return <Minus className='w-5 h-5 text-yellow-500' />;
    }
  };

  const getTrendText = () => {
    switch (progress.trend) {
      case 'improving':
        return 'Improving';
      case 'declining':
        return 'Needs attention';
      default:
        return 'Stable';
    }
  };

  const getTrendColor = () => {
    switch (progress.trend) {
      case 'improving':
        return 'text-green-500';
      case 'declining':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  if (loading) {
    return (
      <div>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-1 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full'></div>
          <h2 className='font-bold text-lg md:text-xl'>Progress Overview</h2>
        </div>
        <div className='flex items-center justify-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary'></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4'>
        <div className='flex items-center gap-3'>
          <div className='w-1 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full'></div>
          <h2 className='font-bold text-lg md:text-xl'>Progress Overview</h2>
        </div>
        <Link href='/progress'>
          <Button variant='outline' size='sm' className='cursor-pointer w-full sm:w-auto'>
            <BarChart3 className='w-4 h-4 mr-2' />
            Details
          </Button>
        </Link>
      </div>

      {progress.totalScans === 0 ? (
        <div className='text-center py-8 px-4'>
          <div className='w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4'>
            <BarChart3 className='w-8 h-8 text-purple-600' />
          </div>
          <h3 className='text-muted-foreground font-semibold mb-2'>No data yet</h3>
          <p className='text-sm text-muted-foreground mb-6 max-w-xs mx-auto'>
            Complete your first scan to start tracking progress
          </p>
          <Link href='/skin-scan'>
            <Button className='cursor-pointer w-full sm:w-auto text-white' style={{background: 'linear-gradient(135deg, #E8C77A 0%, #C9A44A 45%, #8FAF6A 100%)'}}>
              <BarChart3 className='w-4 h-4 mr-2' />
              Start Tracking
            </Button>
          </Link>
        </div>
      ) : (
        <div className='space-y-6'>
          {/* Average Score */}
          <div className='bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-950/20 dark:to-cyan-950/20 rounded-xl p-4 md:p-6 border border-emerald-100 dark:border-emerald-800'>
            <p className='text-sm text-muted-foreground mb-2'>Average Skin Score</p>
            <div className='flex items-end gap-2'>
              <span className='text-3xl md:text-4xl font-bold text-foreground'>{progress.avgScore}</span>
              <span className='text-muted-foreground mb-1'>/100</span>
            </div>
            <div className='w-full bg-gray-200 rounded-full h-2 mt-3'>
              <div 
                className='bg-gradient-to-r from-emerald-500 to-cyan-500 h-2 rounded-full transition-all duration-500'
                style={{width: `${progress.avgScore}%`}}
              ></div>
            </div>
          </div>

          {/* Trend */}
          <div className='flex items-center justify-between p-4 bg-muted/30 rounded-xl'>
            <div>
              <p className='text-sm text-muted-foreground mb-1'>Current Trend</p>
              <div className='flex items-center gap-2'>
                {getTrendIcon()}
                <span className={`font-semibold ${getTrendColor()}`}>
                  {getTrendText()}
                </span>
              </div>
            </div>
            {progress.change !== 0 && (
              <div className={`text-right ${getTrendColor()}`}>
                <span className='text-lg md:text-xl font-bold'>
                  {progress.change > 0 ? '+' : ''}{progress.change}
                </span>
                <p className='text-xs text-muted-foreground'>vs previous</p>
              </div>
            )}
          </div>

          {/* Stats */}
          <div className='grid grid-cols-2 gap-3 md:gap-4'>
            <div className='bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-3 md:p-4 text-center border border-blue-100 dark:border-blue-800'>
              <p className='text-xl md:text-2xl font-bold text-foreground mb-1'>{progress.totalScans}</p>
              <p className='text-xs text-muted-foreground'>Total Scans</p>
            </div>
            <div className='bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-lg p-3 md:p-4 text-center border border-orange-100 dark:border-orange-800'>
              <p className='text-xl md:text-2xl font-bold text-foreground mb-1'>
                {scans[0]?.analysis?.conditions?.length || 0}
              </p>
              <p className='text-xs text-muted-foreground'>Active Concerns</p>
            </div>
          </div>

          <Link href='/progress'>
            <Button variant='ghost' className='w-full cursor-pointer hover:bg-primary/5 transition-colors'>
              <BarChart3 className='w-4 h-4 mr-2' />
              View Detailed Progress
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default ProgressOverview
