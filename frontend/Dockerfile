# ========== Stage 1: Base image ==========

FROM node:18-alpine AS base

RUN npm install -g pnpm@7.0.0

# ========== Stage 2: Dependencies ==========

FROM base AS deps

WORKDIR /app

COPY package.json ./

RUN pnpm install 

# ========== Stage 3: Build ==========

FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NODE_ENV=production
ENV PORT=3000

RUN pnpm build

EXPOSE 3000

CMD ["pnpm", "start"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1
