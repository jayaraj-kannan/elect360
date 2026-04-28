import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";

export interface FirestoreConstituency {
  id: string; // The document ID, e.g., "001_gummidipoondi"
  constituency_no: number;
  district: string;
  election_date: string;
  last_updated: any;
  margin: string | null;
  myneta_constituency_id: number;
  name: string;
  reserved: string;
  result_date: string;
  result_status: string;
  runner_up: string | null;
  runner_up_party: string | null;
  total_candidates: number;
  winner: string | null;
  winner_party: string | null;
  winner_votes: number | null;
}

const ELECTION_ROOT = "tn_election_2026";
let cachedConstituencies: FirestoreConstituency[] | null = null;

/**
 * Resets the internal cache (mainly for testing).
 */
export function resetCache() {
  cachedConstituencies = null;
}

/**
 * Fetches all constituencies from Firestore and caches them.
 */
export async function getAllConstituencies(): Promise<FirestoreConstituency[]> {
  if (cachedConstituencies) return cachedConstituencies;

  try {
    console.log(`Fetching constituencies from: ${ELECTION_ROOT}/constituencies/all`);
    const constRef = collection(db, ELECTION_ROOT, "constituencies", "all");
    const snapshot = await getDocs(constRef);
    
    if (snapshot.empty) {
      console.warn("Firestore collection is empty at the specified path.");
    }

    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FirestoreConstituency[];
    
    console.log(`Successfully fetched ${data.length} constituencies.`);
    cachedConstituencies = data;
    return data;
  } catch (err) {
    console.error("Failed to fetch constituencies from Firestore:", err);
    return [];
  }
}

/**
 * Gets unique district names from the constituency list.
 */
export async function getUniqueDistricts(): Promise<string[]> {
  const constituencies = await getAllConstituencies();
  const districts = new Set(constituencies.map(c => c.district));
  return Array.from(districts).sort();
}

/**
 * Gets constituencies filtered by district name.
 */
export async function getConstituenciesByDistrictName(districtName: string): Promise<FirestoreConstituency[]> {
  const constituencies = await getAllConstituencies();
  return constituencies
    .filter(c => c.district === districtName)
    .sort((a, b) => a.constituency_no - b.constituency_no);
}

/**
 * Finds a constituency by its document name (e.g., "001_gummidipoondi") 
 * or by its friendly name (e.g., "Gummidipoondi").
 */
export async function findConstituency(identifier: string): Promise<FirestoreConstituency | undefined> {
  const constituencies = await getAllConstituencies();
  return constituencies.find(c => 
    c.id === identifier || 
    c.name.toLowerCase() === identifier.toLowerCase()
  );
}
