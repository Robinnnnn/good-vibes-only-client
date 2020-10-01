import React from 'react'
import styled from '@emotion/styled'
import { css, keyframes } from '@emotion/core'

import AnimatedText from './AnimatedText'
import { AnimatedValue } from 'react-spring'

type Props = {
  data: SpotifyApi.TrackObjectFull
  position: number
  // @ts-expect-error
  progress: AnimatedValue
  hoverEnabled: boolean
  isSelected: boolean
}

const TrackInfo: React.FC<Props> = ({
  position,
  data,
  progress,
  hoverEnabled,
  isSelected,
}) => {
  return (
    <TrackInfoContainer hoverEnabled={hoverEnabled} isSelected={isSelected}>
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
    opacity: 0;
  }
  to {
    height: 21px;
    opacity: 1;
  }
`

const TrackInfoContainer = styled.div<{
  hoverEnabled: boolean
  isSelected: boolean
}>`
  display: flex;
  flex-direction: column;
  transform: translateX(40px);

  transition: transform 0.5s cubic-bezier(0.14, 0.97, 1, 1);

  ${({ hoverEnabled, isSelected }) => {
    if (isSelected) {
      return css`
        transform: translateX(160px);
      `
    }

    if (hoverEnabled) {
      return css`
        transform: translateX(70px);
      `
    }
  }}
`

const TitleContainer = styled.div<{ position: number }>`
  text-transform: lowercase;
  font-weight: 800;

  /* initial animation state */
  height: 0px;
  opacity: 0;

  animation: ${reveal} 400ms;
  animation-delay: ${({ position }) => `${500 + position * 100}ms`};
  animation-fill-mode: forwards;
`

const ArtistContainer = styled.div`
  margin-top: 4px;
  font-size: 12px;
  text-transform: lowercase;
`

export default TrackInfo
