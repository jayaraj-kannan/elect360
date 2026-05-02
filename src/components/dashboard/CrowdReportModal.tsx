"use client";

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CrowdReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CrowdReportModal({ isOpen, onClose }: CrowdReportModalProps) {
  const [level, setLevel] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    if (level === null) return;
    setIsSubmitting(true);
    
    // Simulate Firebase/PubSub write
    await new Promise(r => setTimeout(r, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    setTimeout(() => {
      onClose();
      setIsSuccess(false);
      setLevel(null);
    }, 2000);
  };

  const levels = [
    { value: 20, label: 'LOW', desc: 'No queue, direct entry', color: 'bg-green-500' },
    { value: 50, label: 'MEDIUM', desc: '15-30 min wait time', color: 'bg-yellow-500' },
    { value: 85, label: 'HIGH', desc: '1+ hour wait time', color: 'bg-red-500' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg glass rounded-[40px] border-white/10 shadow-premium overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-black tracking-tight uppercase">Report Crowd Level</h2>
                <p className="text-xs font-bold opacity-60 uppercase tracking-widest mt-1">Help fellow voters choose the best time</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {!isSuccess ? (
                <>
                  <div className="grid grid-cols-1 gap-4">
                    {levels.map((l) => (
                      <button
                        key={l.value}
                        onClick={() => setLevel(l.value)}
                        className={`p-6 rounded-3xl border transition-all text-left flex items-center justify-between group ${
                          level === l.value 
                            ? 'bg-white/10 border-white/20' 
                            : 'bg-white/5 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${l.color} shadow-glow`} />
                          <div>
                            <p className="font-black text-lg tracking-tight">{l.label}</p>
                            <p className="text-xs font-medium opacity-50">{l.desc}</p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                          level === l.value ? 'bg-white border-white' : 'border-white/20'
                        }`}>
                          {level === l.value && <div className="w-2 h-2 bg-black rounded-full" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="bg-brand-secondary/10 p-4 rounded-2xl border border-brand-secondary/20 flex gap-3">
                    <AlertTriangle size={20} className="text-brand-secondary flex-shrink-0" />
                    <p className="text-xs font-bold text-brand-secondary leading-relaxed uppercase">
                      Your report will be anonymous and aggregated to protect privacy.
                    </p>
                  </div>

                  <button 
                    disabled={level === null || isSubmitting}
                    onClick={handleSubmit}
                    className={`w-full py-5 rounded-2xl font-black text-sm transition-all uppercase tracking-widest shadow-2lg ${
                      level === null || isSubmitting
                        ? 'bg-white/10 text-white/20 cursor-not-allowed'
                        : 'bg-white text-black hover:scale-[1.02] active:scale-95'
                    }`}
                  >
                    {isSubmitting ? 'SUBMITTING...' : 'SUBMIT REPORT'}
                  </button>
                </>
              ) : (
                <div className="py-12 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight mb-2 uppercase">Thank You, Citizen!</h3>
                  <p className="text-sm font-medium opacity-60 max-w-[280px]">
                    Your report helps millions of voters avoid long queues. Together we make democracy better.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
