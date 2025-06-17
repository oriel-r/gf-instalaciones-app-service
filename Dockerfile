# syntax=docker/dockerfile:1.5

################  DEPENDENCIAS  ################
FROM node:22-slim AS deps
WORKDIR /app

COPY package*.json ./

RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
    npm ci --no-audit --no-fund --loglevel=error


################  BUILDER  ################
FROM deps AS builder
WORKDIR /app

COPY tsconfig*.json nest-cli.json ./
COPY src ./src

RUN --mount=type=cache,id=npm-cache,target=/root/.npm \
    npm run build && \
    npm prune --omit=dev && \
    npm dedupe --omit=dev && \
    # borra documentación, tests, typings y mapas de sourcemap
    find node_modules -type f \( -name "*.md" -o -name "*.markdown" \
        -o -name "LICENSE*" -o -name "*.d.ts" -o -name "*.map" \
        -o -name "*.html" -o -name "*.txt" \) -delete && \
    find node_modules -type d \( -name "test" -o -name "__tests__" \
        -o -name "tests" \) -exec rm -rf {} + && \
    npm cache clean --force


################  RUNTIME  ################
FROM gcr.io/distroless/nodejs22-debian12
WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist          ./dist

EXPOSE 8080
USER 1000:1000
CMD ["dist/main.js"]
