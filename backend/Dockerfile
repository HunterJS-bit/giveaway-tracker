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
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# Also copy src for development purposes (watch)
COPY --from=build /app/src ./src
COPY --from=build /app/tsconfig.json ./tsconfig.json
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts

EXPOSE 3000
CMD ["sh", "-c", "npx drizzle-kit push && npm run dev"]
