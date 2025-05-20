FROM node:22.15.1-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g corepack@latest &&\
    corepack enable

# 必要なパッケージのインストール
RUN apt-get update && \
    apt-get install -y wget libnss3 libatk-bridge2.0-0 libgtk-3-0 libxss1 libasound2 libgbm-dev && \
    rm -rf /var/lib/apt/lists/*

FROM base AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml* tsconfig.json tsconfig.build.json ./
COPY src ./src

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN pnpm install
RUN pnpm build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apt-get update && \
    apt-get install -y curl unzip && \
    rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/package.json /app/package.json

COPY ./fonts /usr/share/fonts/truetype/noto

EXPOSE 3000

CMD ["pnpm", "start"]

