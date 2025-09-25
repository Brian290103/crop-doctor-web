'use server';

import { db } from "@/db/drizzle";
import { embeddings, sources } from "@/db/schema";
import { generateEmbeddings } from "@/lib/embeddings";
import { eq } from "drizzle-orm";

export const createEmbeddings = async (sourceId: string) => {
  try {
    // Get the source content from database
    const [source] = await db
      .select({ content: sources.content })
      .from(sources)
      .where(eq(sources.id, sourceId));

    if (!source) {
      throw new Error("Source not found");
    }

    // Generate embeddings for the source content
    const newEmbeddings = await generateEmbeddings(source.content);

    // Store the embeddings
    await db.insert(embeddings).values(
      newEmbeddings.map((embedding) => ({
        sourceId,
        ...embedding,
      })),
    );

    return "Embeddings successfully created.";
  } catch (error) {
    console.log("error creating embeddings:", error);
    throw error;
  }
};

export const deleteEmbeddings = async (sourceId: string) => {
  try {
    await db.delete(embeddings).where(eq(embeddings.sourceId, sourceId));
    return "Embeddings successfully deleted.";
  } catch (error) {
    console.log("error deleting embeddings:", error);
    throw error;
  }
};