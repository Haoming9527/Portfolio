import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { client } from "@/app/lib/sanity";

async function getKnowledgeBase() {
  const query = `*[_type != "sanity.imageAsset" && _type != "sanity.fileAsset"]{
    _type,
    title,
    name,
    description,
    organization,
    period
  } | order(orderRank asc)`;
  const data = await client.fetch(query, {}, { next: { revalidate: 30 } });
  return data;
}

type KnowledgeBaseDoc =
  | { _type: "project"; title: string; description: string }
  | { _type: "technology"; name: string }
  | { _type: "experience"; title: string; organization: string; period: string; description: string }
  | { _type: "education"; title: string; period: string; description: string }
  | { _type: "certificate"; title: string; description: string };

function formatKnowledgeBase(docs: KnowledgeBaseDoc[]): string {
  return docs
    .map((doc) => {
      switch (doc._type) {
        case "project":
          return `Project: ${doc.title} — ${doc.description}`;
        case "technology":
          return `Technology: ${doc.name}`;
        case "experience":
          return `Experience: ${doc.title} at ${doc.organization} (${doc.period}) — ${doc.description}`;
        case "education":
          return `Education: ${doc.title} (${doc.period}) — ${doc.description}`;
        case "certificate":
          return `Certificate: ${doc.title} — ${doc.description}`;
        default:
          return "";
      }
    })
    .filter(Boolean)
    .join("\n");
}

function trimTo100Words(text: string): string {
  const words = text.split(/\s+/);
  
  if (words.length <= 100) return text;

  const limited = words.slice(0, 100).join(" ");

  const lastPunct = Math.max(
    limited.lastIndexOf("."),
    limited.lastIndexOf("!"),
    limited.lastIndexOf("?")
  );

  return lastPunct > 0 ? limited.slice(0, lastPunct + 1) : limited;
}


export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const kbDocs = await getKnowledgeBase();
    const context = formatKnowledgeBase(kbDocs);
    const prompt = `
    You are a helpful and professional chatbot for Shen Haoming's personal portfolio website.  
    You must always keep answers under 100 words. Do not exceed this limit under any circumstance.  
    Answer the user’s question strictly based on the knowledge base below:  

    CONTEXT (knowledge base):
    ${context}

    USER QUESTION:
    ${message}


    Rules for your response:  
    - Base answers only on the knowledge base provided.  
    - If the answer is unknown, say politely: "I don’t have that information in my knowledge base."  
    - Be clear, concise, and friendly.  
    - Always use fewer than 100 words. Brevity is more important than detail.  
    `;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);

    let reply = result?.response?.text() || "No reply";
    reply = trimTo100Words(reply);
    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error("Gemini error:", err);
    const message = err instanceof Error ? err.message : "Gemini server error";
    return NextResponse.json(
      { error: { message } },
      { status: 500 }
    );
  }
}