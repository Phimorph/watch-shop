# watch.me

Showcase site for watch.me, pre-owned luxury watches in Dhaka. There is no checkout: visitors browse the collection, ask the price on WhatsApp and arrange a viewing.

Next.js 16 (App Router, Cache Components) with Payload CMS 4 on MongoDB. Every word and picture on the site is edited in the Payload admin at `/admin`.

## Local setup

1. `cp .env.example .env` and set `DATABASE_URL` (a MongoDB connection string) and `PAYLOAD_SECRET` (any long random string).
2. `pnpm install`
3. `pnpm seed` loads sample watches, photographs and page content. Re-running it only fills what is empty; `pnpm seed --force` rewrites the home page and settings.
4. `pnpm dev`, then open http://localhost:3000. Create the first admin user at http://localhost:3000/admin.

After seeding, restart `pnpm dev`: the seed skips cache revalidation, so a running server keeps showing the old content.

## Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm build` / `pnpm start` | Production build and server |
| `pnpm typecheck` | Route types and TypeScript |
| `pnpm lint` | ESLint |
| `pnpm format` | oxfmt |
| `pnpm test` | Playwright end-to-end tests |
| `pnpm seed [--force]` | Sample content |
| `pnpm generate:types` | Regenerate `src/payload-types.ts` after changing a collection or global |

## Where things live

- `src/collections`, `src/globals`: the content model (watches, media, users; home page and site settings).
- `src/lib/queries.ts`: every read of Payload data, cached and revalidated by tags.
- `src/app/(frontend)`: the public site. `src/app/(payload)`: the admin and its API.
- `src/components`: server components only; the site ships no client JavaScript.

Project rules for contributors and coding agents are in `CLAUDE.md` and `AGENTS.md`.
