import React from 'react'
import styled from '@emotion/styled'
import { css, keyframes } from '@emotion/core'

import AnimatedText from '../shared/AnimatedText'
import { AnimatedValue } from 'react-spring'

import BlurEdges, { BLUR_LEVEL } from '../shared/BlurEdges'
import Marquee, { SCROLL_SPEED } from '../shared/Marquee'

// dimensions for track title container
const TEXT_HEIGHT = 21
const TEXT_WIDTH = 120

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
  const ScrollingText = React.useMemo(() => {
    const animatedText = (
      <AnimatedText
        text={data.name}
        textWidth={TEXT_WIDTH}
        progress={progress}
      />
    )
    if (isPlaying) {
      return <Marquee speed={SCROLL_SPEED.FAST}>{animatedText}</Marquee>
    }
    if (isPaused || isHovering) {
      return <Marquee speed={SCROLL_SPEED.SLOW}>{animatedText}</Marquee>
    }
    return animatedText
  }, [data.name, isHovering, isPaused, isPlaying, progress])

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
        <BlurEdges
          leftActive={isHovering || isPaused || isPlaying}
          rightActive
          blurLevel={BLUR_LEVEL.MEDIUM}
        >
          <_FullText>{ScrollingText}</_FullText>
        </BlurEdges>
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
    height: ${TEXT_HEIGHT}px;
    opacity: 1;
  }
`

const TrackInfoContainer = styled.div<{
  isHovering: boolean
  isPaused: boolean
  isPlaying: boolean
}>`
  width: ${TEXT_WIDTH}px;
  height: ${TEXT_HEIGHT}px;

  padding-top: 10px;

  position: relative;

  display: flex;
  flex-direction: column;

  transition: transform 0.5s cubic-bezier(0.14, 0.97, 1, 1);
  opacity: 0.95;
`

const liftTitle = ({ isHovering, isPlaying, isPaused }) => {
  if (isPlaying)
    return css`
      transform: translateY(4px);
    `
  if (isHovering || isPaused) {
    return css`
      transform: translateY(-6px);
    `
  }
}

const TitleContainer = styled.div<{
  position: number
  isHovering: boolean
  isPlaying: boolean
  isPaused: boolean
}>`
  overflow: hidden;

  text-transform: lowercase;
  font-weight: 800;
  font-size: 14px;

  /* initial animation state */
  height: 0px;
  opacity: 0;

  animation: ${reveal} 400ms;
  animation-delay: ${({ position }) => `${500 + position * 50}ms`};
  animation-fill-mode: forwards;

  transition: transform 0.5s cubic-bezier(0.14, 0.97, 1, 1);
  ${liftTitle}
`

// ensures the text takes up its full width beneath the parent
const _FullText = styled.div`
  width: max-content;
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

export default React.memo(TrackInfo)
