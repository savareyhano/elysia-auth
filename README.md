# Elysia with Bun runtime

ElysiaJS JWT Authentication with Refresh Token Rotation and Reuse Detection.

Inspirations:

- [Dicoding's "Belajar Fundamental Aplikasi Back-End"](https://github.com/dicodingacademy/a271-backend-menengah-labs) (files, folders, and code structure)
- [Dave Gray's "Node JS Tutorial Series - Refresh Token Rotation and Reuse Detection"](https://github.com/gitdagray/refresh_token_rotation) (refresh token rotation and reuse detection mechanism)
- [cholasimmons's 'Modular Elysia JS app | Authentication template (Bun runtime)'](https://github.com/cholasimmons/bun-elysia-modular_auth) (cron usage for cleaning expired tokens)

## Prerequisites

- [Git](https://git-scm.com/downloads)
- [Bun](https://bun.sh/)
- [Docker (optional)](https://www.docker.com/products/docker-desktop/)

## Getting Started

### Non-Docker

Clone the repository:

```bash
git clone https://github.com/savareyhano/elysia-auth.git
```

Navigate to the project directory:

```bash
cd elysia-auth
```

Create a `.env` file and configure it:

```bash
cp .env.example .env
```

Install the dependencies:

```bash
bun install
```

### Docker

Clone the repository:

```bash
git clone https://github.com/savareyhano/elysia-auth.git
```

Navigate to the project directory:

```bash
cd elysia-auth
```

Start the docker compose:

```bash
docker compose up -d
```

## Development

To start the development server run (not needed with Docker):

```bash
bun run dev
```

Open http://localhost:3000/swagger with your browser to see the available APIs.
