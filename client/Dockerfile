# Build stage
FROM node:24-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Build-time values are baked into Nuxt's prerendered metadata (site URL, canonicals, sitemap).
ARG NUXT_PUBLIC_SITE_URL
ARG NUXT_PUBLIC_API_BASE
ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE
RUN npm run build

# Production stage
FROM node:24-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/.output ./.output
COPY --from=build /app/public ./public

EXPOSE 3001
ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", ".output/server/index.mjs"]
