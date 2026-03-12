import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { crops } from "@/db/schemas/crop.schema";
import { generateEmbedding } from "@/lib/embeddings";

export async function GET() {
  const allCrops = await db.select().from(crops);
  return NextResponse.json(allCrops);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("[POST /api/crops] body:", body);
    const { name, slug } = body;
    if (!name || !slug) {
      return NextResponse.json({ error: "name and slug are required" }, { status: 400 });
    }
    const embedding = await generateEmbedding(name);
    const newCrop = await db
      .insert(crops)
      .values({ name, slug, embedding })
      .returning();
    console.log("[POST /api/crops] created:", newCrop[0]);
    return NextResponse.json(newCrop[0], { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/crops] error:", error);
    return NextResponse.json(
      { error: error?.message ?? "Failed to create crop" },
      { status: 500 },
    );
  }
}
