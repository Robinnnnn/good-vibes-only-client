import React from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/core'

type Props = {
  isPlaying: boolean
}

const TRANSITION_MS = 1200

const GradientBackground: React.FC<Props> = React.memo(
  ({ isPlaying, children }) => {
    const [whiteMounted, setWhiteMounted] = React.useState(!isPlaying)
    const [gradientMounted, setGradientMounted] = React.useState(isPlaying)

    React.useEffect(() => {
      if (isPlaying && whiteMounted) {
        setGradientMounted(true)
        setTimeout(() => setWhiteMounted(false), TRANSITION_MS + 200)
      }
      if (!isPlaying && gradientMounted) {
        setWhiteMounted(true)
        setTimeout(() => setGradientMounted(false), TRANSITION_MS + 200)
      }
    }, [isPlaying, whiteMounted, gradientMounted])

    return (
      <>
        {whiteMounted && <White isPlaying={isPlaying} />}
        {gradientMounted && <Gradient isPlaying={isPlaying} />}
        {children}
      </>
    )
  }
)

const White = styled.div<{ isPlaying }>`
  position: absolute;

  width: 100%;
  height: 100%;
  border-radius: 100%;

  background: white;
  transition: opacity ${TRANSITION_MS}ms cubic-bezier(0.04, 0.64, 0.4, 1.02);
  opacity: ${({ isPlaying }) => (isPlaying ? 0 : 1)};

  box-shadow: 6px 6px 24px #d1d1d1;
`

const backgroundGradient = keyframes`
  from {
    background-position: 0;
  }
  to {
    background-position: 100%;
  }
`

const startColor = '#ae70ff'
const midColor = '#93d6ff'
const endColor = '#8589ff'

const Gradient = styled.div<{ isPlaying: boolean }>`
  position: absolute;

  width: 100%;
  height: 100%;
  border-radius: 100%;

  background: linear-gradient(
    90deg,
    ${startColor} 0%,
    ${midColor} 15%,
    ${endColor} 35%,
    ${startColor} 50%,
    ${midColor} 65%,
    ${endColor} 85%,
    ${startColor} 100%
  );
  background-size: 200% 100%;
  animation: ${backgroundGradient} 2s linear infinite;
  transition: opacity ${TRANSITION_MS}ms cubic-bezier(0.04, 0.64, 0.4, 1.02);
  opacity: ${({ isPlaying }) => (isPlaying ? 1 : 0)};

  box-shadow: 3px 3px 8px #dbc5ff;

  z-index: ${({ isPlaying }) => (isPlaying ? -1 : 0)};
`

export default GradientBackground
