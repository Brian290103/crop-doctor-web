import { db } from "@/db/drizzle";
import { crops } from "@/db/schemas/crop.schema";
import { generateEmbedding } from "@/lib/embeddings";
import { NextResponse } from "next/server";

export async function GET() {
  const allCrops = await db.select().from(crops);
  return NextResponse.json(allCrops);
}

export async function POST(req: Request) {
  const { name, slug } = await req.json();
  const embedding = await generateEmbedding(name);
  const newCrop = await db
    .insert(crops)
    .values({ name, slug, embedding })
    .returning();
  return NextResponse.json(newCrop);
}
