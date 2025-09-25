import { db } from "@/db/drizzle";
import { crops } from "@/db/schemas/crop.schema";
import { generateEmbedding } from "@/lib/embeddings";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const crop = await db.select().from(crops).where(eq(crops.id, params.id));
  return NextResponse.json(crop); 
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { name, slug } = await req.json();
  const embedding = await generateEmbedding(name);
  const updatedCrop = await db
    .update(crops)
    .set({ name, slug, embedding })
    .where(eq(crops.id, params.id))
    .returning();
  return NextResponse.json(updatedCrop);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const deletedCrop = await db
    .delete(crops)
    .where(eq(crops.id, params.id))
    .returning();
  return NextResponse.json(deletedCrop);
}
