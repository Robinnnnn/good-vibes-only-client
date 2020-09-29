import React from 'react'
import useSWR from 'swr'

type PlaybackState = {
  isPlaying: boolean
  progressMs: number
  selectedTrack: any // TODO: spotify track
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
  const { data: playback } = useSWR('getMyCurrentPlaybackState', {
    refreshInterval: 10000,
  })

  const {
    is_playing: isPlaying,
    progress_ms: progressMs,
    item: selectedTrack,
    context,
  } = playback

  const state = { isPlaying, progressMs, selectedTrack, context }

  const isSelectedTrack = React.useCallback(
    (id: string) => {
      return selectedTrack.id === id
    },
    [selectedTrack.id]
  )

  const actions: PlaybackActions = React.useMemo(() => ({ isSelectedTrack }), [
    isSelectedTrack,
  ])

  return (
    <PlaybackStateContext.Provider value={state}>
      <PlaybackActionsContext.Provider value={actions}>
        {children}
      </PlaybackActionsContext.Provider>
    </PlaybackStateContext.Provider>
  )
}
