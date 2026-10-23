# Build stage
FROM node:24-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:24-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/.output ./.output
COPY --from=build /app/public ./public

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", ".output/server/index.mjs"]
