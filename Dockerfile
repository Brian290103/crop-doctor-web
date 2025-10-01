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

# Expose port
EXPOSE 3000

# Start the app
CMD ["bun", "run", "start"]
