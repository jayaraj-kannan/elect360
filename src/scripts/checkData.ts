import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env") });

import { getDocs, collection, limit } from "firebase/firestore";

async function checkData() {
  const { db } = await import("../lib/firebase");
  
  try {
    const colRef = collection(db, "tn_election_2026", "constituencies", "all");
    const snapshot = await getDocs(colRef);
    console.log(`Found ${snapshot.size} constituencies`);
    
    if (snapshot.size > 0) {
      const doc = snapshot.docs[0];
      console.log("Sample ID:", doc.id);
      console.log("Sample Data:", doc.data());
      
      const candidatesRef = collection(doc.ref, "candidates");
      const candidatesSnapshot = await getDocs(candidatesRef);
      console.log(`Found ${candidatesSnapshot.size} candidates in this constituency`);
      if (candidatesSnapshot.size > 0) {
        console.log("Sample Candidate:", candidatesSnapshot.docs[0].data());
      }
    }
  } catch (err) {
    console.error("Error reading data:", err);
  }
}

checkData();
