import React from 'react'
import useSWR from 'swr'
import { useSpotifyState } from '../ConfigContext/ConfigContext'
import log, { FLAVORS } from '../../../util/log'
import { SECOND } from '../../../util/time'

type PlaybackState = {
  isPlaying: boolean
  progressMs: number
  selectedTrack?: SpotifyApi.TrackObjectFull // TODO: spotify track
  context: SpotifyApi.CurrentlyPlayingObject // TODO: playback context
}

const PlaybackStateContext = React.createContext<PlaybackState | undefined>(
  undefined
)

export const usePlaybackState = (): PlaybackState => {
  const context = React.useContext(PlaybackStateContext)
  if (!context) {
    throw Error('Attempted to use SpotifyState without a provider!')
  }
  return context
}

type PlaybackActions = {
  isSelectedTrack: (id: string) => boolean
  playTrack: (track: SpotifyApi.TrackObjectFull) => void
}

const PlaybackActionsContext = React.createContext<PlaybackActions | undefined>(
  undefined
)

export const usePlaybackActions = (): PlaybackActions => {
  const context = React.useContext(PlaybackActionsContext)
  if (!context) {
    throw Error('Attempted to use SpotifyActions without a provider!')
  }
  return context
}

type Props = {
  playlistUri: string
}

/**
 * Polls a user's playback status. If none is found (e.g. user doesn't have app open elsewhere),
 * the useEffect is triggered to use the current browser window as the active playback device.
 * Specifically, it handles:
 * - When a user opens the site without having any other apps open
 * - When a user has both the site + Spotify native app open, and closes the native app
 */
const usePlayback = (): SpotifyApi.CurrentlyPlayingObject => {
  const {
    sdk,
    playbackInstance: { device_id: thisDeviceId },
  } = useSpotifyState()

  const { data: playback } = useSWR('getMyCurrentPlaybackState', {
    refreshInterval: 30 * SECOND,
  })

  const initializePlaybackOnCurrentDevice = React.useCallback(async () => {
    // https://doxdox.org/jmperez/spotify-web-api-js#src-spotify-web-api.js-constr.prototype.transfermyplayback
    await sdk.transferMyPlayback([thisDeviceId], { play: false })
  }, [sdk, thisDeviceId])

  React.useEffect(() => {
    if (!playback) {
      log.error(
        FLAVORS.DEFAULT,
        'no active device found; initializing your browser window as device'
      )
      initializePlaybackOnCurrentDevice()
    }
  }, [playback, initializePlaybackOnCurrentDevice])

  return playback
}

export const PlaybackProvider: React.FC<Props> = ({
  playlistUri,
  children,
}) => {
  const playback = usePlayback()

  const {
    is_playing: isPlaying,
    progress_ms: progressMs,
    item: serverSelectedTrack,
    context,
  } = playback

  const [selectedTrack, setSelectedTrack] = React.useState<
    SpotifyApi.TrackObjectFull
  >(serverSelectedTrack)
  const [
    optimisticUpdateInProgress,
    setOptimisticUpdateInProgress,
  ] = React.useState<boolean>(false)

  const state = { isPlaying, progressMs, selectedTrack, context }

  const selectedTrackId = React.useMemo(() => selectedTrack?.id, [
    selectedTrack,
  ])
  const isSelectedTrack = React.useCallback(
    (id: string) => selectedTrackId === id,
    [selectedTrackId]
  )

  const { sdk } = useSpotifyState()
  const contextUri = React.useMemo(() => context?.uri || playlistUri, [
    context,
    playlistUri,
  ])
  const playTrack = React.useCallback(
    (track: SpotifyApi.TrackObjectFull) => {
      // TODO: handle RESUME

      const playOptions = {
        // playlist URI
        context_uri: contextUri,
        // track URI
        offset: { uri: track.uri },
      }
      sdk.play(playOptions)
      setSelectedTrack(track)
      setOptimisticUpdateInProgress(true)
    },
    [contextUri, sdk]
  )

  // console.log({
  //   server: serverSelectedTrack?.name,
  //   ui: selectedTrack?.name,
  //   optimisticUpdateInProgress,
  // })

  /**
   * Handles race condition where cached server data is outdated
   * compared to what user clicked
   */
  React.useEffect(() => {
    // if server and UI are out of sync
    if (serverSelectedTrack?.id !== selectedTrackId) {
      // UI change; ignore server and exit early
      if (optimisticUpdateInProgress) return
      // Server change; apply to UI
      setSelectedTrack(serverSelectedTrack)
      setOptimisticUpdateInProgress(false)
    }

    // if server and UI are in sync
    if (serverSelectedTrack?.id === selectedTrackId) {
      // reset optimistic update state for next action
      if (optimisticUpdateInProgress) {
        setOptimisticUpdateInProgress(false)
      }
    }
  }, [serverSelectedTrack, optimisticUpdateInProgress, selectedTrackId])

  const actions: PlaybackActions = React.useMemo(
    () => ({ isSelectedTrack, playTrack }),
    [isSelectedTrack, playTrack]
  )

  return (
    <PlaybackStateContext.Provider value={state}>
      <PlaybackActionsContext.Provider value={actions}>
        {children}
      </PlaybackActionsContext.Provider>
    </PlaybackStateContext.Provider>
  )
}
