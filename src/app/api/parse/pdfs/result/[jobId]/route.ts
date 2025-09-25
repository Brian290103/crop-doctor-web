import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ jobId: string }> }, // 👈 params is a Promise
) {
  const { jobId } = await context.params; // 👈 await it

  const apiKey = process.env.LLAMA_CLOUD_API_KEY!;
  const res = await fetch(
    `https://api.cloud.llamaindex.ai/api/v1/parsing/job/${jobId}/result/markdown`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
    },
  );

  const text = await res.json();
  console.log("response text", text);

  return NextResponse.json(text);
}
