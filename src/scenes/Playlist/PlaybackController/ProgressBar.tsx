import React from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/core'
import { usePlaybackProgress } from '../../../contexts/Spotify/PlaybackContext/PlaybackContext'

const UPDATE_PROGRESS_FREQUENCY_MS = 250

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

  // progress displayed on client
  const [clientProgressMs, setClientProgressMs] = React.useState<number>(0)
  const lastServerUpdate = React.useRef<number>(Date.now())

  // since server is the source of truth, immediately apply it to client
  React.useEffect(() => {
    setClientProgressMs(progressMs)
    lastServerUpdate.current = Date.now()
  }, [progressMs])

  // need this as a ref as to not kick off multiple fx / setIntervals below
  const isPlayingRef = React.useRef(isPlaying)
  React.useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])
  /**
   * we don't get updates from the server terribly often (every 2s,
   * but this will likely have to increase as we scale). in order to
   * prevent UI jank by only updating the progress bar every 2s, we
   * perform client-side updates more frequently, which helps to
   * "fill in the temporal gap"
   */
  React.useEffect(() => {
    const id = setInterval(() => {
      // stop the progress bar if we're not playing!
      if (!isPlayingRef.current) return

      // we don't want hyperactive update. if we just received a
      // server update very recently, we can skip
      const timeSinceLastUpdate = Date.now() - lastServerUpdate.current
      if (timeSinceLastUpdate > UPDATE_PROGRESS_FREQUENCY_MS) {
        setClientProgressMs((p) => p + UPDATE_PROGRESS_FREQUENCY_MS)
      }
    }, UPDATE_PROGRESS_FREQUENCY_MS)

    return () => clearInterval(id)
  }, [])

  const normalizedProgress = React.useMemo(
    () =>
      duration ? Number(((100 * clientProgressMs) / duration).toFixed(2)) : 0,
    [clientProgressMs, duration]
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
