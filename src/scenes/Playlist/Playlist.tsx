import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { useAuthActions } from '../../contexts/Auth/AuthContext'
import useSWR from 'swr'
import styled from '@emotion/styled'
import { PlaybackProvider } from '../../contexts/Spotify/PlaybackContext/PlaybackContext'
import ListView from './ListView/ListView'
import GridView from './GridView/GridView'
import { navigate } from '@reach/router'

/**
 * Matches the 22-char Spotify ID out of the following strings:
 * - https://open.spotify.com/playlist/37i9dQZF1DX0A8zVl7p82B?si=l1xTw-wbR9G9a3SZxPowxw
 * - spotify:playlist:37i9dQZF1DX0A8zVl7p82B
 * - 37i9dQZF1DX0A8zVl7p82B
 */
function processPlaylistId(id: string): string | undefined {
  return id.match(/(playlist(\/|:))?([a-zA-Z0-9]{22})/)?.[3]
}

const Playlist: React.FC<RouteComponentProps<{ idOrSpotifyLink: string }>> = ({
  idOrSpotifyLink,
}) => {
  const playlistId = processPlaylistId(idOrSpotifyLink)

  const { logout } = useAuthActions()

  const { data } = useSWR(['getPlaylist', playlistId])

  const [view, setView] = React.useState<'list' | 'grid'>('grid')

  if (!playlistId) {
    navigate('404')
    return
  }

  /**
   * this `navigate` call simply changes the URL to the processed ID, without re-rendering the component
   * e.g. from http://localhost:8888/playlist/spotify:playlist:37i9dQZF1DX0A8zVl7p82B
   *        to http://localhost:8888/playlist/37i9dQZF1DX0A8zVl7p82B
   */
  if (playlistId !== idOrSpotifyLink)
    navigate(`/playlist/${playlistId}`, { replace: true })

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
