import "dotenv/config";
import { 
  getAllConstituencies, 
  getUniqueDistricts, 
  getConstituenciesByDistrictName 
} from "../lib/constituencyService";

async function runTest() {
  console.log("🚀 Testing Firestore Constituency Fetch...");
  
  try {
    console.log("\n1. Fetching all constituencies...");
    const all = await getAllConstituencies();
    console.log(`✅ Found ${all.length} constituencies.`);
    
    if (all.length > 0) {
      console.log("Sample document ID:", all[0].id);
      console.log("Sample data:", JSON.stringify(all[0], null, 2));
    }

    console.log("\n2. Fetching unique districts...");
    const districts = await getUniqueDistricts();
    console.log(`✅ Found ${districts.length} districts:`, districts.join(", "));

    if (districts.length > 0) {
      const firstDistrict = districts[0];
      console.log(`\n3. Fetching constituencies for district: ${firstDistrict}...`);
      const filtered = await getConstituenciesByDistrictName(firstDistrict);
      console.log(`✅ Found ${filtered.length} constituencies in ${firstDistrict}.`);
      filtered.forEach(c => console.log(`   - [${c.constituency_no}] ${c.name}`));
    }

    console.log("\n🎉 Test completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Test failed:", err);
    process.exit(1);
  }
}

runTest();
