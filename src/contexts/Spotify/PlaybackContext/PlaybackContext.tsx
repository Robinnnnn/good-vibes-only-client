import React from 'react'
import useSWR from 'swr'
import { useSpotifyState } from '../ConfigContext/ConfigContext'

type PlaybackState = {
  isPlaying: boolean
  progressMs: number
  selectedTrack: SpotifyApi.TrackObjectFull // TODO: spotify track
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

export const PlaybackProvider: React.FC = ({ children }) => {
  const { sdk } = useSpotifyState()

  const { data: playback } = useSWR('getMyCurrentPlaybackState', {
    refreshInterval: 5000,
  })

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

  const isSelectedTrack = React.useCallback(
    (id: string) => selectedTrack.id === id,
    [selectedTrack.id]
  )

  const playTrack = React.useCallback(
    (track: SpotifyApi.TrackObjectFull) => {
      const playOptions = {
        // playlist URI
        context_uri: context.uri,
        // track URI
        offset: { uri: track.uri },
      }
      sdk.play(playOptions)
      console.log('immediately setting track', track.name)
      setSelectedTrack(track)
      setOptimisticUpdateInProgress(true)
    },
    [sdk, context.uri]
  )

  // TODOOOOOOOO
  React.useEffect(() => {
    // Handles race condition where cached server data is outdated
    // compared to what user clicked
    console.log(
      'server',
      serverSelectedTrack.name,
      'client',
      selectedTrack.name,
      'optimisticUpdateInProgress',
      optimisticUpdateInProgress
    )
    if (
      optimisticUpdateInProgress &&
      serverSelectedTrack.id !== selectedTrack.id
    )
      return

    if (serverSelectedTrack.id !== selectedTrack.id) {
      setSelectedTrack(serverSelectedTrack)
      setOptimisticUpdateInProgress(false)
    }
  }, [serverSelectedTrack, optimisticUpdateInProgress, selectedTrack])

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
