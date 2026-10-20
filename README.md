# Days Until Leave

An Astro countdown to Friday, 29 January 2027 at 16:00 UK time.

## Development

```sh
bun install --frozen-lockfile
bun run dev
bun x astro check
bun test src/lib/countdown.test.ts
bun run build
bun run test:e2e
```

## Production

https://days-left.kylescudder.co.uk is hosted on the host behind Cloudflare Tunnel.
Pull requests run CI. Every main push runs CI, builds AMD64 and ARM64 images,
publishes an immutable GHCR digest with GitHub provenance, and sends a signed
request through Cloudflare Access. The host independently verifies the main workflow
attestation and revision before deploying, with automatic health-check rollback.
See [deployment operations](deploy/site/README.md).

The responsive otter photo is processed by Astro into WebP assets at build time.
