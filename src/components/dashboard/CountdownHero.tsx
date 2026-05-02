"use client";

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface CountdownHeroProps {
  stateName: string;
  onGetReady?: () => void;
  onSeeCandidates?: () => void;
}

export default function CountdownHero({ stateName, onGetReady, onSeeCandidates }: CountdownHeroProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 14, minutes: 22, seconds: 54 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden pt-8 pb-20 px-4">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full -z-10 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-brand-primary rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-secondary rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-brand-primary/10 border border-brand-primary/20 px-4 py-2 rounded-full mb-8">
            <ShieldCheck size={16} className="text-brand-primary" />
            <span className="text-xs font-black tracking-widest uppercase text-brand-primary">Official 2026 Election Tracker</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[1.1] mb-8">
            <span data-testid="state-name">{stateName}</span><br />
            <span className="text-brand-primary italic">ASSEMBLY </span> 
            VOTES
          </h1>

          <p className="text-xl opacity-60 leading-relaxed mb-10 max-w-lg">
            Your voice is your power. Prepare for the upcoming assembly elections in {stateName}. Check your booth, verify documents, and vote responsibly.
          </p>

          <div className="flex flex-wrap gap-4">
            <button 
              onClick={onGetReady}
              className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-black text-lg shadow-glow hover:-translate-y-1 transition-all group"
            >
              <span className="flex items-center gap-3">
                GET READY <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </span>
            </button>
            <button 
              onClick={onSeeCandidates}
              className="glass px-8 py-4 rounded-2xl font-black text-lg hover:bg-white/10 transition-all"
            >
              SEE CANDIDATES
            </button>
          </div>
        </motion.div>

        {/* Countdown Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative lg:justify-self-end"
        >
          <div className="glass p-6 md:p-10 rounded-[40px] shadow-premium relative z-10 border-white/20">
            <div className="flex justify-between items-center mb-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                  <Calendar className="text-brand-primary" />
                </div>
                <div>
                  <p className="text-[10px] font-black opacity-40 tracking-widest uppercase">Election Date</p>
                  <p className="font-black text-lg">APRIL 23, 2026</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-black opacity-40 tracking-widest uppercase">Phase</p>
                <div className="bg-white/5 px-3 py-1 rounded-full border border-white/10 mt-1">
                  <p className="font-bold text-xs">SINGLE PHASE</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3 md:gap-6 mb-10">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hrs', value: timeLeft.hours },
                { label: 'Min', value: timeLeft.minutes },
                { label: 'Sec', value: timeLeft.seconds },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-4xl md:text-5xl font-black tracking-tighter mb-1 tabular-nums">{item.value.toString().padStart(2, '0')}</p>
                  <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">{item.label}</p>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-3xl bg-brand-primary/5 border border-brand-primary/10 flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center">
                 <Clock size={20} className="text-brand-primary" />
               </div>
               <div>
                  <p className="text-sm font-bold">Polls open in 48 hours</p>
                  <p className="text-xs opacity-50 font-medium">Standard Hours: 07:00 AM – 06:00 PM</p>
               </div>
            </div>
          </div>

          {/* Decorative Rings */}
          <div className="absolute -top-10 -right-10 w-40 h-40 border-[20px] border-brand-primary/10 rounded-full -z-0" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-brand-secondary/20 rounded-full blur-2xl -z-0" />
        </motion.div>
      </div>
    </section>
  );
}
