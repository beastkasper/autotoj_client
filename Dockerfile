# Prod-образ сайта на Next.js: multi-stage build -> минимальный standalone-сервер.
# Запускается как `node server.js` (не `next start`), nginx стоит перед ним.

# ---- deps: ставим зависимости отдельным слоем для кеша ----
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: собираем прод-бандл ----
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# NEXT_PUBLIC_* вшиваются в клиентский бандл на этапе сборки -> передаём как ARG.
ARG NEXT_PUBLIC_API_URL=https://api.autotoj.tj/v1/
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runner: только то, что нужно для запуска ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# output:"standalone" кладёт server.js + минимальный node_modules в .next/standalone.
# public/ и .next/static нужно докопировать отдельно.
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
