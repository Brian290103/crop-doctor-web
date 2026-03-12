"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db/drizzle";
import { crops } from "@/db/schemas/crop.schema";
import { generateEmbedding } from "@/lib/embeddings";
import { getSlug } from "@/lib/utils";

function revalidateAll() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/sources");
  revalidatePath("/dashboard/sources/[cropId]", "page");
}

export const getCrops = async () => {
  return db.select().from(crops);
};

export const getCrop = async (id: string) => {
  const [crop] = await db.select().from(crops).where(eq(crops.id, id));
  return crop ?? null;
};

export const createCrop = async (data: { name: string }) => {
  console.log("[createCrop]", data);
  const slug = getSlug(data.name);
  const embedding = await generateEmbedding(data.name);
  const [newCrop] = await db
    .insert(crops)
    .values({ name: data.name, slug, embedding })
    .returning();
  revalidateAll();
  return newCrop;
};

export const updateCrop = async (id: string, data: { name: string }) => {
  console.log("[updateCrop]", id, data);
  const slug = getSlug(data.name);
  const embedding = await generateEmbedding(data.name);
  const [updated] = await db
    .update(crops)
    .set({ name: data.name, slug, embedding })
    .where(eq(crops.id, id))
    .returning();
  revalidateAll();
  return updated;
};

export const deleteCrop = async (id: string) => {
  console.log("[deleteCrop]", id);
  const [deleted] = await db
    .delete(crops)
    .where(eq(crops.id, id))
    .returning();
  revalidateAll();
  return deleted;
};
