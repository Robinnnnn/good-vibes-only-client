import React from 'react'
import styled from '@emotion/styled'
import { css, keyframes } from '@emotion/core'
import { ImageWithSuspense } from '../../../../contexts/ImageLoader/ImageLoaderContext'
import GradientBackground from './GradientBackground'

type Props = {
  position: number
  thumbnailSize: number
  imgUrl: string
  isHovering: boolean
  isPlaying: boolean
  isPaused: boolean
}

const AlbumCover: React.FC<Props> = ({
  position,
  thumbnailSize,
  imgUrl,
  isHovering,
  isPlaying,
  isPaused,
}) => {
  return (
    <_Scale isHovering={isHovering} isPlaying={isPlaying} isPaused={isPaused}>
      <CoverContainer
        size={thumbnailSize}
        className='container'
        position={position}
        isPlaying={isPlaying}
      >
        <GradientBackground isPlaying={isPlaying}>
          {/* slightly scales up the inner image to reduce width of outer "lip" */}
          <_ImgScaler
            isHovering={isHovering}
            isPlaying={isPlaying}
            isPaused={isPaused}
          >
            <ImageWithSuspense
              src={imgUrl}
              Component={
                <Cover
                  src={imgUrl}
                  size={thumbnailSize}
                  isHovering={isHovering}
                  isPlaying={isPlaying}
                  isPaused={isPaused}
                />
              }
            />
          </_ImgScaler>
        </GradientBackground>
        <Hole
          isHovering={isHovering}
          isPlaying={isPlaying}
          isPaused={isPaused}
        />
      </CoverContainer>
    </_Scale>
  )
}

const rotateIn = keyframes`
  from {
    transform: rotate(-180deg) scale(0.1) translateY(50px);
  }
  to {
    transform: rotate(0deg) scale(1) translateY(0px);
  }
`

const liftAndScaleOnHover = ({ isHovering }) => css`
  ${isHovering ? 'transform: translateY(-15px) scale(1.15)' : ''}
`

const scaleOnPlay = ({ isPlaying }) => css`
  ${isPlaying ? 'transform: translateY(-25px) scale(1.55)' : ''}
`

const scaleOnPause = ({ isPaused }) => css`
  ${isPaused ? 'transform: translateY(-15px) scale(1.25)' : ''}
`

const _Scale = styled.div<{
  isHovering: boolean
  isPlaying: boolean
  isPaused: boolean
}>`
  transition: transform 0.5s cubic-bezier(0.14, 0.97, 1, 1);
  ${liftAndScaleOnHover}
  ${scaleOnPlay}
  ${scaleOnPause}
`

const CoverContainer = styled.div<{
  size: number
  position: number
  isPlaying: boolean
}>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  position: relative;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  animation: ${rotateIn} 1200ms;
  animation-delay: ${({ position }) => `${position * 50}ms`};
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(0,1.39,.67,.98);

  /* neumorphism */
  /*background: ${({ isPlaying }) =>
    isPlaying
      ? `linear-gradient(90deg,#c79cff,#93d6ff 33%,#9da0ff 66%,#c091ff)`
      : '#ffffff'};
  box-shadow: ${({ isPlaying }) =>
    isPlaying ? `3px 3px 8px #dbc5ff` : '6px 6px 24px #d1d1d1'};*/
  /* box-shadow: 0px 6px 10px #d1d1d1; */

  transition: 3s cubic-bezier(0.14, 0.97, 1, 1);
  
  /* background: #f6e9ff;
  box-shadow: 2px 2px 3px #d6cbde, -2px -2px 3px #ffffff; */
 
  /* dark mode */
  /* background: #303030;
  box-shadow:  14px 14px 26px #131313, 
             -14px -14px 26px #4d4d4d; */
}`

const _ImgScaler = styled.div<{
  isHovering: boolean
  isPlaying: boolean
  isPaused: boolean
}>`
  display: flex;
  justify-content: center;
  align-items: center;

  transform: scale(1);
  transition: transform 0.2s cubic-bezier(0.14, 0.97, 1, 1);

  ${({ isHovering, isPlaying, isPaused }) => css`
    ${isHovering || isPlaying || isPaused ? 'transform: scale(1.03)' : ''}
  `}
`

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const standardSpin = css`
  animation: ${spin} 8s linear infinite;
`

const slowSpin = css`
  animation: ${spin} 8s linear infinite;
`

const Cover = styled.img<{
  size: number
  isHovering: boolean
  isPlaying: boolean
  isPaused: boolean
}>`
  position: absolute;
  border-radius: 100%;

  ${({ size, isPlaying }) => {
    if (isPlaying) return `width: ${size - 6}px;`
    return `width: ${size - 8}px;`
  }};

  filter: ${({ isHovering, isPlaying }) => `
    brightness(${isPlaying ? 100 : isHovering ? 93 : 80}%)
  `};
  transition: filter 0.8s cubic-bezier(0.14, 0.97, 1, 1);

  opacity: ${({ isPlaying }) => (isPlaying ? 0.85 : 0.9)};

  ${({ isHovering, isPlaying, isPaused }) => {
    if (isHovering) return slowSpin
    if (isPlaying || isPaused) return standardSpin
  }};
`

const Hole = styled.div<{
  isHovering: boolean
  isPlaying: boolean
  isPaused: boolean
}>`
  position: absolute;
  background: white;
  width: 11px;
  height: 11px;
  border-radius: 100%;
  box-shadow: ${({ isPlaying }) =>
    isPlaying
      ? `inset 2px 2px 2px 1px #dbc5ff`
      : 'inset 2px 2px 2px 1px #e5e5e5'};

  transition: transform 0.2s ease-in;
  transform: scale(0);

  transform: ${({ isHovering, isPlaying, isPaused }) => `
    scale(${isHovering || isPlaying || isPaused ? 1 : 0})
  `};
`

export default React.memo(AlbumCover)
