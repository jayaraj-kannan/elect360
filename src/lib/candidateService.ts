import { findConstituency } from "./constituencyService";

export interface Candidate {
  id: string;
  name: string;
  party: string;
  constituencyId: string;
  education: string;
  wealth: string;
  criminalCases: number;
  tags: string[];
  image: string;
}

const ELECTION_ROOT = "tn_election_2026";

export async function getCandidatesByConstituencyName(constituencyName: string): Promise<Candidate[]> {
  try {
    // 1. Find the constituency document by its name
    const constituencyDoc = await findConstituency(constituencyName);
    
    if (!constituencyDoc) {
      console.warn(`Constituency '${constituencyName}' not found in Firestore.`);
      return [];
    }
    
    const realConstituencyId = constituencyDoc.id;

    // 2. Fetch candidates from its subcollection
    const { db } = await import("./firebase");
    const { collection, getDocs } = await import("firebase/firestore");
    
    const candidatesRef = collection(
      db, 
      ELECTION_ROOT, 
      "constituencies", 
      "all", 
      realConstituencyId, 
      "candidates"
    );
    
    const snapshot = await getDocs(candidatesRef);
    const candidates: Candidate[] = [];
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // Determine tags based on available data
      const tags: string[] = [];
      if (data.is_winner) tags.push("Winner");
      if (data.age) tags.push(`Age ${data.age}`);
      if (data.party && data.party !== "IND") tags.push(data.party);

      candidates.push({
        id: doc.id,
        name: data.name || doc.id,
        party: data.party === "IND" || !data.party ? "Independent" : data.party,
        constituencyId: realConstituencyId,
        education: data.education || "N/A",
        wealth: data.total_assets || "N/A", // Map from external schema
        criminalCases: data.criminal_cases || 0, // Map from external schema
        tags: tags.length > 0 ? tags : data.tags || [],
        image: data.image || "https://images.unsplash.com/photo-1540562514872-552763702958?auto=format&fit=crop&q=80&w=200&h=200"
      });
    });
    
    return candidates;
  } catch (err) {
    console.error("Failed to fetch candidates from Firestore", err);
    return [];
  }
}
