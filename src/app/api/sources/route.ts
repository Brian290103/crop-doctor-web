import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { crops } from "@/db/schemas/crop.schema"; // Import crops schema
import { insertSourcesSchema, sources } from "@/db/schemas/source.schema";
import { getSlug } from "@/lib/utils";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cropId = searchParams.get("cropId");
  console.log("cropId", cropId);

  let allSources;
  if (cropId) {
    allSources = await db.query.sources.findMany({
      where: eq(sources.cropId, cropId),
      with: {
        embeddings: true,
      },
    });
    console.log("allSources", allSources);
  } else {
    allSources = await db.query.sources.findMany({
      with: {
        embeddings: true,
      },
    });
    console.log("allSources", allSources);
  }
  return NextResponse.json(allSources);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Incoming request body:", body);
    const parsedBody = insertSourcesSchema.parse(body);
    console.log("Parsed body:", parsedBody);
    const { cropId, title, content, type, metadata } = parsedBody;

    // 1. Check if cropId exists
    const existingCrop = await db
      .select()
      .from(crops)
      .where(eq(crops.id, cropId));
    if (existingCrop.length === 0) {
      return NextResponse.json(
        { error: "Crop with provided ID does not exist." },
        { status: 404 },
      );
    }

    const slug = getSlug(title); // Generate slug from title

    // 2. Check if slug is unique
    const existingSourceWithSlug = await db
      .select()
      .from(sources)
      .where(eq(sources.slug, slug));
    if (existingSourceWithSlug.length > 0) {
      return NextResponse.json(
        { error: "Source with this title (slug) already exists." },
        { status: 409 },
      );
    }

    const newSource = await db
      .insert(sources)
      .values({
        cropId,
        title,
        content,
        type,
        metadata,
        slug,
      })
      .returning();
    return NextResponse.json(newSource, { status: 201 });
  } catch (error: any) {
    console.error("Error creating source:", error);
    let errorMessage = "Failed to create source";
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (error.issues) {
      // ZodError has an 'issues' property
      errorMessage = error.issues.map((issue: any) => issue.message).join(", ");
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
