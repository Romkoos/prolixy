FROM node:20-alpine AS builder
WORKDIR /app

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY package.json package-lock.json tsconfig.base.json ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY apps/api/package.json apps/api/package.json
COPY packages/shared/package.json packages/shared/package.json
COPY services/scrapper/package.json services/scrapper/package.json
COPY services/poster/package.json services/poster/package.json
COPY apps/frontend apps/frontend

RUN npm ci
RUN npm run build -w apps/frontend

FROM nginx:1.27-alpine AS runtime
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
