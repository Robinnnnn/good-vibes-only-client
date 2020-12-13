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
    <Wrapper
      size={thumbnailSize}
      isHovering={isHovering}
      isPlaying={isPlaying}
      isPaused={isPaused}
    >
      <CoverContainer
        size={thumbnailSize}
        className='container'
        position={position}
      >
        {/* slightly scales up the inner image to reduce width of outer "lip" */}
        <_ImgScaler
          isHovering={isHovering}
          isPlaying={isPlaying}
          isPaused={isPaused}
        >
          <Cover className='pic' src={imgUrl} size={thumbnailSize} />
        </_ImgScaler>
        <Hole className='hole' />
      </CoverContainer>
    </Wrapper>
  )
}

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

const activeHole = css`
  .hole {
    transform: scale(1);
  }
`

const Wrapper = styled.div<{
  isHovering: boolean
  isPlaying: boolean
  isPaused: boolean
  size: number
}>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};

  transform: scale(1);

  transition: transform 0.7s cubic-bezier(0.14, 0.97, 1, 1);

  ${({ isHovering, isPlaying, isPaused }) => {
    if (isPlaying) {
      return css`
        .pic {
          ${standardSpin}
          filter: brightness(100%);
        }

        ${activeHole}
      `
    }

    if (isPaused) {
      return css`
        .pic {
          ${standardSpin}
          /* give paused tracks an "inactive" look */
          filter: brightness(80%);
        }

        ${activeHole}
      `
    }

    if (isHovering) {
      return css`
        .pic {
          ${slowSpin}
          filter: brightness(100%);
        }

        ${activeHole}
      `
    }
  }}
`

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

const fadein = keyframes`
  from {
    opacity: 0;
    transform: rotate(-180deg) scale(0.1);
    margin-top: 20px;
  }
  to {
    opacity: 1;
    transform: rotate(0deg) scale(1);
    margin-top: 0px;
  }
`

const CoverContainer = styled.div<{ size: number; position: number }>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
  position: relative;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  opacity: 0;
  animation: ${fadein} 1200ms;
  animation-delay: ${({ position }) => `${position * 100}ms`};
  animation-fill-mode: forwards;
  animation-timing-function: cubic-bezier(0,1.39,.67,.98);

  /* neumorphism */
  background: #ffffff;
box-shadow:  12px 12px 24px #d1d1d1, 
             -12px -12px 24px #ffffff;
  /* background: #f6e9ff;
  box-shadow: 2px 2px 3px #d6cbde, -2px -2px 3px #ffffff; */
 
  /* dark mode */
 /* background: #303030;
box-shadow:  14px 14px 26px #131313, 
             -14px -14px 26px #4d4d4d; */
}`

const Cover = styled.img<{ size: number }>`
  position: absolute;
  border-radius: 100%;
  width: ${({ size }) => `${size - 8}px`};
  height: ${({ size }) => `${size - 8}px`};
  filter: brightness(80%);

  transition: filter 0.6s cubic-bezier(0.14, 0.97, 1, 1);
`

const Hole = styled.div`
  position: absolute;
  background: white;
  width: 11px;
  height: 11px;
  border-radius: 100%;

  transition: transform 0.2s ease-in;
  transform: scale(0);

  box-shadow: inset 2px 2px 2px 1px #e5e5e5;
`

export default AlbumCover
