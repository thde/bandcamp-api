import { VercelRequest } from '@vercel/node'

import * as Bandcamp from '../../_bandcamp'
import { defaultChain } from '../../_handler'

const response = (request: VercelRequest) =>
  Bandcamp.getReleasesByArtist(request.query.artist as string)

export default defaultChain(response)
