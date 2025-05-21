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

RUN mkdir -p /usr/share/fonts/truetype/noto

# Download Noto Sans JP fonts
RUN curl -L https://fonts.gstatic.com/s/notosansjp/v53/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFLgk75vY0rw-oME.ttf -o /usr/share/fonts/truetype/noto/NotoSansJP-Black.ttf
RUN curl -L https://fonts.gstatic.com/s/notosansjp/v53/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFJEk75vY0rw-oME.ttf -o /usr/share/fonts/truetype/noto/NotoSansJP-ExtraBold.ttf
RUN curl -L https://fonts.gstatic.com/s/notosansjp/v53/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFPYk75vY0rw-oME.ttf -o /usr/share/fonts/truetype/noto/NotoSansJP-Bold.ttf
RUN curl -L https://fonts.gstatic.com/s/notosansjp/v53/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFM8k75vY0rw-oME.ttf -o /usr/share/fonts/truetype/noto/NotoSansJP-SemiBold.ttf
RUN curl -L https://fonts.gstatic.com/s/notosansjp/v53/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFCMj75vY0rw-oME.ttf -o /usr/share/fonts/truetype/noto/NotoSansJP-Medium.ttf
RUN curl -L https://fonts.gstatic.com/s/notosansjp/v53/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75vY0rw-oME.ttf -o /usr/share/fonts/truetype/noto/NotoSansJP-Regular.ttf
RUN curl -L https://fonts.gstatic.com/s/notosansjp/v53/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFE8j75vY0rw-oME.ttf -o /usr/share/fonts/truetype/noto/NotoSansJP-Light.ttf
RUN curl -L https://fonts.gstatic.com/s/notosansjp/v53/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFJEj75vY0rw-oME.ttf -o /usr/share/fonts/truetype/noto/NotoSansJP-ExtraLight.ttf
RUN curl -L https://fonts.gstatic.com/s/notosansjp/v53/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEi75vY0rw-oME.ttf -o /usr/share/fonts/truetype/noto/NotoSansJP-Thin.ttf

EXPOSE 3000

CMD ["pnpm", "start"]

