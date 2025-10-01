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
ENV NEXT_PUBLIC_SUPABASE_URL=dummy
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy
ENV DATABASE_URL=dummy

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
