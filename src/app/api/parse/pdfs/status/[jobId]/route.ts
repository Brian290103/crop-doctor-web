// src/app/api/parse/status/[jobId]/route.ts
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ jobId: string }> }, // 👈 fix: params is a Promise
) {
  const { jobId } = await context.params; // 👈 must await

  const apiKey = process.env.LLAMA_CLOUD_API_KEY!;
  const res = await fetch(
    `https://api.cloud.llamaindex.ai/api/v1/parsing/job/${jobId}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    },
  );

  const json = await res.json();
  return NextResponse.json(json);
}
