import React from 'react'
import styled from '@emotion/styled'
import { css, keyframes } from '@emotion/core'

type Props = {
  position: number
  imgUrl: string
  hoverEnabled: boolean
}

const AlbumCover: React.FC<Props> = ({ position, imgUrl, hoverEnabled }) => {
  return (
    <Wrapper hoverEnabled={hoverEnabled}>
      <CoverContainer className='container' position={position}>
        {/* scales slightly up to reduce width of border */}
        <CoverScaleWrapper className='pic-scale-wrapper'>
          <Cover className='pic' src={imgUrl} />
        </CoverScaleWrapper>
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

const Wrapper = styled.div<{ hoverEnabled: boolean }>`
  width: 88px;
  height: 88px;
  transform: scale(1);

  transition: transform 0.2s cubic-bezier(0.14, 0.97, 1, 1);

  ${({ hoverEnabled }) =>
    hoverEnabled &&
    css`
      transform: scale(1.2);

      .pic-scale-wrapper {
        transform: scale(1.05);
      }

      .pic {
        animation: ${spin} 10s linear infinite;
        filter: brightness(100%);
      }

      .hole {
        transform: scale(1);
      }
    `}

  &:active {
    transform: scale(1);
  }

  &:active .pic {
    transform: scale(1);
  }
`

const CoverScaleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  transform: scale(1);
  transition: transform 0.2s cubic-bezier(0.14, 0.97, 1, 1);
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

const CoverContainer = styled.div<{ position: number }>`
  position: relative;
  border-radius: 100%;
  width: 88px;
  height: 88px;
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

const Cover = styled.img`
  position: absolute;
  border-radius: 100%;
  width: 80px;
  height: 80px;
  filter: brightness(80%);

  transition: filter 0.6s cubic-bezier(0.14, 0.97, 1, 1);
`

const Hole = styled.div`
  position: absolute;
  background: white;
  width: 12px;
  height: 12px;
  border-radius: 100%;

  transition: transform 0.2s ease-in;
  transform: scale(0);

  box-shadow: inset 2px 2px 2px 1px #e5e5e5;
`

export default AlbumCover
