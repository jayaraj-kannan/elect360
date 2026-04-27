"use client";

import React, { useState, useEffect } from 'react';
import { Languages, Menu, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const states = [
  { id: 'TN', name: 'Tamil Nadu', native: 'தமிழ்நாடு', color: 'border-tn-gold' },
  { id: 'KL', name: 'Kerala', native: 'കേരളം', color: 'border-kl-green' },
  { id: 'KA', name: 'Karnataka', native: 'ಕರ್ನಾಟಕ', color: 'border-ka-red' },
  { id: 'AP', name: 'Andhra Pradesh', native: 'ఆంధ్రప్రదేశ్', color: 'border-ap-teal' },
];

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'ml', name: 'മലയാളം' },
  { code: 'kn', name: 'ಕನ್ನಡ' },
  { code: 'te', name: 'తెలుగు' },
];

import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedState, setSelectedState] = useState('TN');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-3",
        isScrolled ? "bg-background/80 backdrop-blur-md shadow-premium border-b border-white/10" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden rounded-2xl shadow-glow transform group-hover:scale-105 transition-all duration-500">
            <img 
              src="/logo.png" 
              alt="VoteGuide Logo" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-brand-primary/10 group-hover:bg-transparent transition-colors" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tighter leading-none text-foreground">VOTE<span className="text-brand-primary">GUIDE</span></h1>
            <p className="text-[9px] md:text-[10px] font-bold opacity-60 tracking-[0.2em] uppercase text-foreground">South India 2026</p>
          </div>
        </div>

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center gap-6">
          {/* State Selector */}
          <div className="flex items-center gap-2 bg-foreground/5 p-1 rounded-full border border-foreground/10">
            {states.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedState(s.id)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold transition-all",
                  selectedState === s.id 
                    ? "bg-foreground text-background shadow-lg" 
                    : "hover:bg-foreground/10 opacity-70 hover:opacity-100"
                )}
              >
                {s.id}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-foreground/10" />

          {/* Language Selector */}
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-foreground/5 transition-colors group">
            <Languages size={18} className="group-hover:rotate-12 transition-transform text-foreground" />
            <span className="text-sm font-semibold text-foreground">தமிழ்</span>
          </button>

          <ThemeToggle />

          <button className="bg-brand-primary text-white px-6 py-2 rounded-xl font-bold text-sm shadow-glow hover:brightness-110 transition-all active:scale-95">
            FIND BOOTH
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button className="text-foreground" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/10 p-4 animate-in slide-in-from-top duration-300">
             <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-2">
                    {states.map((s) => (
                        <button 
                            key={s.id} 
                            className={cn(
                                "p-3 rounded-xl border text-left transition-all",
                                selectedState === s.id ? "border-brand-primary bg-brand-primary/10" : "border-white/10"
                            )}
                            onClick={() => { setSelectedState(s.id); setIsMenuOpen(false); }}
                        >
                            <p className="text-xs font-bold opacity-60">{s.id}</p>
                            <p className="font-bold">{s.name}</p>
                        </button>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                    {languages.map(l => (
                        <button key={l.code} className="px-3 py-1 rounded-md bg-white/5 text-sm font-medium">
                            {l.name}
                        </button>
                    ))}
                </div>
             </div>
        </div>
      )}
    </nav>
  );
}
