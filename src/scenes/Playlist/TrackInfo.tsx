import React from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/core'

type Props = {
  data: any
  position: number
}

const TrackInfo: React.FC<Props> = ({ position, data }) => {
  console.log(data)
  return (
    <TrackInfoContainer>
      <TitleContainer position={position}>{data.name}</TitleContainer>
      <ArtistContainer>{data.artists[0].name}</ArtistContainer>
    </TrackInfoContainer>
  )
}

const TrackInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 40px;
`

const fadein = keyframes`
  from {
    height: 0px;
  }
  to {
    height: 21px;
  }
`

const TitleContainer = styled.div<{ position: number }>`
  text-transform: lowercase;
  background: linear-gradient(
    90deg,
    #ab6bff,
    #9ad5f9 15%,
    #575df0 35%,
    #ab6bff 50%,
    #9ad5f9 65%,
    #575df0 85%,
    #ab6bff
  );
  /* rainbow */
  /* background: linear-gradient(
    110.78deg,
    #76e650 -1.13%,
    #f9d649 15.22%,
    #f08e35 32.09%,
    #ec5157 48.96%,
    #ff18bd 67.94%,
    #1a4bff 85.34%,
    #62d8f9 99.57%
  ); */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  font-weight: 800;
  height: 0px;

  animation: ${fadein} 400ms;
  animation-delay: ${({ position }) => `${500 + position * 100}ms`};
  animation-fill-mode: forwards;
`
const ArtistContainer = styled.div`
  margin-top: 4px;
  font-size: 12px;
  text-transform: lowercase;
`

export default TrackInfo
