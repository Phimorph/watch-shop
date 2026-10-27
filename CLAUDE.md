@AGENTS.md

# watch.me

Showcase site (no e-commerce) for pre-owned luxury watches. Next.js 16 App Router + Payload CMS 4 (MongoDB).

- `pnpm dev` · `pnpm build` · `pnpm typecheck` · `pnpm lint` · `pnpm test` (Playwright) · `pnpm seed [--force]`
- Design reference: the watchme storefront prototype. Follow it section by section.

## Rules

- All content comes from Payload (`src/collections`, `src/globals`). Never hard-code copy in components.
- Read data only through `src/lib/queries.ts`: Local API, `overrideAccess: false`, `'use cache'` + `cacheTag`. Payload hooks revalidate the tags.
- Cache Components (PPR) is on: runtime data (`searchParams`, `params`) goes inside `<Suspense>`.
- Server components only. No `'use client'`, no browser fetches to `/api`; media is served via the `/media` rewrite.
- Check Next.js and Payload APIs against their docs (`node_modules/next/dist/docs`, the Payload skill) before using them.
