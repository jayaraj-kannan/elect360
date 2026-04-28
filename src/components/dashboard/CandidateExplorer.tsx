"use client";

import React, { useState, useEffect } from 'react';
import { Users, MapPin, Loader2, ChevronDown, ShieldAlert, TrendingUp, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDistrictsByState, getConstituenciesByDistrict } from '@/lib/boothService';
import { getCandidatesByConstituencyName, Candidate } from '@/lib/candidateService';

export default function CandidateExplorer() {
  const [districts, setDistricts] = useState<{id: string, name: string}[]>([]);
  const [constituencies, setConstituencies] = useState<{id: string, name: string}[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedConstituency, setSelectedConstituency] = useState('');
  const [selectedConstituencyName, setSelectedConstituencyName] = useState('');

  const [loading, setLoading] = useState({
    districts: true,
    constituencies: false,
    candidates: false
  });

  // Load districts on mount (Tamil Nadu default)
  useEffect(() => {
    async function loadDistricts() {
      try {
        const data = await getDistrictsByState('TN');
        setDistricts(data);
      } catch (err) {
        console.error('Failed to load districts', err);
      } finally {
        setLoading(prev => ({ ...prev, districts: false }));
      }
    }
    loadDistricts();
  }, []);

  // Load constituencies when district changes
  useEffect(() => {
    if (!selectedDistrict) {
      setConstituencies([]);
      return;
    }

    async function loadConstituencies() {
      setLoading(prev => ({ ...prev, constituencies: true }));
      try {
        const data = await getConstituenciesByDistrict(selectedDistrict);
        setConstituencies(data);
      } catch (err) {
        console.error('Failed to load constituencies', err);
      } finally {
        setLoading(prev => ({ ...prev, constituencies: false }));
      }
    }
    loadConstituencies();
  }, [selectedDistrict]);

  // Load candidates when constituency changes
  useEffect(() => {
    if (!selectedConstituencyName) {
      setCandidates([]);
      return;
    }

    async function loadCandidates() {
      setLoading(prev => ({ ...prev, candidates: true }));
      try {
        const data = await getCandidatesByConstituencyName(selectedConstituencyName);
        setCandidates(data);
      } catch (err) {
        console.error('Failed to load candidates', err);
      } finally {
        setLoading(prev => ({ ...prev, candidates: false }));
      }
    }
    loadCandidates();
  }, [selectedConstituencyName]);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    setSelectedDistrict(districtId);
    setSelectedConstituency('');
    setSelectedConstituencyName('');
    setCandidates([]);
  };

  const handleConstituencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const constId = e.target.value;
    setSelectedConstituency(constId);
    const found = constituencies.find(c => c.id === constId);
    setSelectedConstituencyName(found?.name || '');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-full">
          <Users size={16} className="text-purple-400" />
          <span className="text-xs font-black tracking-widest uppercase text-purple-400">Candidate Explorer</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase">
          Know Your <span className="text-purple-400 italic">Candidates</span>
        </h1>
        <p className="text-sm opacity-50 max-w-md mx-auto">
          Select your district and constituency to explore candidate profiles, assets, and criminal records.
        </p>
      </div>

      {/* Selection Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* District Dropdown */}
        <div className="space-y-2">
          <label htmlFor="explorer-district" className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1 flex items-center gap-2">
            <MapPin size={12} className="text-brand-primary" />
            District
          </label>
          <div className="relative group">
            <select
              id="explorer-district"
              value={selectedDistrict}
              onChange={handleDistrictChange}
              disabled={loading.districts}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 appearance-none font-bold text-sm focus:outline-none focus:border-brand-primary transition-colors group-hover:bg-white/10 disabled:opacity-50"
            >
              <option value="" className="bg-black">{loading.districts ? 'Loading...' : 'Select District'}</option>
              {districts.map(d => (
                <option key={d.id} value={d.id} className="bg-black">{d.name}</option>
              ))}
            </select>
            {loading.districts ? (
              <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-brand-primary" />
            ) : (
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>

        {/* Constituency Dropdown */}
        <div className="space-y-2">
          <label htmlFor="explorer-constituency" className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1 flex items-center gap-2">
            <Users size={12} className="text-purple-400" />
            Constituency
          </label>
          <div className="relative group">
            <select
              id="explorer-constituency"
              value={selectedConstituency}
              onChange={handleConstituencyChange}
              disabled={!selectedDistrict || loading.constituencies}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 appearance-none font-bold text-sm focus:outline-none focus:border-purple-500 transition-colors group-hover:bg-white/10 disabled:opacity-50"
            >
              <option value="" className="bg-black">
                {loading.constituencies ? 'Loading...' : !selectedDistrict ? 'Select a district first' : 'Select Constituency'}
              </option>
              {constituencies.map(c => (
                <option key={c.id} value={c.id} className="bg-black">{c.name}</option>
              ))}
            </select>
            {loading.constituencies ? (
              <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-purple-400" />
            ) : (
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      <AnimatePresence>
        {selectedConstituencyName && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black tracking-tight uppercase">{selectedConstituencyName}</h2>
                <p className="text-xs font-bold opacity-40 uppercase tracking-widest mt-1">
                  {selectedDistrict} District • {candidates.length} Candidates
                </p>
              </div>
            </div>

            {loading.candidates ? (
              <div className="flex flex-col items-center justify-center py-20 glass rounded-[32px] border-white/10">
                <Loader2 className="animate-spin text-purple-400 mb-4" size={40} />
                <p className="font-bold opacity-60 uppercase tracking-widest text-sm">Fetching candidate profiles...</p>
              </div>
            ) : candidates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {candidates.map((c, idx) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -4 }}
                    className="glass rounded-[32px] border-white/10 p-6 md:p-8 shadow-premium flex flex-col md:flex-row gap-6 overflow-hidden relative group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 group-hover:opacity-20 bg-purple-500 transition-opacity" />

                    <div className="flex-shrink-0 flex justify-center md:justify-start">
                      <div className="relative w-24 h-24 md:w-36 md:h-36 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:border-purple-500/50 transition-colors">
                        <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-1.5 text-center text-[10px] font-black tracking-widest text-white">
                          {c.party}
                        </div>
                      </div>
                    </div>

                    <div className="flex-grow space-y-3">
                      <div>
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {c.tags.map(t => (
                            <span key={t} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-wider text-white/60">
                              {t}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-xl font-black tracking-tight">{c.name}</h3>
                        <p className="text-xs font-bold text-purple-400 italic opacity-80">{selectedConstituencyName}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                        <div className="flex items-center gap-2">
                          <TrendingUp size={14} className="text-white/30" />
                          <div>
                            <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">Assets</p>
                            <p className="font-bold text-xs">{c.wealth}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldAlert size={14} className={c.criminalCases > 0 ? "text-red-400" : "text-green-400"} />
                          <div>
                            <p className="text-[9px] font-black opacity-40 uppercase tracking-widest">Cases</p>
                            <p className={`font-bold text-xs ${c.criminalCases > 0 ? "text-red-400" : "text-green-400"}`}>
                              {c.criminalCases === 0 ? "None" : `${c.criminalCases} Filed`}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1 opacity-50 hover:opacity-100 transition-opacity cursor-pointer">
                        <FileText size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Education: {c.education}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass rounded-[32px] border-white/10">
                <Users size={40} className="mx-auto mb-4 opacity-20" />
                <p className="font-bold opacity-40 uppercase tracking-widest text-sm italic">
                  No candidate data found for {selectedConstituencyName} yet.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
