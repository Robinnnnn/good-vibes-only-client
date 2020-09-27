import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { useAuthActions } from '../../contexts/Auth'
import useSWR from 'swr'
import styled from '@emotion/styled'
import AnimatedDraggableList from './AnimatedDraggableList'
import Track from './Track'

const usePlaybackState = () => {
  const { data: playback } = useSWR('getMyCurrentPlaybackState', {
    refreshInterval: 10000,
  })

  const {
    is_playing: isPlaying,
    progress_ms: progressMs,
    item: selectedTrack,
  } = playback

  return { isPlaying, progressMs, selectedTrack }
}

const useMemoizedTrackList = (items) => {
  const hash = React.useMemo(
    () =>
      items
        .slice(0, 5)
        .map((item) => item.track.id)
        .join('-'),
    [items]
  )

  return React.useMemo(() => items.slice(0, 5), [hash])
}

const Playlist: React.FC<RouteComponentProps> = ({ id }) => {
  const { logout } = useAuthActions()

  const props = React.useMemo(() => ['getPlaylist', id], [id])

  const { data } = useSWR(props)

  const tracks = useMemoizedTrackList(data.tracks.items.slice(0, 5))
  // const tracks = data.tracks.items

  // const { isPlaying, progressMs, selectedTrack } = usePlaybackState()

  const selectedTrack = false

  const TrackChild = React.useCallback(
    ({ position }) => (
      <Track
        key={tracks[position].track.id}
        position={position}
        data={tracks[position].track}
        isSelected={selectedTrack?.id === tracks[position].track.id}
      />
    ),
    [tracks, selectedTrack]
  )

  console.log('playlist render')

  return (
    <PlaylistContainer>
      <Tracks>
        <AnimatedDraggableList
          numItems={tracks.length}
          ChildComponent={TrackChild}
        />
      </Tracks>
      {/* <button onClick={logout}>logout</button> */}
    </PlaylistContainer>
  )
}

const PlaylistContainer = styled.div`
  padding: 80px 200px;
`

const Tracks = styled.div`
  display: flex;
  flex-direction: column;
`

export default Playlist
