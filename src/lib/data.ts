import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { crops } from "@/db/schemas/crop.schema";
import { sources } from "@/db/schemas/source.schema";

export type CropRow = {
  id: string;
  name: string;
  slug: string;
};

export type SourceRow = {
  id: string;
  slug: string;
  cropId: string;
  title: string;
  content: string;
  type: string;
  metadata: unknown;
  embeddings: { id: string }[];
};

export async function getCropsData(): Promise<CropRow[]> {
  return db
    .select({ id: crops.id, name: crops.name, slug: crops.slug })
    .from(crops)
    .orderBy(crops.name);
}

export async function getCropById(
  id: string,
): Promise<CropRow | undefined> {
  const result = await db
    .select({ id: crops.id, name: crops.name, slug: crops.slug })
    .from(crops)
    .where(eq(crops.id, id))
    .limit(1);
  return result[0];
}

export async function getSourcesByCropId(cropId: string): Promise<SourceRow[]> {
  return db.query.sources.findMany({
    where: eq(sources.cropId, cropId),
    with: { embeddings: { columns: { id: true } } },
    columns: {
      id: true,
      slug: true,
      cropId: true,
      title: true,
      content: true,
      type: true,
      metadata: true,
    },
  }) as Promise<SourceRow[]>;
}

export async function getAllSourcesCount(): Promise<number> {
  const result = await db.select({ id: sources.id }).from(sources);
  return result.length;
}

export type DashboardStats = {
  totalCrops: number;
  totalSources: number;
  trainedSources: number;
  untrainedSources: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const allCrops = await db.select({ id: crops.id }).from(crops);
  const allSources = await db.query.sources.findMany({
    with: { embeddings: { columns: { id: true } } },
    columns: { id: true },
  });

  const totalCrops = allCrops.length;
  const totalSources = allSources.length;
  const trainedSources = allSources.filter(
    (s: { embeddings: { id: string }[] }) => s.embeddings.length > 0,
  ).length;

  return {
    totalCrops,
    totalSources,
    trainedSources,
    untrainedSources: totalSources - trainedSources,
  };
}
