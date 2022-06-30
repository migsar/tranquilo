FROM node:18.4.0-alpine3.16 AS builder
WORKDIR /app
RUN corepack enable
COPY .swcrc package.json pnpm-lock.yaml /app/
COPY src /app/src/
RUN pnpm i \
  && pnpm build

# Final image
FROM node:18.4.0-alpine3.16
WORKDIR /app
EXPOSE 3030
VOLUME [ "/data" ]
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/dist/ ./
COPY public /app/public/
RUN corepack enable \
  && pnpm i -P
ENTRYPOINT [ "node", "index.js" ]
