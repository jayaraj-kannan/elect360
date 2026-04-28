import "dotenv/config";

import { getDocs, collection, query, where } from "firebase/firestore";

async function checkData() {
  const { db } = await import("../lib/firebase");
  
  try {
    const colRef = collection(db, "tn_election_2026", "constituencies", "all");
    const q = query(colRef, where("name", "==", "Mylapore"));
    const snapshot = await getDocs(q);
    console.log(`Found ${snapshot.size} constituencies for Mylapore`);
    
    if (snapshot.size > 0) {
      console.log("Mylapore ID:", snapshot.docs[0].id);
    }
  } catch (err) {
    console.error("Error reading data:", err);
  }
}

checkData();
