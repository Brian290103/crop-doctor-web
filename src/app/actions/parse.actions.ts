"use server";

export const scrapeWebsite = async (url: string) => {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    throw new Error("Missing FIRECRAWL_API_KEY — configure it in your environment.");
  }

  const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
  });

  if (!res.ok) {
    const text = await res.text();
    let msg = "Firecrawl scrape failed";
    try { msg = JSON.parse(text)?.error ?? text ?? msg; } catch {}
    throw new Error(msg);
  }

  const result = await res.json();
  const markdown = result.data?.markdown;
  if (!markdown) throw new Error("No markdown content returned from Firecrawl.");

  return {
    markdown,
    metadata: result.data?.metadata ?? null,
  };
};
