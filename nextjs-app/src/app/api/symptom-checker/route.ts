import { NextResponse } from "next/server";
import { marked } from "marked";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        format: "json",
        prompt: `You are a careful, evidence-informed medical assistant. Return ONLY a JSON object with this exact shape and no extra text:\n{\n  \"possibilities\": [{\"title\": string, \"description\": string, \"risk\": \"low\"|\"medium\"|\"high\"}],\n  \"nextSteps\": string[],\n  \"clarifyingQuestions\": string[],\n  \"severity\": number,\n  \"chips\": string[]\n}\n- Provide 3–5 possibilities with concise descriptions and appropriate risk.\n- Provide 3–6 next steps, practical and safe.\n- Ask 1–3 clarifying questions.\n- Calibrate severity conservatively (0 minimal, 100 critical).\n- Keep chips short (1–2 words).\n\nUser symptoms: ${message}`,
        stream: false
      }),
    });

    const data = await response.json();

    // Try to parse structured JSON; otherwise fall back to HTML rendering
    try {
      const payload = typeof data.response === "string" ? JSON.parse(data.response) : (data.response ?? data);
      return NextResponse.json({ structured: payload });
    } catch {
      const html = marked.parse(data.response || data);
      return NextResponse.json({ reply: html });
    }
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
