import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { sharpTransformer } from '@payloadcms/transformer-sharp'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Users } from './collections/Users'
import { Watches } from './collections/Watches'
import { Home } from './globals/Home'
import { Settings } from './globals/Settings'
import { serverURL } from './lib/site'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · watch.me',
    },
  },
  collections: [Watches, Media, Pages, Users],
  globals: [Home, Settings],
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL,
  cors: [serverURL],
  csrf: [serverURL],
  // The site reads through the Local API; nothing needs GraphQL.
  graphQL: { disable: true },
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URL || '',
  }),
  upload: {
    transformers: [sharpTransformer()],
    limits: { fileSize: 10_000_000 },
  },
})
