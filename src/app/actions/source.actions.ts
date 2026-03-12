"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { crops } from "@/db/schemas/crop.schema";
import { sources } from "@/db/schemas/source.schema";
import { getSlug } from "@/lib/utils";
import { createEmbeddings } from "./embedding.actions";

function revalidateAll() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/sources");
  revalidatePath("/dashboard/sources/[cropId]", "page");
}

export const getSources = async (cropId?: string) => {
  if (cropId) {
    return db.query.sources.findMany({
      where: eq(sources.cropId, cropId),
      with: { embeddings: true },
    });
  }
  return db.query.sources.findMany({ with: { embeddings: true } });
};

export const getSource = async (id: string) => {
  const source = await db.query.sources.findFirst({
    where: eq(sources.id, id),
    with: { embeddings: true },
  });
  return source ?? null;
};

export const createSource = async (data: {
  cropId: string;
  title: string;
  content: string;
  type: string;
  metadata?: any;
}) => {
  console.log("[createSource]", { ...data, content: data.content?.slice(0, 50) });

  const existingCrop = await db.select().from(crops).where(eq(crops.id, data.cropId));
  if (existingCrop.length === 0) {
    throw new Error("Crop with the provided ID does not exist.");
  }

  const slug = getSlug(data.title);
  const existing = await db.select().from(sources).where(eq(sources.slug, slug));
  if (existing.length > 0) {
    throw new Error("A source with this title already exists.");
  }

  const [newSource] = await db
    .insert(sources)
    .values({
      cropId: data.cropId,
      title: data.title,
      content: data.content,
      type: data.type as any,
      metadata: data.metadata,
      slug,
    })
    .returning();

  revalidateAll();
  return newSource;
};

export const updateSource = async (
  id: string,
  data: { cropId?: string; title?: string; content?: string; type?: string; metadata?: any },
) => {
  console.log("[updateSource]", id, data);
  const slug = data.title ? getSlug(data.title) : undefined;
  const [updated] = await db
    .update(sources)
    .set({ ...data, ...(slug ? { slug } : {}), type: data.type as any, updatedAt: new Date() })
    .where(eq(sources.id, id))
    .returning();
  if (!updated) throw new Error("Source not found.");
  revalidateAll();
  return updated;
};

export const deleteSource = async (id: string) => {
  console.log("[deleteSource]", id);
  const [deleted] = await db.delete(sources).where(eq(sources.id, id)).returning();
  if (!deleted) throw new Error("Source not found.");
  revalidateAll();
  return deleted;
};

export const trainSourceEmbeddings = async (sourceId: string) => {
  try {
    await createEmbeddings(sourceId);
    revalidateAll();
    return { success: true, message: "Embeddings created successfully." };
  } catch (error) {
    console.error("Error training source embeddings:", error);
    return { success: false, message: "Failed to create embeddings." };
  }
};
