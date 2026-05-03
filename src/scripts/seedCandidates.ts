import { db } from "../lib/firebase";
import { doc, setDoc } from "firebase/firestore";

const candidates: any[] = [
  {
    name: "Dr. Anbu Selvan",
    party: "DMK",
    education: "Post Graduate",
    wealth: "₹12.4 Cr",
    criminalCases: 0,
    tags: ["Incumbent", "Education Focus"],
    image: "https://images.unsplash.com/photo-1540562514872-552763702958?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    name: "K. Karunakaran",
    party: "AIADMK",
    education: "Graduate",
    wealth: "₹8.2 Cr",
    criminalCases: 2,
    tags: ["Former MLA", "Infrastructure"],
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200",
  }
];

const constituencyId = "mylapore"; // Match with electionData.ts

export async function seedCandidates() {
  console.log("Seeding candidates for Mylapore...");
  
  for (const candidate of candidates) {
    const candidateId = candidate.name.toLowerCase().replace(/\s+/g, "_");
    const candidateRef = doc(
      db, 
      "tn_election_2026", 
      "constituencies", 
      "all", 
      constituencyId, 
      "candidates", 
      candidateId
    );
    
    await setDoc(candidateRef, candidate);
    console.log(`Seeded candidate: ${candidate.name}`);
  }
  
  console.log("Seeding complete!");
}
