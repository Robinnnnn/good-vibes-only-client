import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { useAuthActions } from '../../contexts/Auth/AuthContext'
import useSWR from 'swr'
import styled from '@emotion/styled'
import { PlaybackProvider } from '../../contexts/Spotify/PlaybackContext/PlaybackContext'
import ListView from './ListView/ListView'
import GridView from './GridView/GridView'

const Playlist: React.FC<RouteComponentProps<{ id: string }>> = ({
  id: playlistId,
}) => {
  const { logout } = useAuthActions()

  const { data } = useSWR(['getPlaylist', playlistId])

  const [view, setView] = React.useState<'list' | 'grid'>('grid')

  return (
    <PlaybackProvider playlistUri={data.uri}>
      <PlaylistContainer>
        {view === 'list' ? <ListView data={data} /> : <GridView data={data} />}
      </PlaylistContainer>
    </PlaybackProvider>
  )
}

const PlaylistContainer = styled.div`
  padding: 80px 200px;
`

export default Playlist
