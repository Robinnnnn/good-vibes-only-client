import React from 'react'
import styled from '@emotion/styled'
import { css, keyframes } from '@emotion/core'

import AnimatedText from '../shared/AnimatedText'
import { AnimatedValue } from 'react-spring'

type Props = {
  data: SpotifyApi.TrackObjectFull
  position: number
  // @ts-expect-error
  progress: AnimatedValue
  isHovering: boolean
  isPaused: boolean
  isPlaying: boolean
}

const TrackInfo: React.FC<Props> = ({
  position,
  data,
  progress,
  isHovering,
  isPaused,
  isPlaying,
}) => {
  return (
    <TrackInfoContainer
      isHovering={isHovering}
      isPaused={isPaused}
      isPlaying={isPlaying}
    >
      <TitleContainer
        position={position}
        isHovering={isHovering}
        isPaused={isPaused}
        isPlaying={isPlaying}
      >
        <AnimatedText text={data.name} progress={progress} />
      </TitleContainer>
      <ArtistContainer
        isHovering={isHovering}
        isPaused={isPaused}
        isPlaying={isPlaying}
      >
        {data.artists[0].name}
      </ArtistContainer>
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
  isHovering: boolean
  isPaused: boolean
  isPlaying: boolean
}>`
  width: 100px;

  padding-top: 10px;

  position: relative;

  display: flex;
  flex-direction: column;

  transition: transform 0.5s cubic-bezier(0.14, 0.97, 1, 1);
  opacity: 0.95;

  ${({ isHovering, isPlaying, isPaused }) => {
    // if (isPlaying) {
    //   return css`
    //     transform: translateX(160px);
    //     opacity: 1;
    //   `
    // }
    // if (isPaused) {
    //   return css`
    //     transform: translateX(160px);
    //   `
    // }
    // if (isHovering) {
    //   return css`
    //     transform: translateX(70px);
    //     opacity: 1;
    //   `
    // }
  }}
`

const liftTitle = ({ isHovering, isPlaying, isPaused }) => {
  if (isPlaying) return ''
  if (isHovering || isPaused) {
    return css`
      transform: translateY(-10px);
    `
  }
}

const TitleContainer = styled.div<{
  position: number
  isHovering: boolean
  isPlaying: boolean
  isPaused: boolean
}>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;

  text-transform: lowercase;
  font-weight: 800;

  /* initial animation state */
  height: 0px;
  opacity: 0;

  animation: ${reveal} 400ms;
  animation-delay: ${({ position }) => `${500 + position * 50}ms`};
  animation-fill-mode: forwards;

  transition: transform 0.5s cubic-bezier(0.14, 0.97, 1, 1);
  ${liftTitle}
`

const liftArtist = ({ isHovering, isPlaying, isPaused }) => {
  if (isPlaying)
    return css`
      top: 30px;
    `
  if (isHovering || isPaused) {
    return css`
      top: 20px;
    `
  }
}

const ArtistContainer = styled.div<{
  isHovering: boolean
  isPlaying: boolean
  isPaused: boolean
}>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100px;

  margin-top: 4px;
  font-size: 12px;
  text-transform: lowercase;

  position: absolute;
  top: 10px;
  width: 100%;

  transition: 0.5s cubic-bezier(0.14, 0.97, 1, 1);

  opacity: ${({ isHovering, isPlaying, isPaused }) =>
    isHovering || isPlaying || isPaused ? 1 : 0};
  ${liftArtist}
`

export default TrackInfo
