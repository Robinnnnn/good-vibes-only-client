import React from 'react'
import { css, keyframes } from '@emotion/core'
import styled from '@emotion/styled'
import AlbumCover from './AlbumCover'
import TrackInfo from './TrackInfo'
import { useAnimatedProgress } from './AnimatedText'
import {
  usePlaybackActions,
  usePlaybackState,
} from '../../../contexts/Spotify/PlaybackContext/PlaybackContext'

type Props = {
  position: number
  data: SpotifyApi.TrackObjectFull
}

const Track: React.FC<Props> = ({ position, data: track }) => {
  const { isPlaying: activePlayback } = usePlaybackState()
  const { isSelectedTrack, playPauseTrack } = usePlaybackActions()
  const isSelected = isSelectedTrack(track.id)
  const isPlaying = isSelected && activePlayback
  const isPaused = isSelected && !isPlaying

  const [isHovering, setIsHovering] = React.useState(false)
  const enableHover = React.useCallback(() => setIsHovering(true), [])
  const disableHover = React.useCallback(() => setIsHovering(false), [])

  const { progress, animateText, deanimateText } = useAnimatedProgress()

  const handleMouseOver = React.useCallback(() => {
    enableHover()
    animateText()
  }, [enableHover, animateText])

  const handleMouseLeave = React.useCallback(() => {
    disableHover()
    deanimateText()
  }, [disableHover, deanimateText])

  const handlePlayPause = React.useCallback(() => {
    playPauseTrack(track)
  }, [playPauseTrack, track])

  return (
    <TrackContainer
      position={position}
      isHovering={isHovering}
      className='track'
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onClick={handlePlayPause}
    >
      <AlbumCover
        position={position}
        imgUrl={track.album.images[0].url}
        isHovering={isHovering}
        isPlaying={isPlaying}
        isPaused={isPaused}
      />
      <TrackInfo
        position={position}
        data={track}
        progress={progress}
        isHovering={isHovering}
        isPlaying={isPlaying}
        isPaused={isPaused}
      />
    </TrackContainer>
  )
}

const fadein = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const popRightOnHover = ({ isHovering }) => css`
  ${isHovering ? 'transform: translateX(30px)' : ''}
`

const staggeredFade = ({ position }) => css`
  opacity: 0;
  animation: ${fadein} 1200ms;
  animation-delay: ${position * 100}ms;
  animation-fill-mode: forwards;
  transition: transform 0.5s cubic-bezier(0.14, 0.97, 1, 1);
`

const TrackContainer = styled.div<{ position: number; isHovering: boolean }>`
  position: absolute;
  width: 500px;

  display: flex;
  justify-content: left;
  align-items: center;

  height: 128px;

  cursor: pointer;
  user-select: none;

  ${staggeredFade}
  ${popRightOnHover}
`

export default Track