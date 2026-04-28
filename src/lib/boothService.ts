import { 
  getUniqueDistricts, 
  getConstituenciesByDistrictName,
  getAllConstituencies
} from "./constituencyService";
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
    // For now, we prioritize TN as per the requirement
    const constituencies = await getAllConstituencies();
    if (constituencies.length > 0) {
      return [{ id: "TN", name: "Tamil Nadu" }];
    }
    throw new Error("No constituencies found in Firestore");
  } catch (err) {
    console.warn("Firestore failed, using mock data", err);
    const states = new Map<string, string>();
    electionData.forEach(s => states.set(s.id, s.name));
    return Array.from(states.entries()).map(([id, name]) => ({ id, name }));
  }
}

export async function getDistrictsByState(stateId: string) {
  if (stateId === "TN") {
    try {
      const districts = await getUniqueDistricts();
      if (districts.length > 0) {
        return districts.map(d => ({ id: d, name: d }));
      }
    } catch (err) {
      console.error("Failed to fetch districts for TN:", err);
    }
  }
  
  const state = electionData.find(s => s.id === stateId);
  return state ? state.districts.map(d => ({ id: d.id, name: d.name })) : [];
}

export async function getConstituenciesByDistrict(districtId: string) {
  // If districtId is a name (from Firestore) or matches TN districts
  try {
    const constituencies = await getConstituenciesByDistrictName(districtId);
    if (constituencies.length > 0) {
      return constituencies.map(c => ({ 
        id: c.id, // Using the document ID (e.g., 001_gummidipoondi)
        name: c.name 
      }));
    }
  } catch (err) {
    console.error("Failed to fetch constituencies from Firestore:", err);
  }

  // Fallback to mock data
  for (const state of electionData) {
    const district = state.districts.find(d => d.id === districtId);
    if (district) return district.constituencies.map(c => ({ id: c.id, name: c.name }));
  }
  return [];
}

export async function getWardsByConstituency(constituencyId: string) {
  try {
    const { db } = await import("./firebase");
    const { collection, query, where, getDocs } = await import("firebase/firestore");
    
    const boothsRef = collection(db, BOOTHS_COLLECTION);
    const q = query(boothsRef, where("constituencyId", "==", constituencyId));
    const snapshot = await getDocs(q);
    const wards = new Map<string, BoothData>();
    
    snapshot.forEach(doc => {
      const data = doc.data() as BoothData;
      wards.set(data.wardId, data);
    });
    
    if (wards.size === 0) throw new Error("No booths found for constituency " + constituencyId);
    return Array.from(wards.values());
  } catch (err) {
    console.warn("Wards fetch failed, falling back to mock:", err);
    const booths = getMockBooths();
    return booths.filter(b => b.constituencyId === constituencyId);
  }
}

export async function searchBooths(searchTerm: string) {
  try {
    const { db } = await import("./firebase");
    const { collection, getDocs } = await import("firebase/firestore");
    
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
    
    if (booths.length === 0 && searchTerm === "") throw new Error("No booths found in Firestore");
    return booths;
  } catch (err) {
    console.warn("Booth search failed, falling back to mock:", err);
    const booths = getMockBooths();
    if (!searchTerm) return booths;
    const lowerSearch = searchTerm.toLowerCase();
    return booths.filter(b => 
      b.name.toLowerCase().includes(lowerSearch) || 
      b.address.toLowerCase().includes(lowerSearch)
    );
  }
}
