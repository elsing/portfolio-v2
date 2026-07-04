# Running Umami as a shared, standalone instance

Umami isn't part of this repo's Docker Compose files — it's meant to run once
on your homelab and serve every project you point at it, since it natively
supports multiple "websites" under a single instance. This doc is the compose
config for that standalone stack, to run wherever you keep shared
infrastructure (not tied to this repo's deploy path).

## docker-compose.yml

```yaml
name: umami

services:
  umami:
    container_name: umami
    image: ghcr.io/umami-software/umami:postgresql-latest
    env_file:
      - /opt/umami/env/.env.umami
    networks:
      traefik_proxy:
        aliases:
          - umami
      internal_only: {}
    depends_on:
      - umami-db
    restart: unless-stopped

  umami-db:
    container_name: umami-db
    image: postgres:16-alpine
    env_file:
      - /opt/umami/env/.env.umami-db
    volumes:
      - umami-db-data:/var/lib/postgresql/data
    networks:
      - internal_only
    restart: unless-stopped

networks:
  traefik_proxy:
    external: true
  internal_only:
    driver: bridge

volumes:
  umami-db-data:
```

## Env files (`/opt/umami/env/`)

**`.env.umami-db`**:
```sh
POSTGRES_DB=umami
POSTGRES_USER=umami
POSTGRES_PASSWORD=<random-long-string>
```

**`.env.umami`**:
```sh
DATABASE_URL=postgresql://umami:<same-password-as-above>@umami-db:5432/umami
APP_SECRET=<random-long-string>
```

Generate both secrets with `openssl rand -hex 32`.

## Networking notes (same reasoning as the admin panel elsewhere in this repo)

- `umami` is on `traefik_proxy` because its tracking script (`/script.js`) and
  collection endpoint (`/api/send`) must be reachable from visitors' browsers
  across every site you point at it.
- `umami-db` is only on the private `internal_only` bridge network — it never
  needs to be reachable from anywhere except `umami` itself.
- Umami ships its own authenticated dashboard/login, so it's reasonable to
  leave it fully public (default creds are `admin`/`umami` — **change this
  immediately** on first login). If you'd rather keep the dashboard off the
  public internet entirely while still serving `/script.js` publicly, that
  needs a Traefik path-based rule splitting the two — more setup, optional.

## DNS + Traefik

Add one subdomain (e.g. `analytics.singer.systems`) pointing at the `umami`
service, port **3000**. Three options, depending on your setup:

### Option A — simplest: expose everything, rely on Umami's own login

```yaml
http:
  routers:
    umami:
      rule: "Host(`analytics.singer.systems`)"
      entryPoints:
        - websecure
      service: umami
      tls:
        certResolver: letsencrypt

  services:
    umami:
      loadBalancer:
        servers:
          - url: "http://umami:3000"
```

Change the default `admin`/`umami` password immediately on first login and
you're done.

### Option B — keep the dashboard/login off the public internet

Only `/script.js` and `/api/send` (the collection endpoint) actually need to
be reachable by visitor browsers. Everything else — `/login`, `/dashboard`,
`/api/*` beyond `send` — can be restricted to your LAN/WireGuard range with an
`ipAllowList` middleware. Two routers on the same service, split by path, with
the more specific one given higher priority so it wins for those two paths:

```yaml
http:
  routers:
    umami-public:
      rule: "Host(`analytics.singer.systems`) && (Path(`/script.js`) || Path(`/api/send`))"
      entryPoints:
        - websecure
      service: umami
      priority: 10          # must win over umami-dashboard for these paths
      tls:
        certResolver: letsencrypt

    umami-dashboard:
      rule: "Host(`analytics.singer.systems`)"
      entryPoints:
        - websecure
      service: umami
      middlewares:
        - umami-internal-only
      priority: 1
      tls:
        certResolver: letsencrypt

  middlewares:
    umami-internal-only:
      ipAllowList:
        sourceRange:
          - "10.10.0.0/24"   # your LAN/WireGuard mesh CIDR — adjust to match

  services:
    umami:
      loadBalancer:
        servers:
          - url: "http://umami:3000"
```

Note: older Umami releases used `/api/collect` instead of `/api/send` — check
your version's docs/Network tab if events aren't showing up, and add that path
to the `umami-public` rule if needed. With this split, hitting
`analytics.singer.systems/login` from outside your LAN 403s at the edge before
it ever reaches the Umami container — visitors only ever get to the two
tracking paths.

**Caveat**: this only holds if `umami-dashboard` is on the *same* Traefik
instance/entrypoint that public traffic hits. Traefik matches on the request's
`Host` header, not on how DNS resolved it — so if someone hits your public IP
directly with that Host header set, the `ipAllowList` middleware is the thing
actually stopping them, not the fact that DNS never pointed there publicly.

### Option C — separate Traefik instance for internal services

If your internal/admin services (this admin panel, Umami's dashboard, etc.)
already run behind their own Traefik instance that has no network path from
the public internet at all (not just a different entrypoint on the same
instance — a genuinely separate one, e.g. only reachable via WireGuard), then
a single plain router is enough — no `ipAllowList` needed, since there's no
route in from outside to begin with:

```yaml
# On the internal-only Traefik instance:
http:
  routers:
    umami-dashboard:
      rule: "Host(`analytics-internal.singer.systems`)"
      entryPoints:
        - websecure
      service: umami
      tls:
        certResolver: letsencrypt

  services:
    umami:
      loadBalancer:
        servers:
          - url: "http://umami:3000"
```

Then on your **public** Traefik instance, only the narrow `umami-public`
router from Option B (just `/script.js` + `/api/send`, no middleware needed
since it's meant to be public anyway) — same principle as the standalone
admin panel elsewhere in this repo: the isolation is structural (which
instance/network a service sits on), not a rule you have to get right in one
big router table.

## Adding a new site

Once the stack is up: log into the dashboard → Settings → Websites → Add
website → name it, get its **Website ID**, then in that project's own env
(e.g. `portfolio-v2`'s `.env.prod`/`.env.staging`, see
[analytics-setup.md](./analytics-setup.md)):

```sh
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://analytics.singer.systems/script.js
NEXT_PUBLIC_UMAMI_WEBSITE_ID=<the-uuid-just-generated>
```

Each project gets its own Website ID against the same shared instance — no new
containers, no new Postgres, just one more row in Umami's dashboard.
