"use client";

import React, { useState, useEffect } from 'react';
import { Ward } from '@/data/electionData';
import { ArrowRight, ChevronDown, Loader2 } from 'lucide-react';
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
  const [stateId, setStateId] = useState("TN"); // Default to Tamil Nadu
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
        
        // If TN is in the list, it's already set as default stateId
        // but we need to trigger district load if not already happening
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const onDistrictSelect = (val: string) => {
    setDistrictId(val);
    setConstituencyId("");
    setWardId("");
  };

  const onConstituencySelect = (val: string) => {
    setConstituencyId(val);
    setWardId("");
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStateId(e.target.value);
    setDistrictId("");
    setConstituencyId("");
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

        {/* District Selection - Interactive Grid */}
        <div className={`space-y-3 transition-all duration-500 ${!stateId ? 'opacity-20 pointer-events-none' : 'opacity-100'}`}>
          <div className="flex justify-between items-end ml-1">
            <label className="text-[10px] font-black opacity-40 uppercase tracking-widest">Select District</label>
            {loading.districts && <Loader2 size={12} className="animate-spin text-brand-primary mb-1" />}
          </div>
          
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
            {districts.map(d => (
              <button
                key={d.id}
                onClick={() => onDistrictSelect(d.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  districtId === d.id 
                    ? 'bg-brand-primary border-brand-primary text-white shadow-glow' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                }`}
              >
                {d.name}
              </button>
            ))}
            {districts.length === 0 && !loading.districts && (
              <p className="text-[10px] opacity-40 italic py-2">Select a state first...</p>
            )}
          </div>
        </div>

        {/* Constituency Selection - interactive Grid */}
        <div className={`space-y-3 transition-all duration-500 ${!districtId ? 'opacity-20 pointer-events-none translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <div className="flex justify-between items-end ml-1">
            <label className="text-[10px] font-black opacity-40 uppercase tracking-widest">Constituency</label>
            {loading.constituencies && <Loader2 size={12} className="animate-spin text-brand-primary mb-1" />}
          </div>
          
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {constituencies.map(c => (
              <button
                key={c.id}
                onClick={() => onConstituencySelect(c.id)}
                className={`px-4 py-2 rounded-xl text-[11px] font-bold transition-all border ${
                  constituencyId === c.id 
                    ? 'bg-white border-white text-black shadow-premium' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Ward Selection - Keep as dropdown for precision */}
        <div className={`space-y-2 transition-all duration-500 ${!constituencyId ? 'opacity-20 pointer-events-none translate-y-2' : 'opacity-100 translate-y-0'}`}>
          <label htmlFor="ward-select" className="text-[10px] font-black opacity-40 uppercase tracking-widest ml-1">Polling Station / Ward</label>
          <div className="relative group">
            <select 
              id="ward-select"
              value={wardId} 
              onChange={e => setWardId(e.target.value)}
              disabled={loading.wards}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 pr-12 appearance-none font-bold text-sm focus:outline-none focus:border-brand-primary transition-colors group-hover:bg-white/10 disabled:opacity-50"
            >
              <option value="" className="bg-black">{loading.wards ? "Searching Booths..." : "Choose your Booth area"}</option>
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
