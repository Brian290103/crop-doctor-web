"use server";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const scrapeWebsite = async (url: string) => {
  const res = await fetch(`${BASE_URL}/api/parse/websites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Failed to scrape website");
  }

  return res.json();
};
