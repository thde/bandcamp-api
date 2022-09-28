import { VercelRequest, VercelResponse } from '@vercel/node'

import { chain } from '@amaurym/now-middleware'
import cors from 'cors'
import morgan from 'morgan'
import { ParameterError } from './_errors'

import * as Sentry from './_sentry'

export function callbackHandler(
  callback: (request: VercelRequest) => Promise<any>
): (request: VercelRequest, response: VercelResponse) => Promise<void> {
  return async function handler(
    request: VercelRequest,
    response: VercelResponse
  ): Promise<void> {
    try {
      const data = await callback(request)

      response.setHeader(
        'cache-control',
        'max-age=60, s-maxage=86400, stale-while-revalidate'
      )
      response.status(200).json(clean(data))
    } catch (err) {
      console.error(err)
      if (!(err instanceof ParameterError)) {
        Sentry.captureException(err)
        await Sentry.flush(2000)
      }
      response.status(200).send(err.toString())
    }
  }
}

export function defaultChain(
  callback: (request: VercelRequest) => Promise<any>
) {
  return chain(
    Sentry.requestHandler(),
    cors(),
    morgan('common'),
    Sentry.errorHandler()
  )(callbackHandler(callback))
}

function clean(obj: any) {
  return Object.entries(obj).reduce(
    (a, [k, v]) => (v == null ? a : ((a[k] = v), a)),
    {}
  )
}
