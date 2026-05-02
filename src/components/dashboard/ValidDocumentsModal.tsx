"use client";

import React from 'react';
import { X, ShieldCheck, CreditCard, Fingerprint, Building2, FileText, Landmark, Heart, Briefcase, GraduationCap, BadgeCheck, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ValidDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VALID_DOCUMENTS = [
  { icon: CreditCard, name: "Aadhaar Card", issuer: "UIDAI", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: CreditCard, name: "PAN Card", issuer: "Income Tax Dept.", color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { icon: Fingerprint, name: "Voter ID (EPIC)", issuer: "Election Commission", color: "text-green-400", bg: "bg-green-500/10" },
  { icon: FileText, name: "Passport", issuer: "Ministry of External Affairs", color: "text-purple-400", bg: "bg-purple-500/10" },
  { icon: CreditCard, name: "Driving Licence", issuer: "State RTO", color: "text-orange-400", bg: "bg-orange-500/10" },
  { icon: Building2, name: "Service ID Card", issuer: "Govt. / PSU Employer", color: "text-cyan-400", bg: "bg-cyan-500/10" },
  { icon: GraduationCap, name: "Student ID Card", issuer: "University / College", color: "text-pink-400", bg: "bg-pink-500/10" },
  { icon: Briefcase, name: "MGNREGA Job Card", issuer: "Ministry of Rural Dev.", color: "text-amber-400", bg: "bg-amber-500/10" },
  { icon: Heart, name: "Health Insurance Card", issuer: "RSBY / Ayushman Bharat", color: "text-red-400", bg: "bg-red-500/10" },
  { icon: Landmark, name: "Bank / Post Office Passbook", issuer: "With Photo", color: "text-teal-400", bg: "bg-teal-500/10" },
  { icon: BadgeCheck, name: "Pension Document", issuer: "With Photograph", color: "text-indigo-400", bg: "bg-indigo-500/10" },
];

export default function ValidDocumentsModal({ isOpen, onClose }: ValidDocumentsModalProps) {
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="glass w-full max-w-2xl max-h-[85vh] rounded-[32px] border-white/10 shadow-premium overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="relative p-6 md:p-8 border-b border-white/5">
                <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl -mr-20 -mt-20" />
                
                <div className="flex items-start justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                      <ShieldCheck size={24} className="text-brand-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black tracking-tight uppercase">Valid Identity Documents</h2>
                      <p className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">
                        11 alternatives accepted by ECI
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Document List */}
              <div className="p-6 md:p-8 overflow-y-auto max-h-[55vh] custom-scrollbar space-y-3">
                {VALID_DOCUMENTS.map((doc, idx) => (
                  <motion.div
                    key={doc.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.06] transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-xl ${doc.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <doc.icon size={20} className={doc.color} />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-sm truncate">{doc.name}</p>
                      <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">{doc.issuer}</p>
                    </div>
                    <span className="text-[9px] font-black bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-full uppercase tracking-widest flex-shrink-0">
                      Valid
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 md:p-8 border-t border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-brand-secondary/5 border border-brand-secondary/10">
                  <MapPin size={16} className="text-brand-secondary flex-shrink-0" />
                  <p className="text-[10px] font-black text-brand-secondary/80 uppercase tracking-widest leading-relaxed">
                    Carry any ONE of the above documents to your polling station on election day. Original documents only — photocopies are not accepted.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
