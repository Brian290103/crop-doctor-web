import { tool } from "ai";
import z from "zod";
import { findRelevantContent, findSimilarCrop } from "@/lib/embeddings";

export const createCropDoctorTools = (lastImageURL?: string) => ({
  // New tool for identifying crop name
  getCropName: tool({
    description: `
          Identifies the specific crop type from an uploaded image.
          Use this tool when an image is provided and you need to identify the crop before diagnosing issues.
        `,
    inputSchema: z.object({
      imageUrl: z
        .string()
        .url()
        .describe("The exact URL of the user's uploaded image"),
    }),
    execute: async ({ imageUrl }) => {
      imageUrl = lastImageURL ?? imageUrl; // Ensure the lastImageURL is used if available

      console.log("getCropName imageUrl", imageUrl);
      const endpoint = "https://plant.id/api/v3/identification";
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": "0Pfv1KvBXcMgXslgMtayWPt15oA80tXM5BrAiHPuiKcrZblg2v",
        },
        body: JSON.stringify({ images: [imageUrl] }),
      };

      try {
        const response = await fetch(endpoint, options);

        if (!response.ok) {
          const errorData = await response.text();
          console.error(
            `Plant.id identification API error: ${response.status} ${response.statusText}`,
            errorData,
          );
          return {
            error: `Failed to identify crop: ${response.status} ${response.statusText}`,
            details: errorData,
          };
        }

        const data = await response.json();
        const firstSuggestion =
          data.result?.classification?.suggestions?.[0];

        if (firstSuggestion && firstSuggestion.name) {
          return {
            cropName: firstSuggestion.name,
            probability: firstSuggestion.probability,
          };
        } else {
          return {
            message:
              "No specific crop identification found for the image.",
            rawData: data,
          };
        }
      } catch (error) {
        console.error(
          "Error during crop identification API call:",
          error,
        );
        return {
          error:
            "An unexpected error occurred while identifying the crop.",
          details: (error as Error).message,
        };
      }
    },
  }),

  // Renamed 'analyzeImage' to 'getDiagnosis'
  getDiagnosis: tool({
    description: `
          Analyzes an uploaded image of a crop for visible symptoms and possible diseases.
          Use this after identifying the crop type, especially if the plant appears sick.
        `,
    inputSchema: z.object({
      imageUrl: z
        .string()
        .url()
        .describe("The exact URL of the user's uploaded image"),
      cropName: z
        .string()
        .optional() // Make cropName optional as it might come from getCropName first
        .describe("The identified crop name, if already known."),
    }),
    execute: async ({ imageUrl, cropName }) => {
      imageUrl = lastImageURL ?? imageUrl;

      console.log("getDiagnosis imageUrl", imageUrl);
      const endpoint =
        "https://plant.id/api/v3/health_assessment?details=local_name%2Cdescription%2Curl%2Ctreatment%2Cclassification%2Ccommon_names%2Ccause";

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Api-Key": "0Pfv1KvBXcMgXslgMtayWPt15oA80tXM5BrAiHPuiKcrZblg2v",
        },
        body: JSON.stringify({ images: [imageUrl] }),
      };

      try {
        const response = await fetch(endpoint, options);

        if (!response.ok) {
          const errorData = await response.text();
          console.error(
            `Plant.id API error: ${response.status} ${response.statusText}`,
            errorData,
          );
          return {
            error: `Failed to analyze image: ${response.status} ${response.statusText}`,
            details: errorData,
          };
        }

        const data = await response.json();

        // As per prompt, return only the 1st outcome for suggestions
        const firstSuggestion = data.result?.disease?.suggestions?.[0];
        console.log("firstSuggestion", firstSuggestion);
        if (firstSuggestion) {
          const details = firstSuggestion.details;

          return {
            name: firstSuggestion.name,
            probability: firstSuggestion.probability,
            description: details?.description,
            url: details?.url,
            treatment: {
              chemical: details?.treatment?.chemical || [],
              biological: details?.treatment?.biological || [],
              prevention: details?.treatment?.prevention || [],
            },
            classification: details?.classification || [],
            common_names: details?.common_names || [],
            cause: details?.cause,
          };
        } else {
          // Check if it's healthy explicitly if no disease is found
          const isHealthy = data.result?.is_healthy?.binary === true;
          if (isHealthy) {
            return {
              message: "The plant appears healthy.",
              cropName: cropName, // Include cropName for context if identified
            };
          }
          return {
            message:
              "No specific disease suggestions found for the image and the plant does not appear explicitly healthy.",
            rawData: data, // Include raw data for debugging if needed
          };
        }
      } catch (error) {
        console.error("Error during image diagnosis API call:", error);
        return {
          error:
            "An unexpected error occurred while analyzing the image for diagnosis.",
          details: (error as Error).message,
        };
      }
    },
  }),

  getCropId: tool({
    description:
      "Resolve a crop name to an internal crop ID. Use this before calling getInformation. This tool is for mapping an identified crop name to an internal ID.",
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
});