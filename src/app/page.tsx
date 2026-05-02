"use client";

import React, { useState, useEffect } from 'react';
import { 
  MapPin, Users, ArrowLeft, Loader2, ChevronRight 
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import CountdownHero from "@/components/dashboard/CountdownHero";
import PollLocationCard from "@/components/dashboard/PollLocationCard";
import CandidateExplorer from "@/components/dashboard/CandidateExplorer";
import ValidDocumentsModal from "@/components/dashboard/ValidDocumentsModal";

type ViewState = 'home' | 'find-booth' | 'candidates';

export default function Home() {
  const [view, setView] = useState<ViewState>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);

  useEffect(() => {
    // Brief loading state for initial render
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {/* ──── HOME VIEW ──── */}
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-12 pb-20"
          >
            {/* Hero Banner + Countdown */}
            <CountdownHero 
              stateName="TAMIL NADU" 
              onGetReady={() => setView('find-booth')}
              onSeeCandidates={() => setView('candidates')}
            />

            {/* Quick Action Cards */}
            <section className="max-w-5xl mx-auto w-full px-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Find Your Booth Card */}
                <motion.button
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView('find-booth')}
                  className="glass p-8 rounded-[32px] border-white/10 shadow-premium text-left group transition-all hover:border-brand-primary/30"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
                      <MapPin size={28} />
                    </div>
                    <ChevronRight size={20} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-brand-primary" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight uppercase mb-2">Find Your Booth</h3>
                  <p className="text-sm opacity-50 leading-relaxed">
                    Locate your assigned polling station using GPS or manual selection by district.
                  </p>
                </motion.button>

                {/* See Candidates Card */}
                <motion.button
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setView('candidates')}
                  className="glass p-8 rounded-[32px] border-white/10 shadow-premium text-left group transition-all hover:border-purple-500/30"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                      <Users size={28} />
                    </div>
                    <ChevronRight size={20} className="opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-purple-400" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight uppercase mb-2">See Candidates</h3>
                  <p className="text-sm opacity-50 leading-relaxed">
                    Explore candidates by district and constituency. View assets, cases, and profiles.
                  </p>
                </motion.button>
              </div>
            </section>

            {/* Voter Rights Banner */}
            <section className="max-w-5xl mx-auto w-full px-4">
              <div className="relative overflow-hidden p-6 md:p-12 rounded-[40px] gradient-tn shadow-glow">
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left max-w-xl text-white">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">
                      Lost your Voter ID? You can still vote.
                    </h2>
                    <p className="text-lg font-bold opacity-80 leading-relaxed">
                      The Election Commission allows 11 alternative identity documents including Aadhar, PAN, and MGNREGA Job Card.
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowDocumentsModal(true)}
                    className="bg-white text-black px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-transform"
                  >
                    SEE VALID DOCUMENTS
                  </button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20" />
              </div>
            </section>
          </motion.div>
        )}

        {/* ──── FIND BOOTH VIEW ──── */}
        {view === 'find-booth' && (
          <motion.div
            key="find-booth"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen pb-20"
          >
            {/* Top Navigation Bar */}
            <div className="max-w-3xl mx-auto px-4 pt-6 mb-6">
              <button
                onClick={() => setView('home')}
                className="flex items-center gap-3 text-sm font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-primary/10 group-hover:border-brand-primary/20 transition-all">
                  <ArrowLeft size={18} />
                </div>
                Back to Home
              </button>
            </div>

            {/* Full-Width Booth Finder */}
            <div className="max-w-3xl mx-auto px-4">
              <PollLocationCard />
            </div>
          </motion.div>
        )}

        {/* ──── CANDIDATES VIEW ──── */}
        {view === 'candidates' && (
          <motion.div
            key="candidates"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen pb-20"
          >
            {/* Top Navigation Bar */}
            <div className="max-w-7xl mx-auto px-4 pt-6 mb-6">
              <button
                onClick={() => setView('home')}
                className="flex items-center gap-3 text-sm font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-purple-500/10 group-hover:border-purple-500/20 transition-all">
                  <ArrowLeft size={18} />
                </div>
                Back to Home
              </button>
            </div>

            {/* Candidate Explorer */}
            <CandidateExplorer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Valid Documents Modal */}
      <ValidDocumentsModal 
        isOpen={showDocumentsModal} 
        onClose={() => setShowDocumentsModal(false)} 
      />
    </div>
  );
}
