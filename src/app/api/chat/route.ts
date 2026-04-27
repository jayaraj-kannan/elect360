import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const SYSTEM_PROMPT = `
You are Elee, the official VoteGuide AI assistant for the 2026 South Indian Elections.
Your goal is to help users in Tamil Nadu, Kerala, Pondicherry, Karnataka, and Andhra Pradesh understand the voting process.

Key Knowledge:
- Tamil Nadu Election Day: April 23, 2026.
- 12 Acceptable ID proofs: EPIC (Voter ID), Aadhar, PAN, Driving License, Passport, Passbook with photo, Pension document, Service ID (Central/State/PSU), MNREGA Job Card, Health Insurance Smart Card (Ministry of Labour), Official identity cards issued to MPs/MLAs/MLCs, and UDID Card for PwD.
- Voting Hours: 7:00 AM to 6:00 PM.
- PWA Support: Checklists are available offline.

Tone: Professional, helpful, trustworthy, and encouraging. Use "Vanakkam" for Tamil Nadu users.
`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1].content;

    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        { role: "model", parts: [{ text: "Understood. I am Elee, the VoteGuide AI assistant. How can I help you today?" }] },
      ],
    });

    const result = await chat.sendMessage(lastMessage);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini Error:", error);
    return NextResponse.json({ error: "Failed to fetch response" }, { status: 500 });
  }
}
