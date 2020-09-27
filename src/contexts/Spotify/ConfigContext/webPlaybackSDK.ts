import log, { FLAVORS } from '../../../util/log'
import { refreshAndCacheAccessToken } from './refreshToken'
import { InitWebPlaybackSDKParams, InitializedPlaybackSDK } from '../types'

// We need this one for actually playing music out of the user's browser.
// It also registers the browser window as a connected device.
// https://developer.spotify.com/documentation/web-playback-sdk/quick-start/
export async function initializeWebPlaybackSDK({
  refresh_token,
  sdk,
}: InitWebPlaybackSDKParams): Promise<InitializedPlaybackSDK> {
  log.trace(FLAVORS.SPOTIFY, 'initializing web playback sdk')

  // Programmatically load Connect SDK
  const script = document.createElement('script')
  script.src = 'https://sdk.scdn.co/spotify-player.js'
  script.async = true
  document.body.appendChild(script)

  try {
    const Player: typeof Spotify.SpotifyPlayer = await getWebPlaybackPlayer()

    const player = new Player({
      name: 'Good Vibes Only 💖',
      volume: 1.0,
      getOAuthToken: async (callback) => {
        const refreshedAccessToken: string = await refreshAndCacheAccessToken(
          refresh_token,
          sdk
        )
        callback(refreshedAccessToken)
      },
    })

    return new Promise((resolve, reject) => {
      // Successful connection
      player.addListener('ready', (s: Spotify.WebPlaybackInstance) => {
        log.trace(
          FLAVORS.SPOTIFY,
          'established connection with web playback sdk'
        )
        resolve({ player, playbackInstance: s })
      })

      // Error handling
      player.addListener('not_ready', ({ device_id }) =>
        reject(`Device ID is not available: ${device_id}`)
      )
      player.addListener('initialization_error', ({ message }) =>
        reject(message)
      )
      player.addListener('authentication_error', ({ message }) =>
        reject(message)
      )
      player.addListener('account_error', ({ message }) => reject(message))
      player.addListener('playback_error', ({ message }) => reject(message))

      // Attempt connection
      player.connect()
    })
  } catch (e) {
    log.error(FLAVORS.SPOTIFY, 'failed to initialize web playback sdk')
    throw e
  }
}

// Detects and returns whether the SDK is loaded properly on the DOM
function getSpotifyWebPlaybackSDK(): Promise<typeof Spotify> {
  return new Promise((resolve) => {
    if (window.Spotify) resolve(window.Spotify)
    else window.onSpotifyWebPlaybackSDKReady = () => resolve(window.Spotify)
  })
}

async function getWebPlaybackPlayer(): Promise<typeof Spotify.SpotifyPlayer> {
  try {
    const spotify = await getSpotifyWebPlaybackSDK()
    return spotify.Player
  } catch (e) {
    log.error(
      FLAVORS.SPOTIFY,
      'failed to get spotify web playback sdk from the window'
    )
    throw e
  }
}
