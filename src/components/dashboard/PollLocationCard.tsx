"use client";

import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, ShieldCheck, Locate, Search, ChevronLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { electionData, Ward, Booth } from '@/data/electionData';
import BoothSearchForm from './BoothSearchForm';

type ViewState = 'initial' | 'search-options' | 'manual-form' | 'locating' | 'result';

export default function PollLocationCard() {
  const [view, setView] = useState<ViewState>('initial');
  const [selectedWard, setSelectedWard] = useState<Ward | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLiveLocation = () => {
    setView('locating');
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setView('search-options');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Mocking the "nearest" booth based on actual GPS success
        // In a real app, this would hit a backend with lat/lng
        setTimeout(() => {
          const mockWard = electionData[0].constituencies[0].wards[0];
          setSelectedWard(mockWard);
          setView('result');
        }, 2000);
      },
      (err) => {
        setError("Location permission denied or unavailable");
        setView('search-options');
      }
    );
  };

  const handleManualSelect = (ward: Ward) => {
    setSelectedWard(ward);
    setView('result');
  };

  const booth = selectedWard?.booth;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glass p-5 md:p-6 rounded-[32px] border-white/10 shadow-premium h-full flex flex-col min-h-[460px]"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
            <MapPin size={20} />
          </div>
          <div>
            <h3 className="font-black text-lg uppercase tracking-tight">FIND YOUR BOOTH</h3>
            <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest leading-none mt-1">Official ECI Location Finder</p>
          </div>
        </div>
        
        {view !== 'initial' && view !== 'locating' && (
          <button 
            onClick={() => setView(view === 'result' ? 'initial' : 'search-options')}
            className="p-2 hover:bg-white/5 rounded-full transition-colors opacity-40 hover:opacity-100"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {/* Initial State */}
        {view === 'initial' && !selectedWard && (
          <motion.div 
            key="initial"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-grow flex flex-col justify-center items-center text-center space-y-8"
          >
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
               <Search size={32} className="opacity-20" />
            </div>
            <div>
              <h4 className="text-xl font-black mb-2 uppercase italic tracking-tighter">Where is your booth?</h4>
              <p className="text-sm opacity-50 max-w-[200px] mx-auto leading-relaxed">
                Enter your details or use GPS to locate your assigned polling station.
              </p>
            </div>
            <button 
              onClick={() => setView('search-options')}
              className="w-full py-4 bg-brand-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-glow hover:scale-[1.02] transition-all"
            >
              START SEARCH
            </button>
          </motion.div>
        )}

        {/* Search Options */}
        {view === 'search-options' && (
          <motion.div 
            key="options"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-grow flex flex-col justify-center space-y-4"
          >
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-bold text-red-400 uppercase tracking-widest text-center mb-2">
                {error}
              </div>
            )}
            <button 
              onClick={handleLiveLocation}
              className="w-full p-6 bg-white/5 border border-white/5 hover:border-brand-primary/50 rounded-2xl flex items-center gap-4 group transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                <Locate size={24} />
              </div>
              <div className="text-left">
                <p className="font-black uppercase tracking-tight">Use Live Location</p>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Recommended (using GPS)</p>
              </div>
            </button>
            <button 
              onClick={() => setView('manual-form')}
              className="w-full p-6 bg-white/5 border border-white/5 hover:border-brand-primary/50 rounded-2xl flex items-center gap-4 group transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white/40 group-hover:scale-110 transition-transform">
                <Search size={24} />
              </div>
              <div className="text-left">
                <p className="font-black uppercase tracking-tight">Select Manually</p>
                <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">District, Place & Ward</p>
              </div>
            </button>
          </motion.div>
        )}

        {/* Locating Spinner */}
        {view === 'locating' && (
          <motion.div 
            key="locating"
            className="flex-grow flex flex-col items-center justify-center space-y-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-brand-primary/20 blur-xl rounded-full animate-pulse" />
              <Loader2 size={48} className="animate-spin text-brand-primary relative" />
            </div>
            <div className="text-center">
              <h4 className="text-lg font-black uppercase tracking-tighter italic">Locating your booth...</h4>
              <p className="text-[10px] font-bold opacity-40 uppercase tracking-[0.2em] animate-pulse">Requesting GPS Access</p>
            </div>
          </motion.div>
        )}

        {/* Manual Form */}
        {view === 'manual-form' && (
          <motion.div 
            key="form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-grow pt-4"
          >
            <BoothSearchForm onSelect={handleManualSelect} />
          </motion.div>
        )}

        {/* Result State */}
        {view === 'result' && booth && (
          <motion.div 
             key="result"
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="flex-grow flex flex-col"
          >
            <div className="bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 self-end mb-6">
              <p className="text-[10px] font-black text-green-500 uppercase">FOUND BOOTH</p>
            </div>

            <div className="flex-grow space-y-6">
              <div>
                 <h2 className="text-3xl font-black tracking-tighter leading-tight mb-2 uppercase break-words">{booth.name}</h2>
                 <p className="text-sm opacity-60 font-medium max-w-[280px]">
                   {booth.address}
                 </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Distance</p>
                    <p className="text-xl font-black">{booth.distance || "~ 0.5 KM"}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Travel Time</p>
                    <p className="text-xl font-black uppercase">{booth.travelTime || "3 MINS"}</p>
                 </div>
              </div>

              <div className="p-4 rounded-2xl bg-brand-secondary/5 border border-brand-secondary/10 flex items-center gap-3">
                  <ShieldCheck size={18} className="text-brand-secondary" />
                  <p className="text-[10px] font-black text-brand-secondary uppercase tracking-widest">Verified ECI Polling Center</p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5 grid grid-cols-2 gap-3">
               <button className="flex items-center justify-center gap-2 bg-white text-black px-4 py-4 rounded-2xl font-black text-xs hover:brightness-90 transition-all uppercase tracking-widest">
                  <Navigation size={14} /> DIRECTIONS
               </button>
               <button 
                  onClick={() => setView('search-options')}
                  className="flex items-center justify-center gap-2 glass px-4 py-4 rounded-2xl font-black text-xs hover:bg-white/5 transition-all uppercase tracking-widest"
               >
                  MAP VIEW <ExternalLink size={14} />
               </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
