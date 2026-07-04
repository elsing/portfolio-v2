# Analytics, AI Logging & Admin Panel — Host Setup Guide

Everything in the codebase is done. This guide covers the one-time setup on the
Docker host (where the self-hosted runner deploys to). Do staging first, prove
it works, then repeat for prod.

## What got added (mental model)

| Piece | Where it runs | Reachable from |
|---|---|---|
| SQLite file (folio-ai prompt logs) | bind mount on host, written by main app | filesystem only |
| Heatmaps + session replay | Umami's built-in feature (v3.2+, `recorder.js`) | via Umami dashboard |
| Umami | **separately-run, shared instance** — not part of this repo | script/collect must be public |
| Admin panel | new container, port 9000/9001 | **LAN/WireGuard only** |

Umami is intentionally not bundled into this repo's compose files. It supports
multiple "websites" under one instance, so if you already run (or will run)
Umami for other projects, add this site to that shared instance rather than
standing up a dedicated Umami + Postgres pair just for this repo. If Umami is
ever offline, nothing on the site breaks — the tracking tag is a plain
`next/script` that loads asynchronously; a failed load just means no analytics
data for that window, silently.

Don't have that shared instance yet? See [umami-standalone.md](./umami-standalone.md)
for the compose config and env files to stand it up once.

## Step 1 — Run the setup script

`scripts/setup-env.sh` scaffolds one base directory per environment
(default `/opt/portfolio/<env>/`, override the root with `PORTFOLIO_ROOT`):
`.env` (main app runtime), `.env.admin` (admin panel), and `data/` (shared
SQLite dir) — with secrets generated for you (`openssl rand -hex 32` under
the hood). Safe to re-run — it never overwrites an existing file, and if
`.env` already has content it only appends the keys that are missing.

```sh
cd /path/to/portfolio-v2
./scripts/setup-env.sh staging
./scripts/setup-env.sh prod
```

It'll ask for an admin panel password (or press enter to auto-generate one —
it'll print what it chose). `IP_HASH_SALT` and `SESSION_SECRET` are generated
automatically. Afterwards, copy your Ollama/Kuma values and
`system-prompt.txt` into each environment's base dir (the script prints
exactly what's left to do).

Deployed images get the `NEXT_PUBLIC_*` analytics values baked in by the
GitHub build workflow from repository Variables (step 2) — they're only
needed in a local `.env` for `npm run dev`.

## Step 2 — Set the GitHub repository Variables

Under **Settings → Secrets and variables → Actions → Variables**, add:

| Variable | Value |
|---|---|
| `PORTFOLIO_BASE_PROD` | prod base dir (e.g. `/opt/portfolio/prod`) — holds `env/` + `data/` |
| `PORTFOLIO_BASE_STAGING` | staging base dir (e.g. `/opt/portfolio/staging`) |
| `PROD_ENABLE_ANALYTICS` / `STAGING_ENABLE_ANALYTICS` | `true` once Umami is set up (step 3) |
| `PROD_UMAMI_URL` / `STAGING_UMAMI_URL` | instance base, e.g. `https://analytics.singer.systems` (`script.js`/`recorder.js` derived) |
| `PROD_UMAMI_WEBSITE_ID` / `STAGING_UMAMI_WEBSITE_ID` | from Umami's dashboard (step 3) |
| `PROD_ENABLE_REPLAY` / `STAGING_ENABLE_REPLAY` | session replay + heatmaps — **defaults on** when analytics is on; set `false` to opt out (also needs the Replay toggle on the website in Umami's dashboard) |
| `PORTFOLIO_PORT[_STAGING]` / `ADMIN_PORT[_STAGING]` | optional host-port overrides (defaults 3000/9000 prod, 3001/9001 staging) |

The base dir layout is what `scripts/setup-env.sh` creates: `.env`,
`.env.admin`, `system-prompt.txt`, `data/`. If the runner is containerized,
mount each base dir into it **at the same path** — compose reads the env
files from the runner's filesystem while the Docker daemon resolves the bind
mounts on the host, so the paths must be valid in both.

Each deploy also copies the environment's compose file into the base dir, so
the canonical, running definition lives on the host at
`<base>/docker-compose.yml` — and because the `.env` beside it contains
`PORTFOLIO_BASE`, you can manage the stack manually from that directory with
plain `docker compose ps / logs / down`, no environment setup needed.

Variables (unlike the repo) are not publicly visible — this is what keeps your
host paths out of the public compose files. The Umami values aren't secret
(they ship in the JS bundle anyway), they just live here so builds are
reproducible in GitHub's cloud runners.

## Step 3 — Point at your shared Umami instance

Don't have a shared Umami instance running yet? Set one up first — see
[umami-standalone.md](./umami-standalone.md). Then:

1. In your Umami dashboard: Settings → Websites → Add website (one entry per
   environment) → copy each **Website ID** into the repo Variables above and
   set the `*_ENABLE_ANALYTICS` variables to `true`.
2. Push to `staging` — the CI/CD chain does the rest: the **Build & Publish
   Images** workflow builds both images on GitHub's runners (baking the
   analytics values in) and pushes them to GHCR; when it succeeds, the deploy
   workflow fires on your self-hosted runner and just does
   `docker compose pull` + `up -d`. Changing any `NEXT_PUBLIC_*`/analytics
   variable later means re-running the build workflow (or pushing), not just
   restarting containers.

## Step 4 — Verify staging

- Visit the staging site with dev tools open: `script.js` loads, a `POST` to
  the collect endpoint fires, page view appears in Umami.
- Ask folio-ai something, then check the admin panel at
  `http://<docker-host-lan-ip>:9001` — log in, see the AI log row and stats.
- Heatmaps/replay: enable the Replay + Heatmap toggles on the website entry in
  Umami's dashboard, set `STAGING_ENABLE_REPLAY=true` (repo Variable), rebuild,
  then browse the site and check Umami's Replays/Heatmap reports.
- Scroll a blog post past 75% → `blog-read` event in Umami.
- Admin panel exposure: it publishes a plain host port (9001 staging / 9000
  prod) with no reverse-proxy config — as long as your edge/firewall doesn't
  forward that port, it stays LAN/WireGuard-only, with the password as the
  second layer.
- `sqlite3 <staging-data-dir>/portfolio.sqlite 'SELECT COUNT(*) FROM ai_prompt_logs;'`

## Step 5 — Repeat for prod

Merge to `main` — same build → deploy chain runs with the prod image tags and
the prod Variables; admin lands on `:9000`.

## Gotchas

- `NEXT_PUBLIC_*`/analytics changes always need an **image rebuild** (they're
  baked at build time in the GitHub workflow) — re-run "Build & Publish
  Images" or push a commit. Runtime env-file changes (Ollama, admin password)
  only need `docker compose up -d` on the host.
- The deploy workflows only fire automatically after a successful image build
  for their branch (`workflow_run`) — and GitHub only triggers `workflow_run`
  from workflow files on the **default branch**, so all three workflow files
  must exist on `main` before the staging chain auto-fires.
- First ever run: GHCR packages are created private by default. Either make
  `portfolio` and `portfolio-admin` packages public in their GitHub settings,
  or leave them private — the deploy workflow logs into GHCR with
  `GITHUB_TOKEN` either way.
- Umami and the custom SQLite pieces are fully independent — one being down
  never affects the other.
- Local dev: everything no-ops gracefully — analytics off (no env flag),
  AI logs write to `./data/portfolio.sqlite` (gitignored).
