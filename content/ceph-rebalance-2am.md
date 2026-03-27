---
title: "When my Ceph cluster decided 2am was a great time to rebalance"
date: "2026-03-10"
tags: ["proxmox", "incident"]
excerpt: "A deep dive into what happens when Ceph decides your storage cluster needs an emergency rebalance at the worst possible time — and how I stopped the bleeding without losing data or sleep (well, much sleep)."
pinned: true
---

## The 2am alert

It started with a Zabbix alert at 02:14. Not the gentle kind — the kind where your phone buzzes three times in quick succession and you already know something has gone properly wrong before you've opened your eyes.

The alert read: `Ceph cluster health: HEALTH_WARN — 1 nearfull OSD`.

*Fine*, I thought. A nearfull OSD. I'll move some PGs around in the morning.

Then the second alert came in. `HEALTH_ERR — recovery throttling`.

Then the third.

## What actually happened

Ceph had decided, entirely on its own, that now was the perfect time to rebalance a significant portion of the cluster's placement groups. I had recently added a third OSD to the cluster — a mistake I'd been planning to do during a maintenance window the following weekend.

Except I'd forgotten I'd set `osd_pool_default_size = 3` and the new OSD immediately started pulling data to meet the replica count.

```bash
# What I saw when I ran this
ceph -s

  cluster:
    id:     a1b2c3d4-...
    health: HEALTH_ERR
            1 nearfull osd(s)
            recovery throttling

  services:
    mon: 3 daemons, quorum pve1,pve2,pve3
    osd: 3 osds: 3 up, 3 in

  data:
    pools:   4 pools, 256 pgs
    objects: 12.5k objects, 48 GiB
    usage:   142 GiB used, 58 GiB / 200 GiB avail
    pgs:     256 active+clean
             48  active+remapped+backfill_wait
```

## The fix

The immediate fix was to throttle the recovery so I could actually sleep:

```bash
ceph tell 'osd.*' injectargs '--osd-max-backfills 1'
ceph tell 'osd.*' injectargs '--osd-recovery-max-active 1'
```

This slowed the rebalance to a crawl but crucially stopped it hammering the I/O and taking the whole cluster into a degraded state.

By morning, everything had settled. No data loss. No corruption. Just a very unnecessary 2am adventure.

## What I learned

- Always set a maintenance window before adding OSDs to a production Ceph cluster, even a homelab one
- Set `osd_max_backfills` and `osd_recovery_max_active` proactively — don't wait for an incident
- Zabbix alerting worked perfectly; this could have been much worse without it

> The homelab has no SLA. But it does have a sleeping owner who would quite like to stay that way.

---

*Tagged under [proxmox](/blog/tag/proxmox) and [incident](/blog/tag/incident).*
