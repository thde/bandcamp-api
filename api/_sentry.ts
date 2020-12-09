import * as Sentry from '@sentry/node'
import { RewriteFrames } from '@sentry/integrations'
import { CONFIG } from './_config'

Sentry.init({
  dsn: CONFIG.Sentry.Dsn,
  integrations: [
    new RewriteFrames({
      root: (global as any).__rootdir__,
    }),
  ],
})

export const flush = Sentry.flush
export const requestHandler = Sentry.Handlers.requestHandler
export const captureException = Sentry.captureException
