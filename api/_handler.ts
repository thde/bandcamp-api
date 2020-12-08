import { NowRequest, NowResponse } from '@vercel/node'

import { chain } from '@amaurymartiny/now-middleware'
import cors from 'cors'
import morgan from 'morgan'

import * as Sentry from './_sentry'

export function callbackHandler(
  callback: (request: NowRequest) => Promise<any>
): (request: NowRequest, response: NowResponse) => Promise<void> {
  return async function handler(
    request: NowRequest,
    response: NowResponse
  ): Promise<void> {
    try {
      const data = await callback(request)

      response.setHeader(
        'cache-control',
        'max-age=60, s-maxage=86400, stale-while-revalidate'
      )
      response.status(200).json(data)
    } catch (err) {
      console.error(err)
      Sentry.captureException(err)
      response.status(500).send(err.toString())
    }
  }
}

export function defaultChain(callback: (request: NowRequest) => Promise<any>) {
  return chain(
    cors(),
    morgan('common'),
    Sentry.requestHandler()
  )(callbackHandler(callback))
}
