// Using Cohere
import { cohere } from "@ai-sdk/cohere";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: cohere("command-a-03-2025"),
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
