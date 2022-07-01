# Tranquilo

-----

Open-Source Static Site Manager

Tranquilo (pronounced **tran**sformer + **kilo**gram, /tɾanˈkilo/) is an open-source static sites manager.

A static sites manager (SSM) deals with the ever growing complexity of web sites by taking a new approach. Instead of considering each site in isolation and offer a set of features that need to be configured each time, manually, Tranquilo considers the sites as a group of services that share a lot of features and tries to streamline those features to manage them in the manager an not in the site.

This project was catalyzed by the [Hashnode](https://hashnode.com/)'s Build with [Linode](https://www.linode.com/?utm_source=hashnode&utm_medium=article&utm_campaign=hackathon_announcement) Hackathon.

You can find the post describing the creation process [here](https://engineering.migsar.com/tranquilo).

-----

## Installation

1. Clone this repository (It is currently needed to run the migrations):

```
git clone https://github.com/migsar/tranquilo.git
```

2. Install [Docker Engine](https://docs.docker.com/engine/install/).

3. Install [Hasura CLI](https://hasura.io/docs/latest/graphql/core/hasura-cli/install-hasura-cli/).

4. [Apply Hasura's migrations](https://hasura.io/docs/latest/graphql/core/migrations/migrations-setup/#step-7-apply-the-migrations-and-metadata-on-another-instance-of-the-graphql-engine).

5. Edit `docker-compose.yaml`'s `SITES_PATH` envvar and manually copy static sites to a subfolder inside this folder.

6. Create in Hasura Console records for each site, using the data tab. You can either use `hasura console` or enable by setting `HASURA_GRAPHQL_ENABLE_CONSOLE` to "true".
<!--
```
# Download the manifest by using wget
wget https://raw.githubusercontent.com/migsar/tranquilo/main/docker-compose.yaml

# or curl
curl https://raw.githubusercontent.com/migsar/tranquilo/main/docker-compose.yaml -o docker-compose.yml
```
-->

## Development

Assuming you have Node.js and pnpm (After v16.9.0 corepack is included with node and you can have yarn and pnpm by `corepack enable`).

```
pnpm install

pnpm dev
```

### Features

- SEO friendly (Currently passively by completely delegating to the site generator)
- GraphQL API (By using [Hasura](https://hasura.io/))

### Roadmap

- Advanced SEO
- Advanced analytics
- Dynamic web-based mapping
- Shared multi-tenant user authentication and support services (i18n, payment, comments, sharing, email)
- Support for storage (both block and object)
- Load and cost analysis.
