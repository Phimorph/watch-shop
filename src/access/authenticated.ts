import type { Access } from 'payload'

export const authenticated: Access = ({ req: { user } }) => Boolean(user)

/** Editors see drafts; the public only ever sees published documents. */
export const authenticatedOrPublished: Access = ({ req: { user } }) =>
  user ? true : { _status: { equals: 'published' } }
