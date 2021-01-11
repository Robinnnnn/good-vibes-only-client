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

const PROGRESS_BAR_HEIGHT_PX = 3
const CLICKABLE_PADDING_PX = 10

const ProgressBorder = styled.div`
  position: relative;
  height: ${PROGRESS_BAR_HEIGHT_PX}px;
  width: 100%;

  // add invisible padding so track seeking is easier to hover over with mouse
  padding: ${CLICKABLE_PADDING_PX}px 0px;
  margin-top: -${CLICKABLE_PADDING_PX}px;

  transform: scaleY(1);
  transition: transform 0.5s cubic-bezier(0.14, 0.97, 1, 1);

  &:hover {
    transform: scaleY(2.5);
  }
`

// TODO: make component if exists in multiple places
const backgroundGradient = keyframes`
  from {
    background-position: 0;
  }
  to {
    background-position: 100%;
  }
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

// a shrinking bar with white opacity, to pretend as if the colored
// progress bar is inching along from left to right
const ProgressCurtain = styled.div<{ progress: number }>`
  position: absolute;

  height: ${PROGRESS_BAR_HEIGHT_PX}px;
  background: white;
  opacity: 0.6;
  top: ${CLICKABLE_PADDING_PX}px;
  right: 0;
  width: ${({ progress }) => 100 - progress}%;
`

export default React.memo(ProgressBar)
