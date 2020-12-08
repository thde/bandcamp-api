import * as Bandcamp from 'bandcamp-scraper'
import { promises as dns } from 'dns'
import { CONFIG } from './_config'

export function getReleases(artist: string) {
  verifyArtist(artist)

  return toPromise<string, string[]>(
    Bandcamp.getAlbumUrls,
    `https://${artist}`
  ).then((urls) =>
    urls.map((url) => {
      const releaseData = new URL(url).pathname.split('/')
      return {
        type: releaseData[1],
        id: releaseData[2],
      }
    })
  )
}

export interface ReleaseParams {
  artist: string
  type: string
  name: string
}

export async function getRelease({ artist, type, name }: ReleaseParams) {
  verifyArtist(artist)
  const url = `https://${artist}/${type}/${name}`

  const info = await toPromise<string, string[]>(Bandcamp.getAlbumInfo, url)
  const products = await toPromise<string, string[]>(
    Bandcamp.getAlbumProducts,
    url
  )

  return { ...info, products: products }
}

async function verifyArtist(artist: string) {
  if (artist.endsWith('.bandcamp.com')) return

  const address = (await dns.lookup(artist)).address
  if (CONFIG.Bandcamp.AllowedIps.includes(address)) return

  throw 'Artist domain not valid!'
}

function toPromise<P, R>(
  callback: (arg0: P, arg1: (error: Error, response: R) => void) => void,
  params: P
): Promise<R> {
  return new Promise((resolve, reject) =>
    callback(params, (error, response) => {
      if (error) {
        reject(error)
      } else {
        resolve(response)
      }
    })
  )
}
