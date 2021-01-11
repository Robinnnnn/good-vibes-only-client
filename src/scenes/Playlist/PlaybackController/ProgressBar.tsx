import React from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/core'
import { usePlaybackProgress } from '../../../contexts/Spotify/PlaybackContext/PlaybackContext'

type Props = {
  duration?: number
  isPlaying: boolean
}

// TODO BUG! displayed progress lags considerably when switching from one
// song to another. the "client-side progress" will probably have to be lifted
// into a context, then we'll have to handle optimistic update / sync logic...

const ProgressBar: React.FC<Props> = ({ duration, isPlaying }) => {
  // progress according to server
  const { progressMs } = usePlaybackProgress()

  const normalizedProgress = React.useMemo(
    () => (duration ? Number(((100 * progressMs) / duration).toFixed(2)) : 0),
    [progressMs, duration]
  )

  return (
    <ProgressBorder>
      <GradientBorder />
      <ProgressCurtain progress={normalizedProgress} />
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

const ProgressCurtain = styled.div<{ progress: number }>`
  position: absolute;

  height: 100%;
  background: white;
  opacity: 0.6;
  top: 0;
  right: 0;
  width: ${({ progress }) => 100 - progress}%;
`

export default React.memo(ProgressBar)
