import SpotifySDK from 'spotify-web-api-js'
import log, { FLAVORS } from '../../../util/log'

// Takes a user refresh token and returns a new access token
export async function refreshAndCacheAccessToken(
  refreshToken: string,
  spotify: SpotifySDK.SpotifyWebApiJs
): Promise<string> {
  const accessToken = await requestRefreshedAccessToken(refreshToken)
  spotify.setAccessToken(accessToken)
  return accessToken
}

export async function requestRefreshedAccessToken(
  refreshToken: string
): Promise<string> {
  // TODO 1: the URL should come from ENV
  // TODO 2: make this a generic util
  // TODO 3: error handling !
  const res = await fetch(`http://localhost:3001/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: refreshToken }),
  })
  const body = await res.json()

  log.trace(FLAVORS.AUTH, 'refreshed user access token')

  return body.access_token
}
