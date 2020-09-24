import React from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/core'

import AnimatedText from './AnimatedText'
import { AnimatedValue } from 'react-spring'

type Props = {
  data: any
  position: number
  // @ts-expect-error
  progress: AnimatedValue
}

const TrackInfo: React.FC<Props> = ({ position, data, progress }) => {
  return (
    <TrackInfoContainer>
      <TitleContainer position={position}>
        <AnimatedText text={data.name} progress={progress} />
      </TitleContainer>
      <ArtistContainer>{data.artists[0].name}</ArtistContainer>
    </TrackInfoContainer>
  )
}

const reveal = keyframes`
  from {
    height: 0px;
  }
  to {
    height: 21px;
  }
`

const TitleContainer = styled.div<{ position: number }>`
  text-transform: lowercase;
  font-weight: 800;
  height: 0px;

  animation: ${reveal} 400ms;
  animation-delay: ${({ position }) => `${500 + position * 100}ms`};
  animation-fill-mode: forwards;
`

const TrackInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 40px;
`

const ArtistContainer = styled.div`
  margin-top: 4px;
  font-size: 12px;
  text-transform: lowercase;
`

export default TrackInfo
