# Days Until Leave

A small Astro countdown page for Friday, 29 January 2027 at 16:00 UK time (GMT).

## Run locally

```sh
bun install
bun run dev
```

Build the production site with:

```sh
bun run build
```

Astro is installed locally in this project, so use `bun run build` rather than
calling `astro build` directly.

## Deployment

This repository follows the same deployment setup as `kylescudder.co.uk`:

- Netlify's Git integration handles deployments; no checked-in GitHub Actions
  workflow is required.
- Netlify automatically detects Astro and uses `astro build` with `dist/` as
  the publish directory.
- Netlify's build-provided `URL` is used as Astro's production site URL.
- The repository keeps `bun.lock` as its single dependency lockfile, matching
  the portfolio repository.

Import `kylescudder/days-left` as a new Netlify project and select the `main`
branch for production. After that, deployments happen automatically from GitHub.

## Framed photo

The nursery frame uses `public/images/otter-family.png`.
