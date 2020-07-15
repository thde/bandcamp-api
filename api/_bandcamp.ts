import * as Bandcamp from 'bandcamp-scraper'

export function getReleases(artist: string) {
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
  const info = await toPromise<string, string[]>(
    Bandcamp.getAlbumInfo,
    `https://${artist}/${type}/${name}`
  )
  const products = await toPromise<string, string[]>(
    Bandcamp.getAlbumProducts,
    `https://${artist}/${type}/${name}`
  )

  return { ...info, products: products }
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
