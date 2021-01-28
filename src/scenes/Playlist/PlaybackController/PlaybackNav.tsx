import React from 'react'
import styled from '@emotion/styled'
import { ReactComponent as PlayIcon } from '../../../icons/play.svg'
import { ReactComponent as PauseIcon } from '../../../icons/pause.svg'
import { ReactComponent as PreviousIcon } from '../../../icons/previous.svg'
import {
  usePlaybackActions,
  usePlaybackState,
} from '../../../contexts/Spotify/PlaybackContext/PlaybackContext'

const PlaybackNav: React.FC = () => {
  // TODO: check if we can make a connected component using next ~5 lines
  // to prevent frequent rerenders
  const { isPlaying } = usePlaybackState()
  const { playPauseTrack } = usePlaybackActions()

  const handlePlayPause = React.useCallback(() => {
    // TODO: this needs to handle if no tracks are available at all, play first track in playlist
    playPauseTrack()
  }, [playPauseTrack])

  return (
    <PlaybackNavContainer>
      <NavIconContainer size={14}>
        <PreviousIcon />
      </NavIconContainer>
      <NavIconContainer size={22} onClick={handlePlayPause}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </NavIconContainer>
      <NavIconContainer size={14}>
        <_Rotate times={2}>
          <PreviousIcon />
        </_Rotate>
      </NavIconContainer>
    </PlaybackNavContainer>
  )
}

const PlaybackNavContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const NavIconContainer = styled.div<{ size: number }>`
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    cursor: pointer;
    width: ${({ size }) => `${size}px`};
    height: ${({ size }) => `${size}px`};
  }
`

const _Rotate = styled.div<{ times: number }>`
  display: flex;
  transform: ${({ times }) => `rotate(${90 * times}deg)`};
`

export default React.memo(PlaybackNav)
