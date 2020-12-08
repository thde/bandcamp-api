import { NowRequest, NowResponse } from '@vercel/node'

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
        'max-age=0, s-maxage=86400, stale-while-revalidate'
      )
      response.status(200).json(data)
    } catch (err) {
      console.warn(err)
      Sentry.captureException(err)
      response.status(500).send(err.toString())
    }
  }
}
