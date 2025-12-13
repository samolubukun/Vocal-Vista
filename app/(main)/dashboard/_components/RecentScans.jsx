'use client'
import { UserContext } from '@/app/_context/UserContext';
import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react'
import moment from 'moment';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { Camera, TrendingUp } from 'lucide-react';

function RecentScans() {
  const convex = useConvex();
  const { userData } = useContext(UserContext);
  const [skinScans, setSkinScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData) {
      getSkinScans();
    }
  }, [userData]);

  const getSkinScans = async () => {
    try {
      setLoading(true);
      const result = await convex.query(api.skinScans.getSkinScans, {
        uid: userData?._id
      });
      setSkinScans(result?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error fetching skin scans:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-500/10';
    if (score >= 60) return 'bg-yellow-500/10';
    return 'bg-red-500/10';
  };

  if (loading) {
    return (
      <div>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-1 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full'></div>
          <h2 className='font-bold text-lg md:text-xl'>Recent Skin Scans</h2>
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
          <div className='w-1 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full'></div>
          <h2 className='font-bold text-lg md:text-xl'>Recent Skin Scans</h2>
        </div>
        <Link href='/skin-scan'>
          <Button variant='outline' size='sm' className='cursor-pointer w-full sm:w-auto'>
            <Camera className='w-4 h-4 mr-2' />
            New Scan
          </Button>
        </Link>
      </div>

      {skinScans?.length === 0 ? (
        <div className='text-center py-8 px-4'>
          <div className='w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4'>
            <Camera className='w-8 h-8 text-blue-600' />
          </div>
          <h3 className='text-muted-foreground font-semibold mb-2'>No scans yet</h3>
          <p className='text-sm text-muted-foreground mb-6 max-w-xs mx-auto'>
            Start your skin journey with your first AI scan
          </p>
          <Link href='/skin-scan'>
            <Button className='cursor-pointer w-full sm:w-auto text-white' style={{background: 'linear-gradient(135deg, #E8C77A 0%, #C9A44A 45%, #8FAF6A 100%)'}}>
              <Camera className='w-4 h-4 mr-2' />
              Take First Scan
            </Button>
          </Link>
        </div>
      ) : (
        <div className='space-y-3'>
          {skinScans.map((scan, index) => (
            <Link href={`/scan-result/${scan._id}`} key={scan._id}>
              <div className='border-b border-border pb-3 mb-3 group flex justify-between items-center cursor-pointer hover:bg-muted/50 rounded-lg p-3 -m-1 transition-all duration-200 hover:shadow-sm'>
                <div className='flex gap-3 md:gap-4 items-center min-w-0 flex-1'>
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${getScoreBg(scan.analysis?.overallScore)}`}>
                    <span className={`text-sm md:text-lg font-bold ${getScoreColor(scan.analysis?.overallScore)}`}>
                      {scan.analysis?.overallScore || 0}
                    </span>
                  </div>
                  <div className='min-w-0 flex-1'>
                    <h3 className='font-semibold text-sm md:text-base truncate'>
                      {scan.analysis?.conditions?.[0]?.name || 'Skin Analysis'}
                    </h3>
                    <p className='text-xs md:text-sm text-muted-foreground'>
                      {moment(scan._creationTime).fromNow()}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2 ml-2'>
                  <TrendingUp className='w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0' />
                </div>
              </div>
            </Link>
          ))}
          
          <Link href='/progress'>
            <Button variant='ghost' className='w-full cursor-pointer mt-4 hover:bg-primary/5'>
              <TrendingUp className='w-4 h-4 mr-2' />
              View All Scans
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}

export default RecentScans
