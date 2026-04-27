import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-black/40 border-t border-white/5 pt-16 pb-8 px-4 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 mb-16">
        <div className="max-w-xs">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 gradient-tn rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm italic">V</span>
            </div>
            <h2 className="text-lg font-black tracking-tighter">VOTE<span className="text-brand-primary">GUIDE</span></h2>
          </div>
          <p className="text-sm opacity-60 leading-relaxed">
            Leading the way in civic technology for South India. Your unofficial, interactive companion for the 2026 Elections.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-12">
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-6 opacity-40">Resources</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="hover:text-brand-primary transition-colors cursor-pointer">Find My Booth</li>
              <li className="hover:text-brand-primary transition-colors cursor-pointer">Candidate Affidavits</li>
              <li className="hover:text-brand-primary transition-colors cursor-pointer">Voter ID Guide</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-6 opacity-40">State Portals</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="hover:text-brand-primary transition-colors cursor-pointer">CEO Tamil Nadu</li>
              <li className="hover:text-brand-primary transition-colors cursor-pointer">CEO Kerala</li>
              <li className="hover:text-brand-primary transition-colors cursor-pointer">CEO Karnataka</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase tracking-widest mb-6 opacity-40">Official</h3>
            <ul className="space-y-4 text-sm font-medium">
              <li className="hover:text-brand-primary transition-colors cursor-pointer">ECI Helpline</li>
              <li className="hover:text-brand-primary transition-colors cursor-pointer">National Voter Portal</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-widest font-bold opacity-40">
        <p>&copy; 2026 VoteGuide South India Team</p>
        <p>Built with ❤️ for a stronger democracy</p>
      </div>
    </footer>
  );
}
