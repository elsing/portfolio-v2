---
title: "Redesigning my portfolio, thrid time around, but AI powered"
date: "2026-03-28"
tags: ["design", "ai","portfolio"]
excerpt: "A deep dive into the designing, configuration and deployment of my new AI-infused portfolio site. I am pretty chuffed with it. Thanks Claude <3"
priority: 1
---

*No AI was used in writing this.*

## The goal

It is always good to start with a goal, something to aim for and to work towards.

I had some *simple* goals:
* I wanted a blog/docs website site
* it must show a bit of what I do
* it must have some personality. I didn't want it to be dry
* no WordPress (no offence 😬)

With that being said, in honesty, I did not have a design in mind. Previously, I had used Figma (and a lot of time) to place how I may want the site to look on a page. Often choosing my favourite colours and asking people around me what they thought. I ended up with the below...

![portfolio-v2](/blog/portfolio-v3/portfolio-v2.png)

It is minimalist, but does not really lead anywhere. It does not exactly scream skilled either. But it was certainly better than v1, I must admit.

## The process

Since I hear so much about AI and specifically Claude for programming, I thought, why not give it a go? I began by telling it what I had already (linking to my GitHub), and about my homelab.

Here was Claude's first mockup:

![claude mockup](/blog/portfolio-v3/claude-mockup.png)


As you might be able to tell, this is really not far off from how some of the base elements look now! The nav, footer and the left side of the hero are much the same. We then discussed my setup, the blog and homepage. I spoke with my colleagues about the look at they gave some helpful feedback, so I entered this as well.

Having something like the terminal is something I have wanted before, but not had the time or skill to do it. Thankfully, Claude did the heavy work on this project, so I was able to freely think, showing the true advantage of AI tooling. A photo was considered, like before, but after trying it over and over, it just did not work.

## Brain wave moment

Still, my favourite part of this was this little thought I had: what if I hooked the terminal up to an LLM?

![brainwave prompt](/blog/portfolio-v3/brainwave.png)

Claude's response...

![brainwave prompt response](/blog/portfolio-v3/brainwave-claude-response.png)

Dopamine download ✅

It did then try upselling me using Claude's API, but you gotta respect the grind. I met Anthropic halfway, and signed up for Claude Pro 😅.

Setting up Ollama (to run the LLM) was fairly painless, apart from having the model pre-loaded, but if I went through all the integration issues, this would take too long to read/write; especially trying to use vLLM but getting nowhere. Essentially, the server runs a script on boot to get Ollama to load up the model and then just waits to respond.

Claude spun up an API for the portfolio server to talk with AI and then provide this back to the client's browser. It is pretty smart. Any neat ideas I thought of, I just asked Claude to add them.

Feature set:
* rate limiting by both session and IP
* live connection tester / healthcheck
* local commands, like "help", work
* highly customised system prompt
* messages remaining counters
* knows about me and will attempt to sell me
* terminal history - up/down support

Granted, it is not the quickest (all CPU, no GPU), and it will not scale well, but it is certainly a unique feature I have not seen anywhere else.

It's like having a mini-me right there on the website, ready to talk with - I do hope this doesn't come back to bite me...

## Ideas come from strange places.

Sometimes, the best ideas can occur from just being observant.

* the "moire" lines (as Claude tells me 🤓) are on the site because my left monitor is broken and I liked the look of them. Adds a bit of texture.
* I only thought to have the site support ultra-wide screens, because my housemate has one...
* the site came together overall, because my colleagues constantly like to check in on it, so I thought to impress em (hope you like it Finn).

## Results

Here are some of the sites' capabilites:
* functional service check (top right)
* working blog system, with markdown support
* working integrated terminal style LLM "folio-ai"
* supports all displays, large and small
* funky matrix style loading animation
* custom 404 page
* in my opinion, a neat design

There are plenty of details about this project I have not gone into, but feel free to ask me if you're interested.

![brainwave prompt response](/blog/portfolio-v3/ai.gif)
Yes, this is 2x speed...

## What I learned

> AI is brilliant at accelerating what we really want to see, rather than focusing on how we get there.

Well, in the context of light development anyway...

But seriously, I have been so utterly impressed with using Claude. I absolutely did not foresee my site looking like this in less than 48 hours. Especially with all the features it has, Claude really allowed me to channel my creative energy into this project, and not have to get lost in the weeds of programming and finding out how to do this. Although my knowledge did catch Claude off guard a few times. I accept that stepping away from the technical side is not always a good thing. Claude cannot deploy this onto my network for me; that was all me. But it would certainly give it a good go.

Ciao for now,  
Elliot