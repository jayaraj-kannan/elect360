"use client";

import React, { useState } from 'react';
import { CheckCircle2, Circle, AlertCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const checklistItems = [
  { id: 'epic', text: 'Original Voter ID (EPIC Card)', subtext: 'Ensure name matches electoral roll', required: true },
  { id: 'aadhar', text: 'Aadhar Card (Alternative)', subtext: 'Valid if EPIC is not available', required: false },
  { id: 'slip', text: 'Voter Information Slip', subtext: 'Helps locate your Serial Number faster', required: false },
  { id: 'phone', text: 'Phone (Switch off at booth)', subtext: 'Phones are prohibited inside voting area', required: false },
  { id: 'location', text: 'Verified Polling Station', subtext: 'Confirmed via ECI Voter Search', required: true },
];

export default function VoterChecklist() {
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleItem = (id: string) => {
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const progress = Math.round((checkedItems.length / checklistItems.length) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="max-w-7xl mx-auto w-full px-4 mb-20"
    >
      <div className="glass rounded-[40px] border-white/10 overflow-hidden shadow-premium">
        {/* Header */}
        <div 
          className="p-8 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-glow">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight uppercase">POLL DAY ESSENTIALS</h2>
              <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Verify before you leave for the booth</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
               <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Status</p>
               <p className="font-black text-lg text-brand-primary">{progress}% READY</p>
            </div>
            {isExpanded ? <ChevronUp size={24} className="opacity-40" /> : <ChevronDown size={24} className="opacity-40" />}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-white/5 overflow-hidden">
           <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="h-full bg-brand-primary shadow-glow" 
           />
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-8 grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                   {checklistItems.map((item) => (
                     <button 
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={`w-full flex items-center gap-4 p-5 rounded-2xl border transition-all text-left ${
                        checkedItems.includes(item.id) 
                          ? 'bg-brand-primary/10 border-brand-primary/30' 
                          : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                     >
                       {checkedItems.includes(item.id) 
                        ? <CheckCircle2 className="text-brand-primary flex-shrink-0" size={24} /> 
                        : <Circle className="opacity-20 flex-shrink-0" size={24} />
                       }
                       <div>
                          <p className={`font-black tracking-tight ${checkedItems.includes(item.id) ? 'line-through opacity-40' : ''}`}>
                            {item.text}
                          </p>
                          <p className="text-xs font-medium opacity-50">{item.subtext}</p>
                       </div>
                     </button>
                   ))}
                </div>

                <div className="bg-white/5 rounded-3xl p-8 border border-white/5 flex flex-col justify-between">
                   <div>
                     <div className="flex items-center gap-3 mb-6">
                        <AlertCircle className="text-brand-secondary" />
                        <h3 className="font-black text-lg uppercase tracking-tight">IMPORTANT ADVISORY</h3>
                     </div>
                     <p className="text-sm font-medium leading-relaxed opacity-60 mb-6">
                       For Phase-1 elections in Tamil Nadu, strictly follow the COVID-safe protocols (where applicable) and respect the queue discipline. Avoid carrying publicity material or party symbols within 100 meters of the booth.
                     </p>
                     
                     <div className="space-y-4">
                       <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                          <Info size={16} className="text-blue-400 mt-0.5" />
                          <p className="text-xs font-bold leading-relaxed text-blue-400">
                             Use the &apos;Elee&apos; assistant for quick answers regarding your polling serial number or booth shifts.
                          </p>
                       </div>
                     </div>
                   </div>

                   <button className="w-full mt-8 py-4 bg-white text-black rounded-2xl font-black text-sm hover:brightness-90 transition-all uppercase tracking-widest shadow-2xl">
                     DOWNLOAD OFFLINE COPY
                   </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
