#stage 1

FROM node:24 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build

#stage 2
FROM node:24-alpine AS runner
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app

COPY --from=builder /app/dist ./dist
COPY --from=builder  /app/package*.json ./

RUN npm ci --omit=dev

RUN chown -R app:app /app

USER app

EXPOSE 6000
CMD [ "node", "dist/server.js" ]
