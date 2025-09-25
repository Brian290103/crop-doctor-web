import { db } from "@/db/drizzle";
import { sources, insertSourcesSchema } from "@/db/schemas/source.schema";
import { embeddings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getSlug } from "@/lib/utils";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const source = await db.query.sources.findMany({
    where: eq(sources.id, params.id),
    with: {
      embeddings: true,
    },
  });
  if (source.length === 0) {
    return NextResponse.json({ error: "Source not found" }, { status: 404 });
  }
  return NextResponse.json(source[0]);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { cropId, title, content, type, metadata } = insertSourcesSchema.parse(body);

    const slug = getSlug(title); // Generate slug from title

    const updatedSource = await db
      .update(sources)
      .set({ cropId, title, content, type, metadata, slug, updatedAt: new Date() })
      .where(eq(sources.id, params.id))
      .returning();

    if (updatedSource.length === 0) {
      return NextResponse.json({ error: "Source not found" }, { status: 404 });
    }
    return NextResponse.json(updatedSource[0]);
  } catch (error) {
    console.error("Error updating source:", error);
    return NextResponse.json({ error: "Failed to update source" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const deletedSource = await db
    .delete(sources)
    .where(eq(sources.id, params.id))
    .returning();

  if (deletedSource.length === 0) {
    return NextResponse.json({ error: "Source not found" }, { status: 404 });
  }
  return NextResponse.json({ message: "Source deleted successfully" });
}
