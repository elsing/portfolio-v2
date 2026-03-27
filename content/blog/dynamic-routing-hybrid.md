---
title: "Dynamic routing across on-prem and cloud: my setup explained"
date: "2026-02-18"
tags: ["traefik", "networking"]
excerpt: "OSPF over WireGuard, Traefik dynamic config, and why I ended up with three VPS nodes talking to each other across two continents."
priortiy: 2
---

## The problem with static routes

When I first set up my hybrid homelab, I used static routes everywhere. It worked fine — until it didn't. The moment I added a second VPS node and wanted traffic to fail over automatically, the static approach became a maintenance nightmare.

The solution was running OSPF over WireGuard tunnels between all nodes. Each node advertises its own prefixes, neighbours learn them dynamically, and if a node disappears the routes reconverge in seconds.

## WireGuard as the transport layer

WireGuard gives you an encrypted point-to-point tunnel between any two nodes. Each VPS has a WireGuard interface with a /30 subnet per peer. The peers are:

- Jupiter ↔ Venus
- Venus ↔ Mars
- Jupiter ↔ Mars
- All three ↔ on-prem (via OPS-01/02)

```ini
# /etc/wireguard/wg0.conf (Jupiter — excerpt)
[Interface]
Address = 10.10.0.1/30
PrivateKey = <redacted>
ListenPort = 51820

[Peer]
# Venus
PublicKey = <redacted>
AllowedIPs = 10.10.0.2/32, 10.20.0.0/24
Endpoint = venus.singer.systems:51820
PersistentKeepalive = 25
```

## OSPF on top

With the tunnels up, I run FRR (Free Range Routing) on each node to handle OSPF. All WireGuard interfaces are placed in OSPF area 0. Each node advertises its local container/VM subnets.

```
# FRR ospfd.conf excerpt
router ospf
  ospf router-id 10.10.0.1
  network 10.10.0.0/30 area 0
  network 10.100.1.0/24 area 0
```

The result: any node can reach any subnet across the entire mesh, and if a node goes offline its routes are withdrawn within the dead interval (40 seconds by default, tuned to 10 in my setup).

## Traefik on top of all of this

Traefik runs on each node and watches Docker for new containers. When a container starts with the right labels, Traefik picks it up automatically and starts routing traffic to it. No manual config files to update.

```yaml
# docker-compose.yml label example
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.myapp.rule=Host(`myapp.singer.systems`)"
  - "traefik.http.routers.myapp.entrypoints=websecure"
  - "traefik.http.routers.myapp.tls.certresolver=letsencrypt"
```

The combination of WireGuard + OSPF + Traefik means I can spin up a container on any node in the mesh and have it publicly accessible via HTTPS within about 30 seconds.
