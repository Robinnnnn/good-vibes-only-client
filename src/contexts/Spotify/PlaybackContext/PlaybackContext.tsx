import React from 'react'
import useSWR from 'swr'

type PlaybackState = {
  isPlaying: boolean
  progressMs: number
  selectedTrack: any // TODO: spotify track
}

const PlaybackContext = React.createContext<PlaybackState | undefined>(
  undefined
)

export const usePlaybackState = (): PlaybackState => {
  const context = React.useContext(PlaybackContext)
  if (!context) {
    throw Error('Attempted to use SpotifyState without a provider!')
  }
  return context
}

export const useIsSelectedTrack = ({ id }) => {
  const { selectedTrack } = usePlaybackState()
  return React.useMemo(() => selectedTrack.id === id, [selectedTrack, id])
}

export const PlaybackProvider: React.FC = ({ children }) => {
  const { data: playback } = useSWR('getMyCurrentPlaybackState', {
    refreshInterval: 10000,
  })

  const {
    is_playing: isPlaying,
    progress_ms: progressMs,
    item: selectedTrack,
  } = playback

  const state = { isPlaying, progressMs, selectedTrack }

  return (
    <PlaybackContext.Provider value={state}>
      {children}
    </PlaybackContext.Provider>
  )
}
