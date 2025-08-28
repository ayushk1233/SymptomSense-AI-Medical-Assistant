import { NextResponse } from "next/server";
import { marked } from "marked";

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // Build chat messages for Ollama chat API
    const systemPrompt = `You are a careful, evidence‑informed medical assistant.
Return ONLY a JSON object with this exact shape and no extra text:
{
  "possibilities": [{"title": string, "description": string, "risk": "low"|"medium"|"high"}],
  "nextSteps": string[],
  "clarifyingQuestions": string[],
  "severity": number,
  "chips": string[]
}
- Provide 3–5 possibilities with concise descriptions and appropriate risk.
- Provide 3–6 next steps, practical and safe.
- Ask 1–3 clarifying questions.
- Calibrate severity conservatively (0 minimal, 100 critical).
- Keep chips short (1–2 words).
If prior conversation context is provided, incorporate it. If the user clarifies a previous message, do not change topics.`;

    const chatMessages: { role: string; content: string }[] = [
      { role: "system", content: systemPrompt },
      ...((Array.isArray(history) ? history : [])
        .filter((m: any) => typeof m?.role === "string" && typeof m?.content === "string" && m.content.trim().length > 0)
        .map((m: any) => ({ role: m.role, content: m.content }))),
      { role: "user", content: `User symptoms: ${message}` }
    ];

    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        messages: chatMessages,
        format: "json",
        stream: false
      })
    });

    const data = await response.json();

    // Try to parse structured JSON; otherwise fall back to HTML rendering
    try {
      // Ollama chat returns {message: {content}} or {response}
      const raw = (data?.message?.content ?? data?.response ?? data);
      const payload = typeof raw === "string" ? JSON.parse(raw) : raw;
      return NextResponse.json({ structured: payload });
    } catch {
      const html = marked.parse(data?.message?.content || data?.response || data);
      return NextResponse.json({ reply: html });
    }
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
