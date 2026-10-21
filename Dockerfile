FROM oven/bun:1.4.3@sha256:ec06c3b6cea04192ae6770c434f668ca41d343ad19fa6472216c7b48be39c598 AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN BUN_CONFIG_MAX_HTTP_REQUESTS=16 bun install --frozen-lockfile
COPY astro.config.mjs tsconfig.json ./
COPY src ./src
COPY public ./public
ENV URL=https://days-left.kylescudder.co.uk
RUN bun run build

FROM caddy:2.11.7@sha256:8dc9fa87b36b25303d1c67d2a09f5824b7f3bfd72cb052f246e5da2133fe29a8
# Port 8080 needs no privileged bind capability; drop the upstream file capability
# so the binary can execute with the runtime capability set empty.
RUN setcap -r /usr/bin/caddy
COPY --from=build /app/dist /srv
COPY Caddyfile /etc/caddy/Caddyfile
ARG DAYS_LEFT_REVISION=development
ENV DAYS_LEFT_REVISION=${DAYS_LEFT_REVISION}
USER 1000:1000
EXPOSE 8080
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile", "--adapter", "caddyfile"]
