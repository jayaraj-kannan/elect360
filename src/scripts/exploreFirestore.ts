import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import "dotenv/config";

async function explore() {
  console.log("Exploring Firestore...");
  
  const rootCollections = ["tn_election_2026"];
  
  for (const collName of rootCollections) {
    console.log(`\nChecking collection: ${collName}`);
    const snapshot = await getDocs(collection(db, collName));
    console.log(`Found ${snapshot.size} documents in ${collName}`);
    
    snapshot.docs.forEach(doc => {
      console.log(` - Document ID: ${doc.id}`);
      // Check for subcollections
      // Note: getDocs on subcollections requires knowing the path
    });
  }
  
  // Try the specific path mentioned earlier
  const path = "tn_election_2026/constituencies/all";
  console.log(`\nChecking specific path: ${path}`);
  try {
    const constSnapshot = await getDocs(collection(db, path));
    console.log(`Found ${constSnapshot.size} constituencies.`);
    if (constSnapshot.size > 0) {
      console.log("Example data:", constSnapshot.docs[0].data());
    }
  } catch (err) {
    console.error(`Error fetching ${path}:`, err);
  }
}

explore().catch(console.error);
