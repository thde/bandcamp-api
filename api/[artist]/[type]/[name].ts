import { chain } from '@amaurymartiny/now-middleware'

import cors from 'cors'
import morgan from 'morgan'

import * as Sentry from '@sentry/node'
import { RewriteFrames } from '@sentry/integrations'

import * as Bandcamp from '../../_bandcamp'
import { callbackHandler } from '../../_handler'

import { CONFIG } from '../../_config'

Sentry.init({
  dsn: CONFIG.Sentry.Dsn,
  integrations: [
    new RewriteFrames({
      root: (global as any).__rootdir__,
    }),
  ],
})

export default chain(
  cors(),
  morgan('common')
)(
  callbackHandler((request) =>
    Bandcamp.getRelease((request.query as unknown) as Bandcamp.ReleaseParams)
  )
)
