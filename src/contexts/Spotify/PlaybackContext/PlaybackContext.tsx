import React from 'react'
import useSWR from 'swr'
import { useSpotifyState } from '../ConfigContext/ConfigContext'
import log, { FLAVORS } from '../../../util/log'
import { SECOND } from '../../../util/time'

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

type ProgressState = {
  progressMs: number
}

const ProgressStateContext = React.createContext<ProgressState | undefined>(
  undefined
)

export const usePlaybackProgress = (): ProgressState => {
  const context = React.useContext(ProgressStateContext)
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
    { refreshInterval: 2 * SECOND }
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
      progress_ms: progressMs,
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

    // TODO: similar to progressRef further below, it might make sense to make all of these
    // refs, and have callbacks to retrieve the latest value (getIsPlaying, getSelectedTrack)
    // this is because changing `isPlaying` and `selectedTrack` have undesirable effects where
    // all callbacks/states that are subscribed to them as dependences end up re-rendering
    const playbackState = React.useMemo(() => ({ isPlaying, selectedTrack }), [
      isPlaying,
      selectedTrack,
    ])

    const progressState = React.useMemo(() => ({ progressMs }), [progressMs])

    // since progress changes often, it's not a great thing to have in a dependency array;
    // a ref is used instead
    const progressRef = React.useRef<number>(progressMs)
    React.useEffect(() => {
      progressRef.current = progressMs
    }, [progressMs])

    const selectedTrackId = React.useMemo(() => selectedTrack?.id, [
      selectedTrack,
    ])
    const isSelectedTrack = React.useCallback(
      (id: string) => selectedTrackId === id,
      [selectedTrackId]
    )

    const { sdk } = useSpotifyState()

    // TODO: this needs to handle if no tracks are active at all, play first track in playlist
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
        const playOptions: SpotifyApi.PlayParameterObject = {
          // playlist URI
          context_uri: playlistUri,
          // track URI
          offset: { uri: track.uri },
          // either resume track or start from beginning
          position_ms: shouldResume ? progressRef.current : 0,
        }
        sdk.play(playOptions)
        setIsPlaying(true)
        setSelectedTrack(track)
      },
      [isPlaying, selectedTrack, isSelectedTrack, playlistUri, sdk]
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
      const selectedTrackInSync = serverSelectedTrack?.id === selectedTrackId
      const playStateInSync = serverIsPlaying === isPlaying
      const synced = selectedTrackInSync && playStateInSync

      console.log({
        serverIsPlaying,
        isPlaying,
        synced,
        optimisticUpdateInProgress,
      })

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
    ])

    const actions: PlaybackActions = React.useMemo(
      () => ({ isSelectedTrack, playPauseTrack }),
      [isSelectedTrack, playPauseTrack]
    )

    return (
      <PlaybackStateContext.Provider value={playbackState}>
        <ProgressStateContext.Provider value={progressState}>
          <PlaybackActionsContext.Provider value={actions}>
            {children}
          </PlaybackActionsContext.Provider>
        </ProgressStateContext.Provider>
      </PlaybackStateContext.Provider>
    )
  }
)
