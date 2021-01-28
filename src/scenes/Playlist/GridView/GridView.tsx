import React from 'react'
import styled from '@emotion/styled'
import Track from './Track'

type Props = {
  playlist: SpotifyApi.SinglePlaylistResponse
}

const START_INDEX = 0
const TRACKS_TO_DISPLAY = 50

const GridView: React.FC<Props> = ({ playlist }) => {
  return (
    <GridContainer>
      {playlist.tracks.items
        .slice(START_INDEX, START_INDEX + TRACKS_TO_DISPLAY)
        .map(({ track }, index) => (
          <Track key={track.id} position={index} data={track} />
        ))}
    </GridContainer>
  )
}

const GridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

export default React.memo(GridView)
