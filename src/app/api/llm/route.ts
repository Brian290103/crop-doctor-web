import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export async function POST(req: Request) {
  const { prompt, system } = await req.json();
  const { text } = await generateText({
    model: google("gemini-2.5-flash"),
    prompt,
    system,
  });

  return new Response(text);
}
