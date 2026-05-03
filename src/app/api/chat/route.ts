import { GoogleGenerativeAI, FunctionDeclaration, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { getConstituenciesByDistrictName } from "@/lib/constituencyService";
import { getCandidatesByConstituencyName } from "@/lib/candidateService";

const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Define Function Declarations for Gemini
const getConstituenciesDeclaration: FunctionDeclaration = {
  name: "getConstituenciesByDistrictName",
  description: "Get a list of election constituencies within a given district. Returns the constituency name, number, and other details.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      districtName: {
        type: SchemaType.STRING,
        description: "The name of the district (e.g., 'Tiruvallur', 'Chennai').",
      },
    },
    required: ["districtName"],
  },
};

const getCandidatesDeclaration: FunctionDeclaration = {
  name: "getCandidatesByConstituencyName",
  description: "Get a list of candidates running in a specific constituency. Returns the candidate name, party, wealth, criminal cases, education, etc.",
  parameters: {
    type: SchemaType.OBJECT,
    properties: {
      constituencyName: {
        type: SchemaType.STRING,
        description: "The name of the constituency (e.g., 'Gummidipoondi', 'Ponneri').",
      },
    },
    required: ["constituencyName"],
  },
};

const tools: any = [
  {
    functionDeclarations: [getConstituenciesDeclaration, getCandidatesDeclaration],
  },
];

// Note: Google Search Grounding tool has been temporarily removed because it requires a specific
// enterprise API key configuration and is currently throwing 400 bad request errors for standard keys.

const model = genAI.getGenerativeModel({ 
  model: "gemini-1.5-flash",
  tools: tools
});

const SYSTEM_PROMPT = `
You are Elee, the official enVote AI assistant for the 2026 South Indian Elections.
Your primary and ONLY goal is to help users understand the voting process, candidates, and election details.

CRITICAL RULES:
1. You MUST ONLY answer questions related to elections, voting, candidates, and politics.
2. If a user asks about ANYTHING else (e.g., "what is the capital of France", "write a poem", "how to code"), you MUST respectfully refuse to answer and state that you are an election assistant.
3. If a user asks about specific constituencies in a district, use the 'getConstituenciesByDistrictName' tool.
4. If a user asks about specific candidates in a constituency, use the 'getCandidatesByConstituencyName' tool.
5. If you do not have the information in the database, you can use your general knowledge to answer, provided it is election-related.
6. For famous candidate questions, use your general knowledge if the database tools don't return them.

Key Knowledge:
- Tamil Nadu Election Day: April 23, 2026.
- 12 Acceptable ID proofs: EPIC (Voter ID), Aadhar, PAN, Driving License, Passport, Passbook with photo, Pension document, Service ID (Central/State/PSU), MNREGA Job Card, Health Insurance Smart Card (Ministry of Labour), Official identity cards issued to MPs/MLAs/MLCs, and UDID Card for PwD.
- Voting Hours: 7:00 AM to 6:00 PM.

Tone: Professional, helpful, trustworthy, and encouraging. Use "Vanakkam" for Tamil Nadu users.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1].content;

    // We only pass the user prompt and handle the conversation state manually 
    // because the standard chat session expects specific history formatting.
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood. I am Elee, the enVote AI assistant. How can I help you today?" }] },
      ],
    });

    let result = await chat.sendMessage(lastMessage);
    let response = await result.response;
    
    // Handle Function Calls (Agentic Loop)
    // Sometimes the model might want to call multiple functions or call them repeatedly
    let maxLoops = 5;
    while (response.functionCalls() && maxLoops > 0) {
      maxLoops--;
      const calls = response.functionCalls();
      if (!calls) break;

      const functionResponses = [];

      for (const call of calls) {
        console.log(`Gemini is calling function: ${call.name} with args:`, call.args);
        
        let apiResponse: any = { error: "Function not found" };

        try {
          if (call.name === "getConstituenciesByDistrictName") {
            const districtName = (call.args as any).districtName;
            const data = await getConstituenciesByDistrictName(districtName);
            apiResponse = { data: data.length > 0 ? data : "No constituencies found for this district." };
          } 
          else if (call.name === "getCandidatesByConstituencyName") {
            const constituencyName = (call.args as any).constituencyName;
            const data = await getCandidatesByConstituencyName(constituencyName);
            // Simplify data to reduce payload size to Gemini
            const simplifiedData = data.map(c => ({
              name: c.name,
              party: c.party,
              education: c.education,
              wealth: c.wealth,
              criminalCases: c.criminalCases
            }));
            apiResponse = { data: simplifiedData.length > 0 ? simplifiedData : "No candidates found for this constituency." };
          }
        } catch (err: any) {
          console.error(`Error executing ${call.name}:`, err);
          apiResponse = { error: err.message || "Execution failed" };
        }

        functionResponses.push({
          functionResponse: {
            name: call.name,
            response: apiResponse
          }
        });
      }

      // Send the function response back to Gemini to continue the conversation
      result = await chat.sendMessage(functionResponses);
      response = await result.response;
    }

    const text = response.text();
    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Gemini Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch response: " + (error.message || "Unknown error") }, 
      { status: 500 }
    );
  }
}
