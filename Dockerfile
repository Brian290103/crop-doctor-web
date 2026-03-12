# ---------------------------
# 1. Base image with Bun
# ---------------------------
FROM oven/bun:1.2.19 AS base
WORKDIR /app

# ---------------------------
# 2. Install dependencies
# ---------------------------
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ---------------------------
# 3. Build Next.js app
# ---------------------------
COPY . .

# ✅ Supply dummy envs so Next.js build doesn’t crash
ENV NEXT_PUBLIC_SUPABASE_URL=https://wwlehrlckcxxitlzayda.supabase.co \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3bGVocmxja2N4eGl0bHpheWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTczMDksImV4cCI6MjA2OTY5MzMwOX0.C6r_RMBAKWKK-4eyR6khdaap1H-_ouo6iqpb3GYNrvg \
    DATABASE_URL=postgresql://neondb_owner:npg_EgfybGC84tiQ@ep-delicate-sound-ad1jt6wp-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require \
    GOOGLE_GENERATIVE_AI_API_KEY=duAIzaSyBOemHBi1K-BJWrHlPTsF0hLj7V0U_PxN4mmy \
    FIRECRAWL_API_KEY=fc-1a31cc348432485087bbefd8707ad612 \
    LLAMA_CLOUD_API_KEY=llx-LGRbMFmIdUj3EgfuAxztz6k86atOkdv42Fkf3JBFNwqG82S1

RUN bun run build

# ---------------------------
# 4. Production image
# ---------------------------
FROM oven/bun:1.2.19 AS runner
WORKDIR /app

# Copy only required files from build stage
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/node_modules ./node_modules

# ✅ Now real env vars will be injected by Coolify at runtime
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start the app
CMD ["bun", "run", "start"]
