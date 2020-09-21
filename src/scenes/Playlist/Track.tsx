import React from 'react'
import { keyframes } from '@emotion/core'
import styled from '@emotion/styled'
import AlbumCover from './AlbumCover'
import TrackInfo from './TrackInfo'

type Props = {
  position: number
  data: any
}

const Track: React.FC<Props> = ({ position, data }) => {
  return (
    <TrackContainer position={position} className='track'>
      <AlbumCover position={position} imgUrl={data.album.images[0].url} />
      <TrackInfo position={position} data={data} />
    </TrackContainer>
  )
}

const fadein = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const TrackContainer = styled.div<{ position: number }>`
  position: absolute;
  width: 500px;

  /* background: white; */

  display: flex;
  justify-content: left;
  align-items: center;

  margin: 10px;
  cursor: pointer;
  user-select: none;

  opacity: 0;
  animation: ${fadein} 1200ms;
  animation-delay: ${({ position }) => `${position * 100}ms`};
  animation-fill-mode: forwards;
`

export default Track
