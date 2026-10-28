import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Expires the frontend's cached Payload reads after an edit. `expire: 0` rather than 'max':
 * no visitor is served the old version, so a watch marked sold stops offering a price at once.
 * Scripts that run outside Next.js (the seed) set `context.disableRevalidate`.
 */
const revalidate = (tag: string, context: Record<string, unknown>) => {
  if (!context.disableRevalidate) revalidateTag(tag, { expire: 0 })
}

export const revalidateCollection =
  (...tags: string[]): CollectionAfterChangeHook & CollectionAfterDeleteHook =>
  ({ doc, req: { context } }) => {
    for (const tag of tags) revalidate(tag, context)
    return doc
  }

export const revalidateGlobal =
  (tag: string): GlobalAfterChangeHook =>
  ({ doc, req: { context } }) => {
    revalidate(tag, context)
    return doc
  }
