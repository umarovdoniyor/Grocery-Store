# ─── Stage 1: Install dependencies ───────────────────────────────────────────
FROM node:20.10.0-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ─── Stage 2: Build Next.js app ───────────────────────────────────────────────
FROM deps AS builder
COPY . .

# NEXT_PUBLIC_* vars are baked into the JS bundle at build time.
# Pass these as build args so the bundle points to the correct backend URL.
ARG NEXT_PUBLIC_API_URL=http://localhost:4001
ARG NEXT_PUBLIC_API_GRAPHQL_URL=http://localhost:4001/graphql
ARG NEXT_PUBLIC_API_WS=ws://localhost:4001
ARG NEXT_PUBLIC_API_BASE_URL=http://localhost:4001

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_GRAPHQL_URL=$NEXT_PUBLIC_API_GRAPHQL_URL
ENV NEXT_PUBLIC_API_WS=$NEXT_PUBLIC_API_WS
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL

RUN npm run build

# ─── Stage 3: Lean production runner (Next.js standalone) ─────────────────────
FROM node:20.10.0-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

# Standalone output bundles only what's needed to run the server
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

USER node

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
