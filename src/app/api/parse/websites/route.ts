import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Invalid or missing "url"' }, { status: 400 });
    }

    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Missing FIRECRAWL_API_KEY' }, { status: 500 });
    }

    const firecrawlRes = await fetch('https://api.firecrawl.dev/v2/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url,
        formats: ['markdown'],
        onlyMainContent: true
        // optionally: waitFor, maxAge, actions, etc.
      })
    });

    if (!firecrawlRes.ok) {
      const errText = await firecrawlRes.text();
      return NextResponse.json({ error: errText || 'Firecrawl scrape failed' }, { status: firecrawlRes.status });
    }

    const result = await firecrawlRes.json();
    const markdown = result.data?.markdown;
    if (!markdown) {
      return NextResponse.json({ error: 'No markdown returned' }, { status: 500 });
    }

    return NextResponse.json({ markdown, metadata: result.data.metadata || null });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
