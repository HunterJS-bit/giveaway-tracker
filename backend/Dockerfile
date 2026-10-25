# Use Node 22 slim for build
FROM node:22-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Use Node 22 slim for runtime
FROM node:22-slim
WORKDIR /app
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build /app/src ./src

EXPOSE 3000
CMD ["sh", "-c", "npx drizzle-kit push && npm start"]
