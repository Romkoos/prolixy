FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY services/scrapper/package.json services/scrapper/package.json
COPY apps/api/package.json apps/api/package.json
COPY apps/frontend/package.json apps/frontend/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY services/poster/package.json services/poster/package.json
COPY database/prisma database/prisma
COPY packages/shared packages/shared
COPY services/scrapper services/scrapper

RUN npm ci
RUN npm run build -w packages/shared
RUN npm run prisma:generate
RUN npm run build -w services/scrapper

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json tsconfig.base.json ./
COPY services/scrapper/package.json services/scrapper/package.json
COPY apps/api/package.json apps/api/package.json
COPY apps/frontend/package.json apps/frontend/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY services/poster/package.json services/poster/package.json
RUN npm ci --omit=dev

COPY --from=builder /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma /app/node_modules/@prisma
COPY --from=builder /app/services/scrapper/dist /app/services/scrapper/dist
COPY --from=builder /app/packages/shared/dist /app/packages/shared/dist
COPY database/prisma /app/database/prisma

WORKDIR /app/services/scrapper
CMD ["node", "dist/index.js"]
