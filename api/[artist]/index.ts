import { NowRequest } from '@vercel/node'

import * as Bandcamp from '../_bandcamp'
import { defaultChain } from '../_handler'

const response = (request: NowRequest) =>
  Bandcamp.getReleases(request.query.artist as string)

export default defaultChain(response)
