# Dev-образ сайта на Next.js (hot-reload через bind-mount исходников).
FROM node:22-alpine

# libc6-compat нужен нативным бинарникам Next/SWC на musl-alpine.
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]
