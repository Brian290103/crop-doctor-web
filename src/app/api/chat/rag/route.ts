import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";
import { createCropDoctorTools } from "./tools";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();
    let lastImageURL: string | undefined;
    for (let i = messages.length - 1; i >= 0; i--) {
      const message = messages[i];
      if (message.parts) {
        for (const part of message.parts) {
          if (
            part.type === "file" &&
            typeof part.url === "string" &&
            part.mediaType?.startsWith("image/")
          ) {
            lastImageURL = part.url;
            // Found the last image URL, no need to search further
            break;
          }
        }
      }
      if (lastImageURL) {
        break; // Found an image in this message, so it's the last one chronologically
      }
    }

    console.log("lastImageURL", lastImageURL);

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
        Always follow the flow: **Diagnosis → Treatment → Prevention**.

        Rules for reasoning and tool use:
        - If an **image** is provided:
          1. Determine if the image is of a plant. If not, politely say so.
          2. If it is a plant, determine if it is **healthy** or **sick**.
             - If healthy: respond with "The plant appears healthy" + give prevention and best practices.
             - If sick:
               - Use \`getCropName\` to identify the crop type.
               - Then use \`getDiagnosis\` with the *exact* uploaded image URL to analyze symptoms, confirm the diagnosis, and suggest treatment + prevention.
               - Then use \`getCropId\` to map the crop to the internal ID.
               - Optionally call \`getInformation\` if you need more agricultural details for a complete farmer-friendly answer.
        - If **no image** (text input):
          1. Analyze the symptoms described.
          2. Use \`getCropId\` to resolve crop.
          3. Use \`getInformation\` to expand with relevant knowledge base results.

        Response requirements:
        - Always include probable diagnosis (confidence: high, medium, or low), severity, explanation, and the crop name.
        - If uncertain: provide differential diagnosis + farmer-friendly checks farmers can perform themselves.
        - Treatment: include organic and chemical options, dosage, and safety tips.
        - Prevention: resistant varieties, cultural practices, irrigation, and early warning signs.
        - Use emojis 🌽🌱💧 for clarity.
        - If no crop info available, say honestly: “No sources available yet.”
        - Never fabricate or invent image URLs. Always use the exact uploaded URL.
        - Never expose raw tool outputs. Rewrite responses in simple farmer-friendly language.
        - Only answer crop health, diseases, diagnosis, treatment, and prevention. Politely decline unrelated questions.

      `,

      stopWhen: stepCountIs(6),

      messages: convertToModelMessages(messages),
      tools: createCropDoctorTools(lastImageURL),
    });

    // console.log("reasoningText:", result.reasoningText);
    // console.log("result:", result);
    return result.toUIMessageStreamResponse({ sendReasoning: true });
  } catch (error) {
    console.error("An error occurred:", error);
    return new Response("An unexpected error occurred.", { status: 500 });
  }
}
