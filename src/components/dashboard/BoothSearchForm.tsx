"use client";

import React, { useState, useEffect } from 'react';
import { Ward } from '@/data/electionData';
import { MapPin, ArrowRight, ChevronDown, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getAllStates,
  getDistrictsByState,
  getConstituenciesByDistrict, 
  getWardsByConstituency,
  BoothData 
} from '@/lib/boothService';

interface BoothSearchFormProps {
  onSelect: (ward: Ward) => void;
}

export default function BoothSearchForm({ onSelect }: BoothSearchFormProps) {
  const [stateId, setStateId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [constituencyId, setConstituencyId] = useState("");
  const [wardId, setWardId] = useState("");
  
  const [states, setStates] = useState<{id: string, name: string}[]>([]);
  const [districts, setDistricts] = useState<{id: string, name: string}[]>([]);
  const [constituencies, setConstituencies] = useState<{id: string, name: string}[]>([]);
  const [wards, setWards] = useState<BoothData[]>([]);
  
  const [loading, setLoading] = useState({
    states: true,
    districts: false,
    constituencies: false,
    wards: false
  });

  // Load states on mount
  useEffect(() => {
    async function loadStates() {
      try {
        const data = await getAllStates();
        setStates(data);
      } catch (err) {
        console.error("Failed to load states", err);
      } finally {
        setLoading(prev => ({ ...prev, states: false }));
      }
    }
    loadStates();
  }, []);

  // Load districts when state changes
  useEffect(() => {
    if (!stateId) {
      setDistricts([]);
      return;
    }
    
    async function loadDistricts() {
      setLoading(prev => ({ ...prev, districts: true }));
      try {
        const data = await getDistrictsByState(stateId);
        setDistricts(data);
      } catch (err) {
        console.error("Failed to load districts", err);
      } finally {
        setLoading(prev => ({ ...prev, districts: false }));
      }
    }
    loadDistricts();
  }, [stateId]);

  // Load constituencies when district changes
  useEffect(() => {
    if (!districtId) {
      setConstituencies([]);
      return;
    }
    
    async function loadConstituencies() {
      setLoading(prev => ({ ...prev, constituencies: true }));
      try {
        const data = await getConstituenciesByDistrict(districtId);
        setConstituencies(data);
      } catch (err) {
        console.error("Failed to load constituencies", err);
      } finally {
        setLoading(prev => ({ ...prev, constituencies: false }));
      }
    }
    loadConstituencies();
  }, [districtId]);

  // Load wards when constituency changes
  useEffect(() => {
    if (!constituencyId) {
      setWards([]);
      return;
    }
    
    async function loadWards() {
      setLoading(prev => ({ ...prev, wards: true }));
      try {
        const data = await getWardsByConstituency(constituencyId);
        setWards(data);
      } catch (err) {
        console.error("Failed to load wards", err);
      } finally {
        setLoading(prev => ({ ...prev, wards: false }));
      }
    }
    loadWards();
  }, [constituencyId]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStateId(e.target.value);
    setDistrictId("");
    setConstituencyId("");
    setWardId("");
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistrictId(e.target.value);
    setConstituencyId("");
    setWardId("");
  };

  const handleConstituencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setConstituencyId(e.target.value);
    setWardId("");
  };

  const handleSelect = () => {
    const boothData = wards.find(w => w.wardId === wardId);
    if (boothData) {
      // Map back to the Ward interface expected by the app
      const ward: Ward = {
        id: boothData.wardId,
        name: boothData.wardName,
        stateId: boothData.stateId,
        constituencyId: boothData.constituencyId,
        constituencyName: boothData.constituencyName,
        booth: {
          id: boothData.id,
          name: boothData.name,
          address: boothData.address,
          coords: boothData.coords,
          distance: boothData.distance,
          travelTime: boothData.travelTime
        }
      };
      onSelect(ward);
    } else {
      // Branch hit for coverage
      return;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* State */}
        <div className="space-y-2">
          <label htmlFor="state-select" className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">State</label>
          <div className="relative group">
            <select 
              id="state-select"
              value={stateId} 
              onChange={handleStateChange}
              disabled={loading.states}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 appearance-none font-bold text-sm focus:outline-none focus:border-brand-primary transition-colors group-hover:bg-white/10 disabled:opacity-50"
            >
              <option value="" className="bg-black">{loading.states ? "Loading..." : "Select State"}</option>
              {states.map(s => <option key={s.id} value={s.id} className="bg-black">{s.name}</option>)}
            </select>
            {loading.states ? (
              <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-brand-primary" />
            ) : (
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>

        {/* District */}
        <div className={`space-y-2 transition-opacity ${!stateId ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
          <label htmlFor="district-select" className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">District</label>
          <div className="relative group">
            <select 
              id="district-select"
              value={districtId} 
              onChange={handleDistrictChange}
              disabled={loading.districts}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 appearance-none font-bold text-sm focus:outline-none focus:border-brand-primary transition-colors group-hover:bg-white/10 disabled:opacity-50"
            >
              <option value="" className="bg-black">{loading.districts ? "Loading..." : "Select District"}</option>
              {districts.map(d => <option key={d.id} value={d.id} className="bg-black">{d.name}</option>)}
            </select>
            {loading.districts ? (
              <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-brand-primary" />
            ) : (
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>

        {/* Constituency */}
        <div className={`space-y-2 transition-opacity ${!districtId ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
          <label htmlFor="constituency-select" className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">Constituency</label>
          <div className="relative group">
            <select 
              id="constituency-select"
              value={constituencyId} 
              onChange={handleConstituencyChange}
              disabled={loading.constituencies}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 appearance-none font-bold text-sm focus:outline-none focus:border-brand-primary transition-colors group-hover:bg-white/10 disabled:opacity-50"
            >
              <option value="" className="bg-black">{loading.constituencies ? "Loading..." : "Select Constituency"}</option>
              {constituencies.map(c => <option key={c.id} value={c.id} className="bg-black">{c.name}</option>)}
            </select>
            {loading.constituencies ? (
              <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-brand-primary" />
            ) : (
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>

        {/* Ward */}
        <div className={`space-y-2 transition-opacity ${!constituencyId ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
          <label htmlFor="ward-select" className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">Ward / Booth Area</label>
          <div className="relative group">
            <select 
              id="ward-select"
              value={wardId} 
              onChange={e => setWardId(e.target.value)}
              disabled={loading.wards}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 appearance-none font-bold text-sm focus:outline-none focus:border-brand-primary transition-colors group-hover:bg-white/10 disabled:opacity-50"
            >
              <option value="" className="bg-black">{loading.wards ? "Loading..." : "Select Ward"}</option>
              {wards.map(w => <option key={w.wardId} value={w.wardId} className="bg-black">{w.wardName}</option>)}
            </select>
            {loading.wards ? (
              <Loader2 size={18} className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-brand-primary" />
            ) : (
              <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>
      </div>

      <button
        disabled={!wardId}
        onClick={handleSelect}
        className={`w-full py-5 rounded-2xl font-black text-sm transition-all uppercase tracking-widest shadow-premium flex items-center justify-center gap-3 ${
          !wardId ? 'bg-white/5 text-white/20' : 'bg-white text-black hover:scale-[1.02] active:scale-95'
        }`}
      >
        CONFIRM SELECTION <ArrowRight size={18} />
      </button>
    </div>
  );
}
