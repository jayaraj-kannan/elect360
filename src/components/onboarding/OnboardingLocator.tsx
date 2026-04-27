"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Locate, Search, ShieldCheck, Loader2, MapPin } from 'lucide-react';
import { electionData, Ward } from '@/data/electionData';
import BoothSearchForm from '../dashboard/BoothSearchForm';

interface OnboardingLocatorProps {
  onComplete: (ward: Ward) => void;
}

export default function OnboardingLocator({ onComplete }: OnboardingLocatorProps) {
  const [view, setView] = useState<'options' | 'manual' | 'locating'>('options');
  const [error, setError] = useState<string | null>(null);

  const handleLiveLocation = () => {
    setView('locating');
    if (!navigator.geolocation) {
      setError("GPS not supported on this browser");
      setView('options');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          // Fetch all booths and find the nearest one (client-side for demo)
          const { searchBooths } = await import('@/lib/boothService');
          const allBooths = await searchBooths(""); // Get all
          
          let nearest = allBooths[0];
          let minDistance = Infinity;

          allBooths.forEach(booth => {
            const dist = Math.sqrt(
              Math.pow(booth.coords.lat - latitude, 2) + 
              Math.pow(booth.coords.lng - longitude, 2)
            );
            if (dist < minDistance) {
              minDistance = dist;
              nearest = booth;
            }
          });

          if (nearest) {
            const ward: Ward = {
              id: nearest.wardId,
              name: nearest.wardName,
              stateId: nearest.stateId,
              booth: {
                id: nearest.id,
                name: nearest.name,
                address: nearest.address,
                coords: nearest.coords,
                distance: nearest.distance,
                travelTime: nearest.travelTime
              }
            };
            setTimeout(() => onComplete(ward), 1000);
          } else {
            setError("No booths found nearby.");
            setView('options');
          }
        } catch (err) {
          console.error(err);
          setError("Failed to locate booth.");
          setView('options');
        }
      },
      () => {
        setError("Permission denied. Try manual selection.");
        setView('options');
      }
    );
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass w-full max-w-xl rounded-[40px] border-white/10 p-8 md:p-12 shadow-premium relative overflow-hidden"
      >
        <div className="text-center space-y-4 mb-12">
            <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto text-brand-primary border border-brand-primary/20 shadow-glow">
                <MapPin size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight italic">Find Your Booth</h2>
              <p className="text-sm font-bold opacity-40 uppercase tracking-widest mt-2">Essential to personalize your dashboard</p>
            </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'options' && (
            <motion.div 
              key="options"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[10px] font-black text-red-400 uppercase tracking-[0.2em] text-center mb-4">
                   {error}
                </div>
              )}
              <button 
                onClick={handleLiveLocation}
                className="w-full p-8 bg-white/5 border border-white/5 hover:border-brand-primary/40 rounded-3xl flex items-center gap-6 group transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform shadow-premium">
                  <Locate size={32} />
                </div>
                <div className="text-left">
                  <p className="text-xl font-black uppercase tracking-tight">Detect Location</p>
                  <p className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">Faster (via GPS)</p>
                </div>
              </button>

              <button 
                onClick={() => setView('manual')}
                className="w-full p-8 bg-white/5 border border-white/10 hover:border-white/20 rounded-3xl flex items-center gap-6 group transition-all"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:scale-110 transition-transform">
                  <Search size={32} />
                </div>
                <div className="text-left">
                  <p className="text-xl font-black uppercase tracking-tight">Manual Selection</p>
                  <p className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">Select District & Ward</p>
                </div>
              </button>
            </motion.div>
          )}

          {view === 'locating' && (
             <motion.div 
               key="locating"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="py-12 flex flex-col items-center justify-center space-y-6"
             >
                <div className="relative">
                  <div className="absolute inset-0 bg-brand-primary/20 blur-2xl rounded-full animate-pulse" />
                  <Loader2 size={64} className="animate-spin text-brand-primary relative" />
                </div>
                <p className="text-lg font-black uppercase tracking-widest animate-pulse italic">Synchronizing GPS...</p>
             </motion.div>
          )}

          {view === 'manual' && (
            <motion.div 
              key="manual"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="pt-4"
            >
              <BoothSearchForm onSelect={onComplete} />
              <button 
                onClick={() => setView('options')}
                className="w-full mt-6 text-[10px] font-black opacity-40 uppercase tracking-widest hover:opacity-100 transition-opacity"
              >
                Go Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 flex items-center justify-center gap-3 p-4 rounded-2xl bg-brand-secondary/5 border border-brand-secondary/10">
            <ShieldCheck size={18} className="text-brand-secondary" />
            <p className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">Privacy Protected • ECI Official Database</p>
        </div>
      </motion.div>
    </div>
  );
}
