"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Info, ChevronRight, Vote, Users, MapPin } from 'lucide-react';

interface IntroCardProps {
  onComplete: () => void;
}

export default function IntroCard({ onComplete }: IntroCardProps) {
  const features = [
    { icon: MapPin, title: "Find Booth", desc: "Instantly locate your assigned polling station via GPS." },
    { icon: Users, title: "Candidate Info", desc: "Transparent records, wealth, and criminal background checks." },
    { icon: Info, title: "Voter Guide", desc: "Step-by-step documentation and ID proof checklist." },
  ];

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-2xl rounded-[40px] border-white/10 shadow-premium overflow-hidden relative"
      >
        {/* Branding Banner */}
        <div className="gradient-tn p-12 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-md border border-white/20 shadow-xl">
               <Vote size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2">ENVOTE 2026</h1>
            <p className="text-xl font-bold opacity-80 italic">Your Voice, Digitally Empowered.</p>
          </div>
          {/* Decorative */}
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="p-8 md:p-12 space-y-8 bg-background/50">
          <div className="space-y-6">
            <h2 className="text-2xl font-black uppercase tracking-tight">About the Platform</h2>
            <p className="text-sm md:text-base font-medium opacity-60 leading-relaxed">
              enVote is South India's premium election assistant. We simplify democracy by providing real-time crowd data, location tracking, and deep candidate analytics in one secure, offline-capable PWA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="p-4 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <f.icon size={20} />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest mb-1">{f.title}</p>
                  <p className="text-[10px] opacity-50 font-bold leading-tight">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-[10px] font-black opacity-40 uppercase tracking-widest">
              <ShieldCheck size={14} className="text-green-500" />
              <span>ECI Data Integrated • Anonymous • Secure</span>
            </div>
            <button 
              onClick={onComplete}
              className="w-full md:w-auto bg-white text-black px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              GET STARTED <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
