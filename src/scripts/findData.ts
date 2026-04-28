import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import "dotenv/config";

async function listCollections() {
  // Firestore REST API can be used to list collections if the SDK doesn't support it in this environment
  // But usually we just try common names
  const common = ["constituencies", "states", "districts", "tn_election_2026", "booths", "candidates"];
  
  for (const name of common) {
    try {
      const snap = await getDocs(collection(db, name));
      if (snap.size > 0) {
        console.log(`Found data in collection: ${name} (${snap.size} docs)`);
        console.log("Sample:", snap.docs[0].id, snap.docs[0].data());
      }
    } catch (e) {}
  }
}

listCollections().catch(console.error);
