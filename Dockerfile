# Dockerfile (cho cả client và admin)
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .
RUN npm install && npm run build

# Stage cuối chỉ để copy dist ra ngoài (không chạy gì cả)
FROM alpine:3.18
WORKDIR /app
COPY --from=builder /app/dist /app/dist
