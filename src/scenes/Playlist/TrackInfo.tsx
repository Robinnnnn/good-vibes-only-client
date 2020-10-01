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
  isPaused: boolean
  isPlaying: boolean
}

const TrackInfo: React.FC<Props> = ({
  position,
  data,
  progress,
  hoverEnabled,
  isPaused,
  isPlaying,
}) => {
  return (
    <TrackInfoContainer
      hoverEnabled={hoverEnabled}
      isPaused={isPaused}
      isPlaying={isPlaying}
    >
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
  isPaused: boolean
  isPlaying: boolean
}>`
  display: flex;
  flex-direction: column;
  transform: translateX(40px);

  transition: transform 0.5s cubic-bezier(0.14, 0.97, 1, 1);
  opacity: 0.9;

  ${({ hoverEnabled, isPlaying, isPaused }) => {
    if (isPlaying) {
      return css`
        transform: translateX(160px);
        opacity: 1;
      `
    }

    if (isPaused) {
      return css`
        transform: translateX(160px);
      `
    }

    if (hoverEnabled) {
      return css`
        transform: translateX(70px);
        opacity: 1;
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
