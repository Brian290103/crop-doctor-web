import { db } from "@/db/drizzle";
import { crops, embeddings, sources } from "@/db/schema";
import { google } from "@ai-sdk/google";
import { embed, embedMany } from "ai";
import { and, cosineDistance, desc, eq, gt, sql } from "drizzle-orm";

const embeddingModel = google.textEmbedding("text-embedding-004");

export const generateChunks = (
  input: string,
  size = 1000,
  overlap = 200,
): string[] => {
  const text = input.trim().replace(/\s+/g, " "); // normalize spaces
  const chunks: string[] = [];
  let i = 0;

  while (i < text.length) {
    const end = i + size;
    chunks.push(text.slice(i, end));
    i += size - overlap; // slide forward with overlap
  }

  return chunks;
};

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
    providerOptions: {
      google: {
        dimensions: 1024, // 👈 force 1024-dim instead of 3072
      },
    },
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll("\n", " ");
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
    providerOptions: {
      google: {
        dimensions: 1024, // 👈 force 1024-dim instead of 3072
      },
    },
  });
  return embedding;
};

export const findRelevantContent1 = async (
  userQuery: string,
  chatbotId: string,
) => {
  // Generate the embedding for the query
  const userQueryEmbedded = await generateEmbedding(userQuery);

  // Similarity calculation
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded,
  )})`;

  // Join embeddings -> resources and filter by chatbotId
  const similarGuides = await db
    .select({
      name: embeddings.content,
      similarity,
      sourceId: embeddings.sourceId,
    })
    .from(embeddings)
    .innerJoin(sources, eq(embeddings.sourceId, sources.id))
    .where(
      and(
        eq(sources.cropId, chatbotId), // <-- restrict by chatbot
        gt(similarity, 0.5), // <-- only relevant matches
      ),
    )
    .orderBy((t) => desc(t.similarity))
    .limit(4);

  // console.log("similarGuides", similarGuides);

  return similarGuides;
};
export const findRelevantContent = async (
  userQuery: string,
  cropId?: string,
) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const similarity = sql<number>`1 - (${cosineDistance(
    embeddings.embedding,
    userQueryEmbedded,
  )})`;

  const whereClauses = [gt(similarity, 0.7)];
  if (cropId && cropId !== "unknown") {
    whereClauses.push(eq(sources.cropId, cropId));
  }

  const similarGuides = await db
    .select({
      name: embeddings.content,
      similarity,
      sourceId: embeddings.sourceId,
    })
    .from(embeddings)
    .innerJoin(sources, eq(embeddings.sourceId, sources.id))
    .where(and(...whereClauses))
    .orderBy((t) => desc(t.similarity))
    .limit(4);

  console.log("similarGuides", similarGuides);
  return similarGuides;
};

export const findSimilarCrop = async (cropName: string) => {
  const cropNameEmbedding = await generateEmbedding(cropName);

  const similarity = sql<number>`1 - (${cosineDistance(
    crops.embedding,
    cropNameEmbedding,
  )})`;

  const [topMatch] = await db
    .select({
      id: crops.id,
      name: crops.name,
      slug: crops.slug,
      similarity,
    })
    .from(crops)
    .orderBy(desc(similarity))
    .limit(1);
  console.log("topMatch", topMatch);
  return topMatch;
};
