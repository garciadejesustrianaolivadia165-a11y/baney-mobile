FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV CI=1
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run export:web

FROM nginxinc/nginx-unprivileged:stable-alpine
COPY deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=20s --timeout=5s --start-period=10s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
