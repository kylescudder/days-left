# Days Left on the host

## Shared deployment service

This app is registered as `days-left` in the central deployment registry
`/Users/kyle/platform/deploy-core/apps.json`. LaunchAgent
`com.kylescudder.deploy-core` runs the single installed engine. Application hooks
are `deploy/site/hooks.py`; the receiver, credentials, queues,
state and database contracts below remain app-specific. Manual deployment uses
`./deploy/site/host-deploy.sh sha256:<digest>`.

Engine updates, application registration, failure inspection and service rollback
are documented in [deploy-core](https://github.com/kylescudder/deploy-core).
There are no vendored engine files, lock files or sync PRs. Do not install an
app-specific LaunchAgent. Apply future engine changes once through the central service.

Checkout: `/Users/kyle/platform/apps/days-left`.
Public site: `https://days-left.kylescudder.co.uk`.
Upstream: `days-left:8080` on `platform-web`, with no host ports or database.
Static Astro output runs in an unprivileged Caddy container.

## Deployer

Application-specific behavior is in `hooks.py`; deployment definitions are central.

## Release pipeline

`.github/workflows/site-ci.yml` checks types, countdown logic, production build,
webhook authentication, provenance rejection and rollback, and container startup.
`deploy-site.yml` builds both architectures, publishes `ghcr.io/kylescudder/days-left`
and provenance, then requests CD using its immutable digest and commit revision.

Cloudflare Access protects `deploy-days-left.kylescudder.co.uk` using the dedicated
`github-days-left-deploy` service token. Only `/hooks/days-left` is routed to the
receiver. Its HMAC-signed requests enter a bounded queue; the receiver has no
Docker socket, host port or database access.

LaunchAgent `com.kylescudder.deploy-core` consumes requests as the Colima owner.
It verifies GitHub provenance from this repository's `deploy-site.yml`, main and
GitHub-hosted runners before pulling an image. Failed health checks restore the
previous image. The host checks the built page and its CSS/image assets before publishing a completed
acceptance record. GitHub waits for that record to match both the image digest and
commit, as well as the public revision. A responding candidate alone cannot pass CD.

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
launchctl print gui/501/com.kylescudder.deploy-core
tail -n 100 state/deploy.log
./deploy/site/host-deploy.sh sha256:<verified-main-digest>
```

Pause with `gh variable set DEPLOY_ENABLED --body false --repo kylescudder/days-left`.
The manual digest command also verifies provenance and can restore a prior release.
Host deployment tooling changes require an explicit checkout update; routine site
releases are images. Kyle's login session and Colima must be running.

## Migration acceptance

Netlify project `days-left-kr` was deleted on 16 October 2026; its hostname returns 404. The original DNS record is historical evidence only and must not be restored:
recover using a retained the host image or rebuild the recorded revision. This is a
static site with no database, external authentication or Convex project to retire.
The platform backup automatically includes this app's private deployment credentials,
Compose files, host deploy tooling and release state; source and images are rebuilt
from GitHub. The Sunday 03:00 encrypted NAS schedule remains unchanged.

The 17 October acceptance test changes the footer from “One day at a time. You've
got this.” to “One day closer to our sweetest chapter.” and exercises a real main
push through CI, provenance, Cloudflare delivery and completed host acceptance.
Before/after screenshots and final results are recorded under the platform's
`verification/days-left-deployment.json` and `verification/days-left-cicd/`.
