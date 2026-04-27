import { db } from "../lib/firebase";
import { collection, writeBatch, doc } from "firebase/firestore";
import { electionData } from "../data/electionData";

async function seedBooths() {
  console.log("Starting seeding process...");
  const batch = writeBatch(db);
  const boothsRef = collection(db, "booths");

  let count = 0;

  for (const state of electionData) {
    for (const district of state.districts) {
      for (const constituency of district.constituencies) {
        for (const ward of constituency.wards) {
          const booth = ward.booth;
          const boothDoc = doc(boothsRef, booth.id);
          
          batch.set(boothDoc, {
            id: booth.id,
            name: booth.name,
            address: booth.address,
            coords: booth.coords,
            stateId: state.id,
            stateName: state.name,
            districtId: district.id,
            districtName: district.name,
            constituencyId: constituency.id,
            constituencyName: constituency.name,
            wardId: ward.id,
            wardName: ward.name,
            distance: booth.distance || "",
            travelTime: booth.travelTime || ""
          });
          
          count++;
        }
      }
    }
  }

  try {
    await batch.commit();
    console.log(`Successfully seeded ${count} booths!`);
  } catch (error) {
    console.error("Error seeding booths:", error);
  }
}

seedBooths();
