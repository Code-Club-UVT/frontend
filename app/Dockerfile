FROM oven/bun:latest AS build

WORKDIR /app

COPY package.json ./
RUN bun install

COPY . .

RUN bun run build



FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80 443

ENTRYPOINT ["/entrypoint.sh"]
