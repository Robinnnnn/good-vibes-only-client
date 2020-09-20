import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { useAuthActions } from '../../contexts/Auth'
import useSWR from 'swr'
import styled from '@emotion/styled'
import AlbumCover from './AlbumCover'

const Playlist: React.FC<RouteComponentProps> = ({ id }) => {
  const { logout } = useAuthActions()

  const { data } = useSWR(['getPlaylist', id])

  const tracks = data.tracks.items.slice(0, 16)
  const covers = tracks.map((t) => t.track.album.images)
  console.log(covers)

  return (
    <PlaylistContainer>
      <Tracks>
        {covers.map(([c], index) => (
          <Track key={c.url}>
            <AlbumCover index={index} imgUrl={c.url} />
          </Track>
        ))}
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
  /* flex-direction: column; */
  flex-wrap: wrap;
`

const Track = styled.div`
  margin: 10px;
`

export default Playlist
