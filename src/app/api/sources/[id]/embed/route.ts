import { NextResponse } from "next/server";
import { trainSourceEmbeddings } from "@/app/actions/source.actions";

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const sourceId = params.id;
    const result = await trainSourceEmbeddings(sourceId);

    if (result.success) {
      return NextResponse.json({ message: result.message }, { status: 200 });
    } else {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in /api/sources/[id]/embed:", error);
    return NextResponse.json(
      { error: "Failed to process embedding request." },
      { status: 500 },
    );
  }
}
