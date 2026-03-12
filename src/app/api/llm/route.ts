import { cohere } from "@ai-sdk/cohere";
import { generateText } from "ai";

export async function POST(req: Request) {
  const { prompt, system } = await req.json();
  const { text } = await generateText({
    model: cohere("command-a-03-2025"),
    prompt,
    system,
  });

  return new Response(text);
}
