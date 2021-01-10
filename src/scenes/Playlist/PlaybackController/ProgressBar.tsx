import React from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/core'
import { usePlaybackProgress } from '../../../contexts/Spotify/PlaybackContext/PlaybackContext'

type Props = {}

const ProgressBar: React.FC<Props> = ({}) => {
  const { progressMs } = usePlaybackProgress()

  console.log('progress', progressMs)

  return (
    <ProgressBorder>
      <GradientBorder />
      <ProgressCurtain />
    </ProgressBorder>
  )
}

// TODO: make component if exists in multiple places
const backgroundGradient = keyframes`
  from {
    background-position: 0;
  }
  to {
    background-position: 100%;
  }
`

const ProgressBorder = styled.div`
  position: relative;
  height: 3px;
  width: 100%;
`

const GradientBorder = styled.div`
  height: 100%;

  background: linear-gradient(
    90deg,
    #ae70ff 0%,
    #93d6ff 15%,
    #8589ff 35%,
    #ae70ff 50%,
    #93d6ff 65%,
    #8589ff 85%,
    #ae70ff 100%
  );
  background-size: 200% 100%;
  animation: ${backgroundGradient} 5s linear infinite reverse;
`

const ProgressCurtain = styled.div`
  position: absolute;

  height: 100%;
  background: white;
  opacity: 0.6;
  top: 0;
  right: 0;
  width: 33%;
`

export default React.memo(ProgressBar)
