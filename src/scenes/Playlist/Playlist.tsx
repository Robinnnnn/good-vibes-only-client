import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { useAuthActions } from '../../contexts/Auth/AuthContext'
import useSWR from 'swr'
import styled from '@emotion/styled'
import AnimatedDraggableList from './AnimatedDraggableList'
import Track from './Track'
import { PlaybackProvider } from '../../contexts/Spotify/PlaybackContext/PlaybackContext'

const TRACKS_TO_DISPLAY = 10

const useMemoizedTrackList = (items) => {
  const hash = React.useMemo(
    () =>
      items
        .slice(0, TRACKS_TO_DISPLAY)
        .map((item) => item.track.id)
        .join('-'),
    [items]
  )

  // only update playlist array if track composition changes;
  // otherwise, we'll have a LOT of React re-renders as we poll
  // for the latest state
  //
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(() => items.slice(0, TRACKS_TO_DISPLAY), [hash])
}

const Playlist: React.FC<RouteComponentProps> = ({ id: playlistId }) => {
  const { logout } = useAuthActions()

  const { data } = useSWR(['getPlaylist', playlistId])

  const tracks = useMemoizedTrackList(
    data.tracks.items.slice(0, TRACKS_TO_DISPLAY)
  )
  // const tracks = data.tracks.items

  const TrackRow = React.useCallback(
    ({ position }) => (
      <Track
        key={tracks[position].track.id}
        position={position}
        data={tracks[position].track}
      />
    ),
    [tracks]
  )

  return (
    <PlaybackProvider playlistUri={data.uri}>
      <PlaylistContainer>
        <Tracks>
          <AnimatedDraggableList
            numItems={tracks.length}
            ChildComponent={TrackRow}
          />
        </Tracks>
        {/* <button onClick={logout}>logout</button> */}
      </PlaylistContainer>
    </PlaybackProvider>
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
