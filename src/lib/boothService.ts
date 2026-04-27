import { db } from "./firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
} from "firebase/firestore";
import { electionData } from "../data/electionData";

export interface BoothData {
  id: string;
  name: string;
  address: string;
  coords: { lat: number, lng: number };
  stateId: string;
  stateName: string;
  districtId: string;
  districtName: string;
  constituencyId: string;
  constituencyName: string;
  wardId: string;
  wardName: string;
  distance?: string;
  travelTime?: string;
}

const BOOTHS_COLLECTION = "booths";

// Helper to flatten electionData for mock use
const getMockBooths = (): BoothData[] => {
  const allBooths: BoothData[] = [];
  electionData.forEach(state => {
    state.districts.forEach(district => {
      district.constituencies.forEach(constituency => {
        constituency.wards.forEach(ward => {
          allBooths.push({
            id: ward.booth.id,
            name: ward.booth.name,
            address: ward.booth.address,
            coords: ward.booth.coords,
            stateId: state.id,
            stateName: state.name,
            districtId: district.id,
            districtName: district.name,
            constituencyId: constituency.id,
            constituencyName: constituency.name,
            wardId: ward.id,
            wardName: ward.name,
            distance: ward.booth.distance,
            travelTime: ward.booth.travelTime
          });
        });
      });
    });
  });
  return allBooths;
};

export async function getAllStates() {
  try {
    const boothsRef = collection(db, BOOTHS_COLLECTION);
    const snapshot = await getDocs(boothsRef);
    const states = new Map<string, string>();
    
    snapshot.forEach(doc => {
      const data = doc.data() as BoothData;
      if (data.stateId) {
        states.set(data.stateId, data.stateName);
      }
    });
    
    if (states.size === 0) throw new Error("Empty Firestore");
    return Array.from(states.entries()).map(([id, name]) => ({ id, name }));
  } catch (err) {
    console.warn("Firestore failed, using mock data", err);
    const states = new Map<string, string>();
    electionData.forEach(s => states.set(s.id, s.name));
    return Array.from(states.entries()).map(([id, name]) => ({ id, name }));
  }
}

export async function getDistrictsByState(stateId: string) {
  try {
    const boothsRef = collection(db, BOOTHS_COLLECTION);
    const q = query(boothsRef, where("stateId", "==", stateId));
    const snapshot = await getDocs(q);
    const districts = new Map<string, string>();
    
    snapshot.forEach(doc => {
      const data = doc.data() as BoothData;
      districts.set(data.districtId, data.districtName);
    });
    
    if (districts.size === 0) throw new Error("Empty Firestore");
    return Array.from(districts.entries()).map(([id, name]) => ({ id, name }));
  } catch (err) {
    const state = electionData.find(s => s.id === stateId);
    return state ? state.districts.map(d => ({ id: d.id, name: d.name })) : [];
  }
}

export async function getConstituenciesByDistrict(districtId: string) {
  try {
    const boothsRef = collection(db, BOOTHS_COLLECTION);
    const q = query(boothsRef, where("districtId", "==", districtId));
    const snapshot = await getDocs(q);
    const constituencies = new Map<string, string>();
    
    snapshot.forEach(doc => {
      const data = doc.data() as BoothData;
      constituencies.set(data.constituencyId, data.constituencyName);
    });
    
    if (constituencies.size === 0) throw new Error("Empty Firestore");
    return Array.from(constituencies.entries()).map(([id, name]) => ({ id, name }));
  } catch (err) {
    for (const state of electionData) {
      const district = state.districts.find(d => d.id === districtId);
      if (district) return district.constituencies.map(c => ({ id: c.id, name: c.name }));
    }
    return [];
  }
}

export async function getWardsByConstituency(constituencyId: string) {
  try {
    const boothsRef = collection(db, BOOTHS_COLLECTION);
    const q = query(boothsRef, where("constituencyId", "==", constituencyId));
    const snapshot = await getDocs(q);
    const wards = new Map<string, BoothData>();
    
    snapshot.forEach(doc => {
      const data = doc.data() as BoothData;
      wards.set(data.wardId, data);
    });
    
    if (wards.size === 0) throw new Error("Empty Firestore");
    return Array.from(wards.values());
  } catch (err) {
    const booths = getMockBooths();
    return booths.filter(b => b.constituencyId === constituencyId);
  }
}

export async function searchBooths(searchTerm: string) {
  try {
    const boothsRef = collection(db, BOOTHS_COLLECTION);
    const snapshot = await getDocs(boothsRef);
    const booths: BoothData[] = [];
    
    const lowerSearch = searchTerm.toLowerCase();
    snapshot.forEach(doc => {
      const data = doc.data() as BoothData;
      if (
        data.name.toLowerCase().includes(lowerSearch) || 
        data.address.toLowerCase().includes(lowerSearch) ||
        data.wardName.toLowerCase().includes(lowerSearch)
      ) {
        booths.push(data);
      }
    });
    
    if (booths.length === 0 && searchTerm === "") throw new Error("Empty Firestore");
    return booths;
  } catch (err) {
    const booths = getMockBooths();
    if (!searchTerm) return booths;
    const lowerSearch = searchTerm.toLowerCase();
    return booths.filter(b => 
      b.name.toLowerCase().includes(lowerSearch) || 
      b.address.toLowerCase().includes(lowerSearch)
    );
  }
}
