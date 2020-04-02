import React from 'react'
import SpotifySDK from 'spotify-web-api-js'
import log, { FLAVORS } from '../../util/log'
import { initializeSpotifySDK } from './spotifySDK'
import { initializeWebPlaybackSDK } from './webPlaybackSDK'
import {
  InitSpotifySDKParams,
  InitializedSpotifySDK,
  InitWebPlaybackSDKParams,
  InitializedPlaybackSDK,
} from './types'

type SpotifyState = {
  // main spotify SDK for basically all requests
  sdk: SpotifySDK.SpotifyWebApiJs
  // web playback SDK needed for registering browser as a device
  player: Spotify.SpotifyPlayer
  // playback SDK instance needed for connecting player
  playbackInstance: Spotify.WebPlaybackInstance
  // we clear this out on teardown
  refreshTokenIntervalId: number
  // user info
  user: SpotifyApi.CurrentUsersProfileResponse
  /**
   * TODO : potentially store playback state here, though that
   * may be super expensive since this context needs to be
   * set up near the root...
   *
   * an alternative may be to have a separate context around
   * the *Authenticated* app that has all real-time / playlist
   * related states. logged out view doesn't need this.
   */
}

const SpotifyStateContext = React.createContext<SpotifyState | undefined>(
  undefined
)

export const useSpotifyState = (): SpotifyState => {
  const context = React.useContext(SpotifyStateContext)
  if (!context) {
    throw Error('Attempted to use SpotifyState without a provider!')
  }
  return context
}

type SpotifyActions = {
  initialize: (i: InitSpotifySDKParams) => void
  teardown: () => void
}

const SpotifyActionContext = React.createContext<SpotifyActions | undefined>(
  undefined
)

export const useSpotifyActions = (): SpotifyActions => {
  const context = React.useContext(SpotifyActionContext)
  if (!context) {
    throw Error('Attempted to use SpotifyActions without a provider!')
  }
  return context
}

export const SpotifyProvider: React.FC = ({ children }) => {
  const [spotifyState, setSpotifyState] = React.useState<
    SpotifyState | undefined
  >(undefined)

  const initialize = React.useCallback(
    async ({ access_token, refresh_token }: InitSpotifySDKParams) => {
      log.info(FLAVORS.SPOTIFY, 'initializing spotify')
      const initParams: InitSpotifySDKParams = {
        access_token,
        refresh_token,
      }
      const {
        sdk,
        refreshTokenIntervalId,
      }: InitializedSpotifySDK = initializeSpotifySDK(initParams)

      try {
        const initParams: InitWebPlaybackSDKParams = { refresh_token, sdk }
        const playbackSdk: InitializedPlaybackSDK = await initializeWebPlaybackSDK(
          initParams
        )

        const user: SpotifyApi.CurrentUsersProfileResponse = await sdk.getMe()
        log.info(FLAVORS.SPOTIFY, `retrieved user: ${user.id}`)
        setSpotifyState({
          sdk,
          refreshTokenIntervalId,
          player: playbackSdk.player,
          playbackInstance: playbackSdk.playbackInstance,
          user,
        })
      } catch (e) {
        log.error(FLAVORS.SPOTIFY, `failed to initialize spotify: ${e}`)
        throw e
      }
    },
    []
  )

  const teardown = React.useCallback(() => {
    log.info(FLAVORS.SPOTIFY, 'tearing down spotify')
    if (spotifyState) {
      const { refreshTokenIntervalId, player } = spotifyState
      window.clearInterval(refreshTokenIntervalId)
      player.disconnect()
      setSpotifyState(undefined)
    }
  }, [spotifyState])

  const actions: SpotifyActions = React.useMemo(
    () => ({ initialize, teardown }),
    [initialize, teardown]
  )

  return (
    <SpotifyStateContext.Provider value={spotifyState}>
      <SpotifyActionContext.Provider value={actions}>
        {children}
      </SpotifyActionContext.Provider>
    </SpotifyStateContext.Provider>
  )
}
