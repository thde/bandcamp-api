import { VercelRequest, VercelRequestQuery } from '@vercel/node'

import * as Bandcamp from '../_bandcamp'
import { defaultChain } from '../_handler'

function toParams({ query, page }: VercelRequestQuery) {
  const params: Bandcamp.SearchParams = {
    query: query as string,
    page: parseInt(page as string),
  }
  return params
}

const response = (request: VercelRequest) => {
  return Bandcamp.search(toParams(request.query))
}

export default defaultChain(response)
