import React from 'react'
import styled from '@emotion/styled'
import { css, keyframes } from '@emotion/core'

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
        {/* slightly scales up the inner image to reduce width of outer "lip" */}
        <_ImgScaler
          isHovering={isHovering}
          isPlaying={isPlaying}
          isPaused={isPaused}
        >
          <Cover
            src={imgUrl}
            size={thumbnailSize}
            isHovering={isHovering}
            isPlaying={isPlaying}
            isPaused={isPaused}
          />
        </_ImgScaler>
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
  cursor: pointer;

  animation: ${rotateIn} 1200ms;
  animation-delay: ${({ position }) => `${position * 50}ms`};
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(0,1.39,.67,.98);

  /* neumorphism */
  background: #ffffff;
  box-shadow:  12px 12px 24px #d1d1d1;

  transition: 0.3s cubic-bezier(0.14, 0.97, 1, 1);

  ${({ isPlaying }) => (isPlaying ? `box-shadow: 5px 5px 12px #ceafff` : '')};
  
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
  width: ${({ size }) => `${size - 8}px`};
  height: ${({ size }) => `${size - 8}px`};

  filter: ${({ isHovering, isPlaying }) => `
    brightness(${isPlaying ? 100 : isHovering ? 93 : 80}%)
  `};
  transition: filter 0.8s cubic-bezier(0.14, 0.97, 1, 1);

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
  box-shadow: inset 2px 2px 2px 1px #e5e5e5;

  transition: transform 0.2s ease-in;
  transform: scale(0);

  transform: ${({ isHovering, isPlaying, isPaused }) => `
    scale(${isHovering || isPlaying || isPaused ? 1 : 0})
  `};
`

export default AlbumCover
