"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { LogIn, LogOut, User as UserIcon, ChevronDown, Shield, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UserMenu() {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-white/5 animate-pulse border border-white/10" />
    );
  }

  if (!user) {
    return (
      <button 
        onClick={signInWithGoogle}
        className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-brand-primary text-white font-black text-xs uppercase tracking-widest shadow-glow hover:scale-105 active:scale-95 transition-all"
      >
        <LogIn size={14} />
        <span>Sign In</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pr-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group"
      >
        <div className="w-8 h-8 rounded-xl overflow-hidden border border-white/10 shadow-premium">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-brand-primary flex items-center justify-center text-white">
              <UserIcon size={14} />
            </div>
          )}
        </div>
        <ChevronDown size={14} className={`opacity-40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-64 glass rounded-3xl border-white/10 shadow-premium overflow-hidden z-50 origin-top-right"
            >
              <div className="p-5 border-b border-white/10 bg-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">Authenticated Account</p>
                <p className="font-bold text-sm truncate">{user.displayName || user.email}</p>
                <p className="text-[10px] opacity-40 truncate">{user.email}</p>
              </div>

              <div className="p-2">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 text-sm font-medium transition-colors group">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                    <Shield size={16} />
                  </div>
                  <span>Voter Dashboard</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 text-sm font-medium transition-colors group">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                    <Bell size={16} />
                  </div>
                  <span>Notifications</span>
                </button>
                <div className="my-2 border-t border-white/5" />
                <button 
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-red-500/10 text-red-500 text-sm font-bold transition-colors group"
                >
                  <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LogOut size={16} />
                  </div>
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
