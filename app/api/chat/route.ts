import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { client } from "@/app/lib/sanity";

async function getProjects() {
  const query = `*[_type == "project"]{
    title,
    description
  } | order(orderRank asc)`;
  const data = await client.fetch(query, {}, { next: { revalidate: 30 } });
  return data.map((d: any) => `Project: ${d.title} — ${d.description}`).join("\n");
}

async function getExperience() {
  const query = `*[_type == "experience"]{
    title,
    organization,
    period,
    description
  } | order(orderRank asc)`;
  const data = await client.fetch(query, {}, { next: { revalidate: 30 } });
  return data.map((d: any) => `Experience: ${d.title} at ${d.organization} (${d.period}) — ${d.description}`).join("\n");
}

async function getEducation() {
  const query = `*[_type == "education"]{
    title,
    period,
    description
  } | order(orderRank asc)`;
  const data = await client.fetch(query, {}, { next: { revalidate: 30 } });
  return data.map((d: any) => `Education: ${d.title} (${d.period}) — ${d.description}`).join("\n");
}

async function getCertificates() {
  const query = `*[_type == "certificate"]{
    title,
    description
  } | order(orderRank asc)`;
  const data = await client.fetch(query, {}, { next: { revalidate: 30 } });
  return data.map((d: any) => `Certificate: ${d.title} — ${d.description}`).join("\n");
}

async function getTechnologies() {
  const query = `*[_type == "technology"]{
    name
  } | order(orderRank asc)`;
  const data = await client.fetch(query, {}, { next: { revalidate: 30 } });
  return data.map((d: any) => `Technology: ${d.name}`).join("\n");
}


const tools = [
  {
    functionDeclarations: [
      {
        name: "get_projects",
        description: "Get information about Shen Haoming's projects.",
      },
      {
        name: "get_experience",
        description: "Get information about Shen Haoming's work experience.",
      },
      {
        name: "get_education",
        description: "Get information about Shen Haoming's education background.",
      },
      {
        name: "get_certificates",
        description: "Get information about Shen Haoming's certifications.",
      },
      {
        name: "get_technologies",
        description: "Get information about the technical skills and technologies Shen Haoming is proficient in.",
      },
    ],
  },
];

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

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const contents: any[] = [{ role: "user", parts: [{ text: message }] }];
    const config = {
      systemInstruction: `
        You are a helpful and professional chatbot for Shen Haoming's personal portfolio website.  
        Use the provided tools to fetch information about Shen Haoming's projects, experience, education, certificates, and technologies when needed to answer the user's question.
        
        Rules for your response:
        - Use markdown for formatting (e.g., bullet points for lists, bold text for emphasis) where appropriate to make information easy to read.
        - Base answers ONLY on the information retrieved via tools.
        - If the information is not available via tools, say politely: "I don’t have that information in my knowledge base."
        - Be clear, concise, and friendly.
        - Always use fewer than 100 words. Brevity is more important than detail.
      `,
      tools,
    };

    let response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite-preview",
      contents,
      config,
    });

    let calls = response.functionCalls || [];
    
    // Iteratively handle tool calls
    while (calls.length > 0) {
      contents.push(response.candidates?.[0]?.content as any);

      const functionParts: any[] = [];
      for (const call of calls) {
        let content = "";
        switch (call.name) {
          case "get_projects":
            content = await getProjects();
            break;
          case "get_experience":
            content = await getExperience();
            break;
          case "get_education":
            content = await getEducation();
            break;
          case "get_certificates":
            content = await getCertificates();
            break;
          case "get_technologies":
            content = await getTechnologies();
            break;
        }
        
        functionParts.push({
          functionResponse: {
            name: call.name,
            response: { content },
            id: (call as any).id
          }
        });
      }

      contents.push({ role: "user", parts: functionParts });

      response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-preview",
        contents,
        config,
      });
      
      calls = response.functionCalls || [];
    }

    let reply = response.text || "No reply";
    reply = trimTo100Words(reply);
    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error("Gemini error:", err);
    
    const errorObj = err as { status?: number; response?: { status?: number } };
    const status = errorObj?.status || errorObj?.response?.status;
    
    if (status == 503) {
      return NextResponse.json(
        { 
          error: { 
            message: "The AI model is currently overloaded. Please try again in a moment." 
          } 
        },
        { status: 503 }
      );
    }

    if (status == 429) {
      return NextResponse.json(
        { 
          error: { 
            message: "I've reached my rate limit and am temporarily unavailable." 
          } 
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: { message: "Unexpected error occur" } },
      { status: 500 }
    );
  }
}