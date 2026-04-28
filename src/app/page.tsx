"use client";

import React, { useState, useEffect } from 'react';
import CountdownHero from "@/components/dashboard/CountdownHero";
import PollStatusCard from "@/components/dashboard/PollStatusCard";
import PollLocationCard from "@/components/dashboard/PollLocationCard";
import VoterChecklist from "@/components/dashboard/VoterChecklist";
import CandidateShowcase from "@/components/dashboard/CandidateShowcase";
import IntroCard from "@/components/onboarding/IntroCard";
import OnboardingLocator from "@/components/onboarding/OnboardingLocator";
import { Ward } from "@/data/electionData";
import { MessageSquare, CheckSquare, Users, MapPin, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type FlowState = 'loading' | 'intro' | 'onboarding' | 'dashboard';

export default function Home() {
  const [flowState, setFlowState] = useState<FlowState>('loading');
  const [selectedBooth, setSelectedBooth] = useState<Ward | null>(null);

  useEffect(() => {
    const savedBooth = localStorage.getItem('voteguide_selected_booth');
    if (savedBooth) {
      const ward = JSON.parse(savedBooth);
      setSelectedBooth(ward);
      setFlowState('dashboard');
      updateBranding(ward.stateId);
    } else {
      setFlowState('intro');
    }
  }, []);

  const updateBranding = (stateId: string) => {
    const root = document.documentElement;
    if (stateId === 'KA') {
      root.style.setProperty('--brand-primary', '#FF0000');
      root.style.setProperty('--brand-secondary', '#FFFF00');
      root.style.setProperty('--brand-primary-alpha', 'rgba(255, 0, 0, 0.4)');
    } else {
      // Default to TN colors
      root.style.setProperty('--brand-primary', '#D2042D');
      root.style.setProperty('--brand-secondary', '#FFB800');
      root.style.setProperty('--brand-primary-alpha', 'rgba(210, 4, 45, 0.4)');
    }
  };

  const handleOnboardingComplete = (ward: Ward) => {
    localStorage.setItem('voteguide_selected_booth', JSON.stringify(ward));
    setSelectedBooth(ward);
    setFlowState('dashboard');
    updateBranding(ward.stateId);
  };

  const getStateName = () => {
    if (selectedBooth?.stateId === 'KA') return "KARNATAKA";
    return "TAMIL NADU";
  };

  if (flowState === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
      </div>
    );
  }

  const gradientClass = selectedBooth?.stateId === 'KA' ? 'gradient-ka' : 'gradient-tn';

  return (
    <AnimatePresence mode="wait">
      {flowState === 'intro' && (
        <motion.div 
          key="intro"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <IntroCard onComplete={() => setFlowState('onboarding')} />
        </motion.div>
      )}

      {flowState === 'onboarding' && (
        <motion.div 
          key="onboarding"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.5 }}
        >
          <OnboardingLocator onComplete={handleOnboardingComplete} />
        </motion.div>
      )}

      {flowState === 'dashboard' && (
        <motion.div 
          key="dashboard"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col gap-16 pb-20"
        >
          {/* Hero Section */}
          <CountdownHero stateName={getStateName()} />

          {/* Main Grid */}
          <section className="max-w-7xl mx-auto w-full px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 -mt-10 md:-mt-20 relative z-20">
            <PollStatusCard />
            <PollLocationCard />
          </section>

          {/* Checklist Section */}
          <VoterChecklist />

          {/* Candidate Section */}
          <CandidateShowcase 
            constituencyId={selectedBooth?.constituencyId} 
            constituencyName={selectedBooth?.constituencyName} 
          />

          {/* Quick Action Tabs */}
          <section className="max-w-7xl mx-auto w-full px-4 overflow-hidden">
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 bg-foreground/5 p-4 rounded-[40px] border border-foreground/5">
               {[
                 { icon: MessageSquare, label: "Ask Assistant", color: "text-blue-400" },
                 { icon: CheckSquare, label: "Poll Essentials", color: "text-green-400" },
                 { icon: Users, label: "Candidate Profiles", color: "text-purple-400" },
                 { icon: MapPin, label: "Change Location", color: "text-orange-400" },
               ].map((item, idx) => (
                 <button 
                  key={idx} 
                  onClick={() => {
                    if (item.label === "Change Location") {
                      localStorage.removeItem('voteguide_selected_booth');
                      setFlowState('onboarding');
                    }
                  }}
                  className="flex items-center gap-3 px-6 py-4 rounded-3xl hover:bg-foreground/5 transition-all group"
                >
                    <item.icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
                    <span className="text-sm font-black tracking-tight">{item.label}</span>
                 </button>
               ))}
            </div>
          </section>

          {/* Voter Rights Banner */}
          <section className="max-w-7xl mx-auto w-full px-4 mt-8">
            <div className={`relative overflow-hidden p-6 md:p-12 rounded-[40px] ${gradientClass} shadow-glow`}>
               <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-center md:text-left max-w-xl text-white">
                     <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4">
                       Lost your Voter ID? You can still vote.
                     </h2>
                     <p className="text-lg font-bold opacity-80 leading-relaxed">
                       The Election Commission allows 11 alternative identity documents including Aadhar, PAN, and MGNREGA Job Card.
                     </p>
                  </div>
                  <button className="bg-white text-black px-10 py-5 rounded-2xl font-black text-lg shadow-2xl hover:scale-105 transition-transform">
                    SEE VALID DOCUMENTS
                  </button>
               </div>
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20" />
            </div>
          </section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
