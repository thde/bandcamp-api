import * as Bandcamp from 'bandcamp-scraper'
import { promises as dns } from 'dns'
import { CONFIG } from './_config'
import { ParameterError } from './_errors'

export async function getReleases(artist: string) {
  await verifyArtist(artist)

  const urls = await toPromise<string, string[]>(
    Bandcamp.getAlbumUrls,
    `https://${artist}`
  )

  return urls.map((url) => {
    const releaseData = new URL(url).pathname.split('/')
    return {
      type: releaseData[1],
      id: releaseData[2],
    }
  })
}

export interface ReleaseParams {
  artist: string
  type: string
  name: string
}

export async function getRelease({ artist, type, name }: ReleaseParams) {
  await verifyArtist(artist)

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

  try {
    const address = (await dns.lookup(artist)).address
    if (!CONFIG.Bandcamp.AllowedIps.includes(address))
      throw new ParameterError('address not allowed')
  } catch (err) {
    console.error(err)
    throw new ParameterError('Artist domain not valid!')
  }
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
