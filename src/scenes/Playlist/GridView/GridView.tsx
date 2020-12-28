import React from 'react'
import styled from '@emotion/styled'
import Track from './Track'

type Props = {
  data: any
}

const TRACKS_TO_DISPLAY = 50

const GridView: React.FC<Props> = ({ data }) => {
  return (
    <GridContainer>
      {data.tracks.items.slice(0, TRACKS_TO_DISPLAY).map(({ track }, index) => (
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
