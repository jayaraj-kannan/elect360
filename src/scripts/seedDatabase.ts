import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env
config({ path: resolve(process.cwd(), ".env") });

// DB will be imported dynamically after dotenv is configured
import { collection, writeBatch, doc } from "firebase/firestore";
import { electionData } from "../data/electionData";


const ELECTION_ROOT = "tn_election_2026";

const candidatesData: Record<string, unknown[]> = {
  "mylapore": [
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
  ],
  "t-nagar": [
    {
      name: "S. Raghavan",
      party: "BJP",
      education: "Law Graduate",
      wealth: "₹4.5 Cr",
      criminalCases: 1,
      tags: ["New Face", "Business Focus"],
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200",
    }
  ]
};

async function seedDatabase() {
  console.log("🚀 Starting database initialization...");
  
  const { db } = await import("../lib/firebase");
  const batch = writeBatch(db);
  
  const rootRef = collection(db, ELECTION_ROOT);
  const constituenciesRef = collection(rootRef, "constituencies", "all");

  let constituenciesCount = 0;
  let candidatesCount = 0;

  // Track unique constituencies to avoid duplicates since we loop through wards
  const processedConstituencies = new Set<string>();

  for (const state of electionData) {
    for (const district of state.districts) {
      for (const constituency of district.constituencies) {
        if (!processedConstituencies.has(constituency.id)) {
          processedConstituencies.add(constituency.id);
          
          // 1. Create Constituency Document
          const constituencyDocRef = doc(constituenciesRef, constituency.id);
          batch.set(constituencyDocRef, {
            id: constituency.id,
            name: constituency.name,
            districtId: district.id,
            districtName: district.name,
            stateId: state.id,
            stateName: state.name
          });
          constituenciesCount++;

          // 2. Create Candidates under this constituency
          const candidatesForConst = candidatesData[constituency.id] || [];
          const candidatesColRef = collection(constituencyDocRef, "candidates");
          
          for (const candidate of candidatesForConst) {
            const candidateId = candidate.name.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/_+/g, "_");
            const candidateDocRef = doc(candidatesColRef, candidateId);
            batch.set(candidateDocRef, {
              ...candidate,
              id: candidateId,
              constituencyId: constituency.id
            });
            candidatesCount++;
          }
        }
      }
    }
  }

  try {
    console.log(`Writing ${constituenciesCount} constituencies and ${candidatesCount} candidates to Firestore...`);
    await batch.commit();
    console.log("✅ Database initialization complete!");
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
}

seedDatabase();
