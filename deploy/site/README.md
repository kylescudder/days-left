# Days Left on Herman

Checkout: `/Users/kyle/platform/apps/days-left`.
Public site: `https://days-left.kylescudder.co.uk`.
Upstream: `days-left:8080` on `platform-web`, with no host ports or database.
Static Astro output runs in an unprivileged Caddy container.

## Release pipeline

`.github/workflows/site-ci.yml` checks types, countdown logic, production build,
webhook authentication, provenance rejection and rollback, and container startup.
`deploy-site.yml` builds both architectures, publishes `ghcr.io/kylescudder/days-left`
and provenance, then requests CD using its immutable digest and commit revision.

Cloudflare Access protects `deploy-days-left.kylescudder.co.uk` using the dedicated
`github-days-left-deploy` service token. Only `/hooks/days-left` is routed to the
receiver. Its HMAC-signed requests enter a bounded queue; the receiver has no
Docker socket, host port or database access.

LaunchAgent `com.herman.days-left-deploy` consumes requests as the Colima owner.
It verifies GitHub provenance from this repository's `deploy-site.yml`, main and
GitHub-hosted runners before pulling an image. Failed health checks restore the
previous image. GitHub checks the public revision after CD.

## Configuration

GitHub environment `production` permits main only. Its secrets are
`CF_ACCESS_CLIENT_ID`, `CF_ACCESS_CLIENT_SECRET`, `DEPLOY_WEBHOOK_SECRET`.
Repository variables: `DEPLOY_ENABLED=true` and
`SITE_BASE_URL=https://days-left.kylescudder.co.uk`.

Private host files, ignored by Git: `.env` (pinned image), `.env.deploy-hook`
(queue paths and UID/GID), `secrets/deploy-webhook-secret` (HMAC), and
`secrets/cloudflare-access.json` (dedicated Access credentials). Secret files
are mode 0600 and private directories 0700. Deployment state is under `state/`.

## Operate

```sh
docker compose -f deploy/site/compose.deploy-hook.yaml --env-file .env.deploy-hook up -d --wait
python3 -B deploy/site/install-launchd.py
launchctl print gui/501/com.herman.days-left-deploy
tail -n 100 state/deploy.log
./deploy/site/herman-deploy.sh sha256:<verified-main-digest>
```

Pause with `gh variable set DEPLOY_ENABLED --body false --repo kylescudder/days-left`.
The manual digest command also verifies provenance and can restore a prior release.
Host deployment tooling changes require an explicit checkout update; routine site
releases are images. Kyle's login session and Colima must be running.
