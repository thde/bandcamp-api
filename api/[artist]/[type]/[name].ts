import { chain } from '@amaurymartiny/now-middleware'
import { NowRequest, NowResponse } from '@now/node'

import cors from 'cors'
import morgan from 'morgan'

import * as Sentry from '@sentry/node'
import { RewriteFrames } from '@sentry/integrations'

import * as Bandcamp from '../../_bandcamp'

import { CONFIG } from '../../_config'

Sentry.init({
  dsn: CONFIG.Sentry.Dsn,
  integrations: [
    new RewriteFrames({
      root: (global as any).__rootdir__,
    }),
  ],
})

async function handler(
  request: NowRequest,
  response: NowResponse
): Promise<void> {
  try {
    const releases = await Bandcamp.getRelease(
      (request.query as unknown) as Bandcamp.ReleaseParams
    )

    response.setHeader(
      'cache-control',
      'max-age=0, s-maxage=86400, stale-while-revalidate'
    )
    response.status(200).json(releases)
  } catch (err) {
    console.warn(err)
    Sentry.captureException(err)
    response.status(500).send(err.toString())
  }
}

export default chain(cors(), morgan('common'))(handler)
