# singer.systems (V3)

Personal portfolio, blog, and homelab showcase. Live at [singer.systems](https://singer.systems).

Built with Next.js App Router, Tailwind CSS, and deployed via Docker + Traefik on my own infrastructure.

## Stack

- **Framework:** Next.js 16 (App Router, JS — no TypeScript)
- **Styling:** Tailwind CSS + CSS custom properties
- **Fonts:** JetBrains Mono + DM Sans
- **Blog:** Markdown files via `gray-matter` + `marked`
- **AI terminal:** Ollama (self-hosted LLM)
- **Infra:** Docker, Traefik, GitHub Actions CI/CD, Cloudflare CDN

## Local development

```bash
cp .env.example .env.local
# fill in your values

npm install
npm run dev
```

App runs at `http://localhost:3000`.

## Environment variables

See [.env.example](.env.example) for all required variables. The AI terminal and status widget won't function without `OLLAMA_URL` and `KUMA_URL` set respectively — everything else on the site works fine without them.

## Adding a blog post

Drop a `.md` file into `content/blog/` with the following frontmatter:

```markdown
---
title: My Post Title
date: 2026-03-28
author: Elliot Singer
tags: [devops, docker]
excerpt: A short summary shown in the listing.
---

Post content here...
```

Posts appear automatically — no config needed. Set `priority: 1` to pin a post to the top.

## CI/CD

Two branches, two environments:

- `staging` → staging environment (separate URL, used for testing changes)
- `main` → production at singer.systems

On push to either branch, GitHub Actions (self-hosted runner on my infrastructure) lints the code, builds a Docker image, and deploys it via Docker Compose. Traefik handles routing and TLS.

Workflows trigger on changes to `app/`, `components/`, `docker/`, or `content/`.

## Infrastructure

The full homelab stack powering this site is documented on the [homelab page](https://singer.systems/homelab) — Proxmox cluster, WireGuard mesh, OPNsense firewalls, Azure Traffic Manager failover, the works.
