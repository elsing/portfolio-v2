# Portfolio Site

Created to replace my older portfolio site.

The idea eventually is to have projects and other bits I have done uploaded to it.

## Automation

As part of my DevOps journey, I want to get GitHub Actions setup for this site, to automate deployment to my servers (and eventually Kubernetes cluster).

Currently, this uses GitHub Actions in combination with a runner that is hosted on my infrastructure.

Once a push goes out to  the "app", "components" or "docker" directories in the main branch, the workflow will redownload the latest copy of the repo and build the NextJS app. Once built, this is packaged into a Docker image on the host (the runner has the docker.sock passed through) and then using the Docker compose image, the app is run in the production environment. Then my reverse proxy (Traefik) handles the resolution of [the portfolio page](https://singer.systems).

A staging branch is also configured, so I can make changes and not affect the main site. This is accessible under a different URL.

## Design

Using [Khroma](khroma.co), I was able to get some colour schemes I liked. From there, I have used Figma to mock up a design that is pleasing to me. I am sure it will further develop over time.
