import React from 'react'
import styled from '@emotion/styled'
import Track from './Track'

type Props = {
  data: any
}

const GridView: React.FC<Props> = ({ data }) => {
  return (
    <GridContainer>
      {data.tracks.items.map(({ track }, index) => (
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

export default GridView
