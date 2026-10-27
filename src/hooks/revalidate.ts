import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

/**
 * Marks the frontend's cached Payload reads stale after an edit.
 * Scripts that run outside Next.js (the seed) set `context.disableRevalidate`.
 */
const revalidate = (tag: string, context: Record<string, unknown>) => {
  if (!context.disableRevalidate) revalidateTag(tag, 'max')
}

export const revalidateCollection =
  (tag: string): CollectionAfterChangeHook & CollectionAfterDeleteHook =>
  ({ doc, req: { context } }) => {
    revalidate(tag, context)
    return doc
  }

export const revalidateGlobal =
  (tag: string): GlobalAfterChangeHook =>
  ({ doc, req: { context } }) => {
    revalidate(tag, context)
    return doc
  }
