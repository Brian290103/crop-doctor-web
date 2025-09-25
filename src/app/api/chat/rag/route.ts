import { findRelevantContent, findSimilarCrop } from "@/lib/embeddings";
import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  UIMessage,
} from "ai";
import z from "zod";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: `
    You are Crop Doctor, an intelligent agricultural assistant.

    Workflow:
    1. If the user uploads an image:
       - Call analyzeImage → identify crop type + condition.
       - Then call getCropId with the crop name to resolve the crop ID.
       - If cropId ≠ "unknown":
         - Call getInformation with the cropId + a useful query:
           "What is {crop} {disease or condition}? How is it planted, grown, treated?"
         - Respond with a full farmer-friendly answer enriched with planting, soil, climate, care, and treatment details.
       - If cropId = "unknown":
         - Do NOT call getInformation.
         - Instead, respond with your observation from the image and clearly explain:
           "This looks like {crop name}, but no sources have been uploaded for this crop yet. I can only share my visual observation."

    2. If the user asks a text question:
       - Call getCropId if the crop is mentioned.
       - If cropId ≠ "unknown": call getInformation with cropId + query.
       - If cropId = "unknown": respond helpfully but explain that no sources exist for that crop yet.

    Rules:
    - Never expose raw tool responses.
    - Be honest when knowledge is unavailable.
    - Always keep explanations clear and farmer-friendly.
    - Use emojis 🌱🌽💧🦠✨ where applicable to make responses more engaging and friendly.
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
          if (match && match.similarity > 0.5) {
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

  return result.toUIMessageStreamResponse();
}
