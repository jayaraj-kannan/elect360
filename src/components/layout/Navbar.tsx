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
import UserMenu from './UserMenu';

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
              alt="enVote Logo" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-brand-primary/10 group-hover:bg-transparent transition-colors" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-black tracking-tighter leading-none text-foreground">VOTE<span className="text-brand-primary">GUIDE</span></h1>
            <p className="text-[9px] md:text-[10px] font-bold opacity-60 tracking-[0.2em] uppercase text-foreground">South India 2026</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-2">
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
              {states.map((state) => (
                <button
                  key={state.id}
                  onClick={() => setSelectedState(state.id)}
                  className={cn(
                    "px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                    selectedState === state.id 
                      ? "bg-white text-black shadow-premium" 
                      : "text-white/40 hover:text-white/100"
                  )}
                >
                  {state.id}
                </button>
              ))}
            </div>
            
            <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 ml-2">
              <button className="p-2 text-white/40 hover:text-white transition-colors">
                <Languages size={18} />
              </button>
            </div>
          </div>

          <ThemeToggle />
          <UserMenu />
          
          {/* Mobile Menu Toggle */}
          <button 
            data-testid="mobile-menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 rounded-2xl bg-white/5 border border-white/10 text-white"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
