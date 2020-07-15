import * as Sentry from '@sentry/node'
import { RewriteFrames } from '@sentry/integrations'
import { CONFIG } from './_config'

const middlewear: (...args: any[]) => void = (err, ctx) => {
  Sentry.withScope((scope) => {
    scope.addEventProcessor((event) =>
      Sentry.Handlers.parseRequest(event, ctx.request)
    )
    Sentry.captureException(err)
  })
}

export function SentryErrorMiddlewear() {
  Sentry.init({
    dsn: CONFIG.Sentry.Dsn,
    integrations: [
      new RewriteFrames({
        root: (global as any).__rootdir__,
      }),
    ],
  })

  return middlewear
}
