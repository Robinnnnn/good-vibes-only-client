import SpotifySDK from 'spotify-web-api-js'
import log, { FLAVORS } from '../../../util/log'
import { refreshAndCacheAccessToken } from './refreshToken'
import { InitSpotifySDKParams, InitializedSpotifySDK } from '../types'
import { MINUTE } from '../../../util/time'

// Initialize Spotify SDK. This is the app's primary mode of interacting with
// Spotify after the user has been identified. Note that requests will be made
// directly to Spotify via the user's access token, and bypass our own servers.
// https://github.com/JMPerez/spotify-web-api-js
// https://developer.spotify.com/documentation/web-api/quick-start/
export function initializeSpotifySDK({
  access_token,
  refresh_token,
}: InitSpotifySDKParams): InitializedSpotifySDK {
  log.trace(FLAVORS.SPOTIFY, 'initializing spotify sdk')
  const sdk: SpotifySDK.SpotifyWebApiJs = new SpotifySDK()
  sdk.setAccessToken(access_token)
  // Set token to refresh periodically; default expiry is 60 mins
  const refreshTokenIntervalId = window.setInterval(
    () => refreshAndCacheAccessToken(refresh_token, sdk),
    30 * MINUTE // 30 mins
  )
  return { sdk, refreshTokenIntervalId }
}
