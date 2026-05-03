"use client";

import React from 'react';
import { X, ShieldAlert, TrendingUp, FileText, Briefcase, Calendar, MapPin, BadgeCheck, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Candidate } from '@/lib/candidateService';

interface CandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: Candidate | null;
}

export default function CandidateModal({ isOpen, onClose, candidate }: CandidateModalProps) {
  if (!candidate) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 pointer-events-none"
          >
            <div className="glass w-full max-w-3xl max-h-[90vh] rounded-[40px] border-white/10 shadow-premium overflow-hidden pointer-events-auto flex flex-col">
              
              {/* Header Profile Section */}
              <div className="relative p-6 md:p-10 border-b border-white/5 flex-shrink-0">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
                
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 z-20 w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>

                <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-8 items-start md:items-center">
                  <div className="relative w-28 h-28 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-white/10 flex-shrink-0 bg-white/5">
                    {candidate.image ? (
                      <img src={candidate.image} alt={candidate.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl font-black opacity-30">{candidate.name.charAt(0)}</span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md p-2 text-center text-xs font-black tracking-widest text-brand-primary">
                      {candidate.party}
                    </div>
                  </div>

                  <div className="flex-grow">
                    <div className="flex flex-wrap gap-2 mb-3">
                      {candidate.tags.map(t => (
                        <span key={t} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-wider text-white/80">
                          {t}
                        </span>
                      ))}
                      {candidate.tags.length === 0 && (
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-wider text-white/40">
                          Candidate
                        </span>
                      )}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight">{candidate.name}</h2>
                    <div className="flex items-center gap-2 mt-2">
                      <MapPin size={16} className="text-brand-primary" />
                      <p className="text-sm font-bold opacity-60 uppercase tracking-widest">
                        Constituency {candidate.constituencyId}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scrollable Details */}
              <div className="p-6 md:p-10 overflow-y-auto custom-scrollbar flex-grow space-y-8">
                
                {/* Financial & Legal Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Assets */}
                  <div className="glass p-6 rounded-3xl border-white/5 flex items-start gap-4 hover:border-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center flex-shrink-0 border border-green-500/20">
                      <TrendingUp size={24} className="text-green-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Total Assets</p>
                      <p className="text-xl font-black text-green-400">{candidate.wealth}</p>
                    </div>
                  </div>

                  {/* Liabilities */}
                  <div className="glass p-6 rounded-3xl border-white/5 flex items-start gap-4 hover:border-white/10 transition-colors">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center flex-shrink-0 border border-orange-500/20">
                      <Scale size={24} className="text-orange-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Liabilities</p>
                      <p className="text-xl font-black text-orange-400">{candidate.liabilities || "N/A"}</p>
                    </div>
                  </div>

                  {/* Criminal Records */}
                  <div className="glass p-6 rounded-3xl border-white/5 flex items-start gap-4 md:col-span-2 hover:border-white/10 transition-colors">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 border ${candidate.criminalCases > 0 ? "bg-red-500/10 border-red-500/20" : "bg-teal-500/10 border-teal-500/20"}`}>
                      <ShieldAlert size={24} className={candidate.criminalCases > 0 ? "text-red-400" : "text-teal-400"} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-1">Criminal Background</p>
                      <p className={`text-xl font-black ${candidate.criminalCases > 0 ? "text-red-400" : "text-teal-400"}`}>
                        {candidate.criminalCases === 0 ? "Clean Record" : `${candidate.criminalCases} Pending Cases`}
                      </p>
                      {candidate.criminalCases > 0 && (
                        <p className="text-xs font-bold opacity-50 mt-1">Details on cases are available in the official affidavit.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Personal & Professional Details */}
                <div>
                  <h3 className="text-sm font-black tracking-widest uppercase opacity-40 mb-4 ml-1">Background Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass p-5 rounded-2xl border-white/5 space-y-1">
                      <div className="flex items-center gap-2 opacity-50 mb-2">
                        <FileText size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Education</span>
                      </div>
                      <p className="font-bold text-sm">{candidate.education}</p>
                    </div>
                    
                    <div className="glass p-5 rounded-2xl border-white/5 space-y-1">
                      <div className="flex items-center gap-2 opacity-50 mb-2">
                        <Briefcase size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Profession</span>
                      </div>
                      <p className="font-bold text-sm">{candidate.profession || "N/A"}</p>
                    </div>

                    <div className="glass p-5 rounded-2xl border-white/5 space-y-1">
                      <div className="flex items-center gap-2 opacity-50 mb-2">
                        <Calendar size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Age</span>
                      </div>
                      <p className="font-bold text-sm">{candidate.age ? `${candidate.age} Years` : "N/A"}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <BadgeCheck size={20} className="text-brand-primary" />
                  <p className="text-[10px] font-black opacity-60 uppercase tracking-widest">Verified by ECI Data</p>
                </div>
                <button className="bg-brand-primary text-black font-black text-xs uppercase tracking-widest px-6 py-3 rounded-2xl hover:scale-105 transition-transform">
                  Download Manifesto
                </button>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
