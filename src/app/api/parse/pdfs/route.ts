// src/app/api/parse/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File;

  if (!file || file.type !== 'application/pdf') {
    return NextResponse.json({ error: 'Invalid PDF file' }, { status: 400 });
  }

  const apiKey = process.env.LLAMA_CLOUD_API_KEY!;
  const llamaRes = await fetch(
    'https://api.cloud.llamaindex.ai/api/v1/parsing/upload',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json',
      },
      body: (() => {
        const fd = new FormData();
        fd.set('file', file, file.name);
        return fd;
      })(),
    }
  );

  const result = await llamaRes.json();
  return NextResponse.json(result);
}
