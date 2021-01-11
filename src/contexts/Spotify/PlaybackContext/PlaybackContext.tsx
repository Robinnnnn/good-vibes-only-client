import React from 'react'
import useSWR from 'swr'
import { useSpotifyState } from '../ConfigContext/ConfigContext'
import log, { FLAVORS } from '../../../util/log'
import { PLAYBACK_REFRESH_INTERVAL } from './constants'
import useOptimisticProgress, {
  ProgressControls,
} from './useOptimisticProgress'

type PlaybackState = {
  isPlaying: boolean
  selectedTrack?: SpotifyApi.TrackObjectFull
}

const PlaybackStateContext = React.createContext<PlaybackState | undefined>(
  undefined
)

export const usePlaybackState = (): PlaybackState => {
  const context = React.useContext(PlaybackStateContext)
  if (!context) {
    throw Error('Attempted to use PlaybackState without a provider!')
  }
  return context
}

const PlaybackProgressContext = React.createContext<
  ProgressControls | undefined
>(undefined)

export const usePlaybackProgress = (): ProgressControls => {
  const context = React.useContext(PlaybackProgressContext)
  if (!context) {
    throw Error('Attempted to use ProgressState without a provider!')
  }
  return context
}

type PlaybackActions = {
  isSelectedTrack: (id: string) => boolean
  playPauseTrack: (track?: SpotifyApi.TrackObjectFull) => void
}

const PlaybackActionsContext = React.createContext<PlaybackActions | undefined>(
  undefined
)

export const usePlaybackActions = (): PlaybackActions => {
  const context = React.useContext(PlaybackActionsContext)
  if (!context) {
    throw Error('Attempted to use PlaybackActions without a provider!')
  }
  return context
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

  const { data: playback } = useSWR<SpotifyApi.CurrentPlaybackResponse>(
    'getMyCurrentPlaybackState',
    { refreshInterval: PLAYBACK_REFRESH_INTERVAL }
  )

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

type Props = { playlistUri: string }

export const PlaybackProvider: React.FC<Props> = React.memo(
  ({ playlistUri, children }) => {
    const playback = usePlayback()

    const {
      is_playing: serverIsPlaying,
      progress_ms: serverProgressMs,
      item: serverSelectedTrack,
      // TODO: there are more fields in here, such as `context`, which may
      // be useful in the future
    } = playback

    const [selectedTrack, setSelectedTrack] = React.useState<
      SpotifyApi.TrackObjectFull
    >(serverSelectedTrack)
    const [isPlaying, setIsPlaying] = React.useState<boolean>(serverIsPlaying)
    const [
      optimisticUpdateInProgress,
      setOptimisticUpdateInProgress,
    ] = React.useState<boolean>(false)

    const playbackState = React.useMemo(() => ({ isPlaying, selectedTrack }), [
      isPlaying,
      selectedTrack,
    ])

    const selectedTrackId = React.useMemo(() => selectedTrack?.id, [
      selectedTrack,
    ])
    const isSelectedTrack = React.useCallback(
      (id: string) => selectedTrackId === id,
      [selectedTrackId]
    )
    const selectedTrackInSync = serverSelectedTrack?.id === selectedTrackId

    const optimisticProgressProps = React.useMemo(
      () => ({
        serverProgressMs,
        selectedTrackInSync,
        isPlaying,
      }),
      [isPlaying, selectedTrackInSync, serverProgressMs]
    )
    const progressControls = useOptimisticProgress(optimisticProgressProps)
    const {
      setProgressMs,
      setLastManuallyTriggeredClientUpdate,
    } = progressControls

    // since progress changes often, it could trigger a ton of unintended rerenders
    // if placed in a dependency array; a ref is used instead.
    const progressRef = React.useRef<number>(serverProgressMs)
    React.useEffect(() => {
      progressRef.current = serverProgressMs
    }, [serverProgressMs])

    const { sdk } = useSpotifyState()

    // TODO: this needs to handle the followinng cases:
    // 1) if no tracks are active at all, play first track in playlist
    const playPauseTrack = React.useCallback(
      (track?: SpotifyApi.TrackObjectFull) => {
        setOptimisticUpdateInProgress(true)

        if (!track) track = selectedTrack

        const trackIsSelected = isSelectedTrack(track.id)
        const shouldPause = trackIsSelected && isPlaying
        if (shouldPause) {
          sdk.pause()
          setIsPlaying(false)
          return
        }

        const shouldResume = trackIsSelected && !isPlaying
        // either:
        // 1. resume active track from current location, or
        // 2. start from beginning (whether it's new track or current track)
        const progressMs = shouldResume ? progressRef.current : 0
        const playOptions: SpotifyApi.PlayParameterObject = {
          // playlist URI
          context_uri: playlistUri,
          // track URI
          offset: { uri: track.uri },
          position_ms: progressMs,
        }
        sdk.play(playOptions)
        setIsPlaying(true)
        setSelectedTrack(track)
        setProgressMs(progressMs)
        setLastManuallyTriggeredClientUpdate(Date.now())
      },
      [
        selectedTrack,
        isSelectedTrack,
        isPlaying,
        playlistUri,
        sdk,
        setProgressMs,
        setLastManuallyTriggeredClientUpdate,
      ]
    )

    /**
     * Handles race condition where cached server data is outdated
     * compared to what user clicked
     */
    React.useEffect(() => {
      const playStateInSync = serverIsPlaying === isPlaying
      const synced = selectedTrackInSync && playStateInSync

      // UI is source of truth; server will catch up
      if (optimisticUpdateInProgress && !synced) return

      // Server is source of truth; UI will catch up
      // NOTE: having `&& !synced` here might mess things up
      if (!optimisticUpdateInProgress && !synced) {
        setSelectedTrack(serverSelectedTrack)
        setIsPlaying(serverIsPlaying)
      }

      // UI and server are on the same page; reset optimistic update flag
      if (optimisticUpdateInProgress && synced) {
        setOptimisticUpdateInProgress(false)
      }
    }, [
      serverSelectedTrack,
      optimisticUpdateInProgress,
      selectedTrackId,
      serverIsPlaying,
      isPlaying,
      selectedTrackInSync,
    ])

    const actions: PlaybackActions = React.useMemo(
      () => ({ isSelectedTrack, playPauseTrack }),
      [isSelectedTrack, playPauseTrack]
    )

    return (
      <PlaybackStateContext.Provider value={playbackState}>
        <PlaybackProgressContext.Provider value={progressControls}>
          <PlaybackActionsContext.Provider value={actions}>
            {children}
          </PlaybackActionsContext.Provider>
        </PlaybackProgressContext.Provider>
      </PlaybackStateContext.Provider>
    )
  }
)
