"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

const steps = [
  {
    id: 1,
    title: "Identity Verification",
    description: "The first polling officer will check your name on the voter list and verify your ID document.",
    image: "/vote-verification.jpeg",
  },
  {
    id: 2,
    title: "Sign the Register",
    description: "The second polling officer will ink your finger, give you a slip, and take your signature on a register (Form 17A).",
    image: "/vote-signature.jpeg",
  },
  {
    id: 3,
    title: "Get Inked",
    description: "Indelible ink is applied to your finger to ensure each citizen votes only once.",
    image: "/vote-inkonfinger.jpeg",
  },
  {
    id: 4,
    title: "Deposit Slip",
    description: "You will deposit the slip at the third polling officer, show your inked finger, and then proceed to the EVM.",
    image: "/vote-getslip.jpeg",
  },
  {
    id: 5,
    title: "Cast Your Vote",
    description: "Record your vote by pressing the button opposite the symbol of your chosen candidate on the EVM. You will hear a beep.",
    image: "/cast-vote-1.jpeg",
  },
  {
    id: 6,
    title: "Verify VVPAT",
    description: "Check the slip in the VVPAT machine window. It will be visible for 7 seconds, showing the candidate's serial no., name, and symbol.",
    image: "/vote-verify-vvtp-slip.jpeg",
  },
  {
    id: 7,
    title: "Exit Booth",
    description: "Congratulations! You have successfully cast your vote and participated in democracy. You may now exit the booth.",
    image: "/exit-booth.jpeg",
  }
];

export default function VotingProcess() {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isComplete = currentStep === steps.length - 1;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black tracking-tighter mb-4">The Voting Process</h2>
        <p className="text-white/60">Follow these {steps.length} simple steps at the polling booth.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex justify-between items-center mb-8 px-4 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-white/10 z-0"></div>
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-primary z-0 transition-all duration-500 ease-in-out"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
        
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(index)}
            className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              index <= currentStep 
                ? 'bg-brand-primary text-white shadow-[0_0_15px_rgba(var(--brand-primary-rgb),0.5)]' 
                : 'bg-black border border-white/20 text-white/50'
            }`}
          >
            {index < currentStep ? <CheckCircle2 size={16} /> : step.id}
          </button>
        ))}
      </div>

      {/* Carousel Container */}
      <div className="relative bg-white/5 border border-white/10 rounded-[32px] overflow-hidden shadow-premium backdrop-blur-md">
        <div className="aspect-[4/3] md:aspect-[16/9] w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 flex flex-col md:flex-row"
            >
              {/* Image Side */}
              <div className="relative w-full h-1/2 md:w-1/2 md:h-full bg-black/50">
                <Image
                  src={steps[currentStep].image}
                  alt={steps[currentStep].title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/80" />
              </div>

              {/* Content Side */}
              <div className="w-full h-1/2 md:w-1/2 md:h-full p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-block px-3 py-1 bg-brand-primary/20 text-brand-primary rounded-full text-xs font-bold uppercase tracking-wider mb-4 w-max">
                  Step {steps[currentStep].id}
                </div>
                <h3 className="text-3xl md:text-4xl font-black tracking-tight mb-4 leading-tight">
                  {steps[currentStep].title}
                </h3>
                <p className="text-lg text-white/70 leading-relaxed mb-8">
                  {steps[currentStep].description}
                </p>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-4 mt-auto">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={nextStep}
                    disabled={isComplete}
                    className="flex-1 h-12 rounded-full bg-white text-black font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isComplete ? "Done" : "Next Step"}
                    {!isComplete && <ChevronRight size={20} />}
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
