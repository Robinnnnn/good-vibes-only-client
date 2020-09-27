import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { useAuthActions } from '../../contexts/Auth/AuthContext'
import useSWR from 'swr'
import styled from '@emotion/styled'
import AnimatedDraggableList from './AnimatedDraggableList'
import Track from './Track'

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

  console.log('playlist render')

  return (
    <PlaylistContainer>
      <Tracks>
        <AnimatedDraggableList
          numItems={tracks.length}
          ChildComponent={TrackRow}
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
