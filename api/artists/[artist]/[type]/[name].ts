import { NowRequest } from '@vercel/node'

import * as Bandcamp from '../../../_bandcamp'
import { defaultChain } from '../../../_handler'

const response = (request: NowRequest) =>
  Bandcamp.getRelease((request.query as unknown) as Bandcamp.ReleaseParams)

export default defaultChain(response)
