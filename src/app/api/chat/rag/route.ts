import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import z from "zod";
import { findRelevantContent, findSimilarCrop } from "@/lib/embeddings";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: google("gemini-2.5-pro"),
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingBudget: 8192,
            includeThoughts: true,
          },
        },
      },
      system: `
    You are Crop Doctor 🌱, an AI agronomist acting like a doctor for plants.
    Always follow the flow: Diagnosis → Treatment → Prevention.

    Rules:
    - If image: analyze crop + symptoms → confirm crop ID → search knowledge base for diseases.
    - If text: same logic with described symptoms.
    - Give probable diagnosis (confidence: high, medium, or low, severity, explanation).
    - If uncertain, provide differential diagnosis + farmer-friendly checks.
    - Treatment: include organic + chemical options, dosage, safety tips.
    - Prevention: resistant varieties, field practices, irrigation, early signs.
    - Use emojis 🌽🌱💧 to simplify.
    - If no crop info available, explain honestly: “No sources available yet.”
    - Never expose raw tool outputs.
    - Only respond with information found using the provided tools, do not generate responses based on your own knowledge or assumptions.
    - Only respond to questions about crop health, diseases, diagnosis, treatment, and prevention. Politely decline unrelated questions, as you are a crop doctor, not a general assistant.”
    `,

      stopWhen: stepCountIs(6),

      messages: convertToModelMessages(messages),
      tools: {
        analyzeImage: tool({
          description: `
          Analyze an uploaded image of a crop.
          Identify the crop type, visible symptoms, and possible diseases.
        `,
          inputSchema: z.object({
            imageUrl: z.string().url().describe("URL of the uploaded image"),
          }),
          execute: async ({ imageUrl }) => {
            return {
              imageUrl,
            };
          },
        }),

        getCropId: tool({
          description:
            "Resolve a crop name to an internal crop ID. Use this before calling getInformation.",
          inputSchema: z.object({
            cropName: z
              .string()
              .describe("The identified crop name, e.g., maize, beans"),
          }),
          execute: async ({ cropName }) => {
            const match = await findSimilarCrop(cropName);
            if (match && match.similarity > 0.7) {
              return [{ id: match.id, name: match.name }];
            }
            return [{ id: "unknown", name: cropName }];
          },
        }),

        getInformation: tool({
          description:
            "Retrieve agricultural knowledge using a query and cropId.",
          inputSchema: z.object({
            cropId: z.string().describe("Resolved crop ID from getCropId"),
            query: z
              .string()
              .describe("The user’s question or the diagnosis details"),
          }),
          execute: async ({ cropId, query }) => {
            return findRelevantContent(query, cropId);
          },
        }),
      },
    });

    console.log("reasoningText:", result.reasoningText);
    console.log("result:", result);
    return result.toUIMessageStreamResponse({ sendReasoning: true });
  } catch (error) {
    console.error("An error occurred:", error);
    return new Response("An unexpected error occurred.", { status: 500 });
  }
}
