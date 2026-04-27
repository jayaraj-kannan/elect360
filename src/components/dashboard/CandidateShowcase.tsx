"use client";

import React from 'react';
import { User, ShieldAlert, TrendingUp, FileText, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const candidates = [
  {
    id: 1,
    name: "Dr. Anbu Selvan",
    party: "DMK",
    constituency: "Mylapore",
    education: "Post Graduate",
    wealth: "₹12.4 Cr",
    criminalCases: 0,
    tags: ["Incumbent", "Education Focus"],
    image: "https://images.unsplash.com/photo-1540562514872-552763702958?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: 2,
    name: "K. Karunakaran",
    party: "AIADMK",
    constituency: "Mylapore",
    education: "Graduate",
    wealth: "₹8.2 Cr",
    criminalCases: 2,
    tags: ["Former MLA", "Infrastructure"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200",
  },
];

export default function CandidateShowcase() {
  return (
    <section className="max-w-7xl mx-auto w-full px-4 mb-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black tracking-tight uppercase">Constituency Candidates</h2>
          <p className="text-sm font-bold opacity-60 uppercase tracking-widest mt-1">Mylapore - Phase 1</p>
        </div>
        <button className="flex items-center gap-2 text-brand-primary font-black text-sm hover:translate-x-1 transition-transform">
          VIEW ALL 18 CANDIDATES <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {candidates.map((c) => (
          <motion.div 
            key={c.id}
            whileHover={{ y: -5 }}
            className="glass rounded-[40px] border-white/10 p-6 md:p-8 shadow-premium flex flex-col md:flex-row gap-6 md:gap-8 overflow-hidden relative group"
          >
            {/* Background Decorative */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${c.party === 'DMK' ? 'bg-red-500' : 'bg-green-500'}`} />

            <div className="flex-shrink-0 flex justify-center md:justify-start">
               <div className="relative w-28 h-28 md:w-40 md:h-40 rounded-3xl overflow-hidden border-2 border-white/10 group-hover:border-brand-primary/50 transition-colors">
                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 text-center text-[10px] font-black tracking-widest text-white">
                    {c.party}
                  </div>
               </div>
            </div>

            <div className="flex-grow space-y-4">
               <div>
                  <div className="flex flex-wrap gap-2 mb-3">
                     {c.tags.map(t => (
                       <span key={t} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-wider text-white/60">
                         {t}
                       </span>
                     ))}
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">{c.name}</h3>
                  <p className="text-sm font-bold text-brand-primary italic opacity-80">{c.constituency}</p>
               </div>

               <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                     <TrendingUp size={16} className="text-white/40" />
                     <div>
                        <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Assets</p>
                        <p className="font-bold text-sm">{c.wealth}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3">
                     <ShieldAlert size={16} className={c.criminalCases > 0 ? "text-red-400" : "text-green-400"} />
                     <div>
                        <p className="text-[10px] font-black opacity-40 uppercase tracking-widest">Cases</p>
                        <p className={`font-bold text-sm ${c.criminalCases > 0 ? "text-red-400" : "text-green-400"}`}>
                          {c.criminalCases === 0 ? "None" : `${c.criminalCases} Filed`}
                        </p>
                     </div>
                  </div>
               </div>

               <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <FileText size={16} className="text-white/40" />
                     <span className="text-xs font-bold opacity-60">View Manifesto</span>
                  </div>
                  <button className="bg-white/5 hover:bg-brand-primary p-2 rounded-xl transition-all group-hover:scale-110">
                    <ChevronRight size={20} className="text-white" />
                  </button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
