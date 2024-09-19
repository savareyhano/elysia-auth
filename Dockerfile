FROM oven/bun:1.1-slim AS builder

WORKDIR /app

# Required for Prisma with Bun. See: https://github.com/oven-sh/bun/issues/5320#issuecomment-1730927088
# Alternatively, use 'imbios/bun-node' as the base image to avoid copying Node.
COPY --from=node:22 /usr/local/bin/node /usr/local/bin/node

COPY ./package.json ./
COPY ./bun.lockb ./
COPY ./prisma ./prisma/

RUN bun install

RUN bunx prisma generate

COPY . .

FROM oven/bun:1.1-slim

WORKDIR /app

COPY --from=builder /app .

CMD ["sh", "-c", "bun run migrate dev && bun run dev"]
