import type { NextConfig } from "next";

console.log("🔎 Checking environment variables in Next.js build...");

const requiredEnvs = [
  "DATABASE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "GOOGLE_GENERATIVE_AI_API_KEY",
  "FIRECRAWL_API_KEY",
  "LLAMA_CLOUD_API_KEY",
];

for (const key of requiredEnvs) {
  if (!process.env[key]) {
    console.error(`❌ Missing env: ${key}`);
  } else {
    console.log(
      `✅ ${key} is set:`,
      process.env[key]?.substring(0, 15) + "...",
    );
  }
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "wwlehrlckcxxitlzayda.supabase.co",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
