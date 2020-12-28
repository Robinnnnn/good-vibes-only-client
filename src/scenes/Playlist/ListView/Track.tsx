import React from 'react'
import { css, keyframes } from '@emotion/core'
import styled from '@emotion/styled'
import AlbumCover from './AlbumCover'
import TrackInfo from './TrackInfo'
import { useAnimatedProgress } from '../shared/AnimatedText'
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
      isPlaying={isPlaying}
      isPaused={isPaused}
      className='track'
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onClick={handlePlayPause}
    >
      <_Lift position={position}>
        <AlbumCover
          position={position}
          imgUrl={track.album.images[0].url}
          isHovering={isHovering}
          isPlaying={isPlaying}
          isPaused={isPaused}
        />
      </_Lift>
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

const staggeredFade = ({ position }) => css`
  opacity: 0;
  animation: ${fadein} 1200ms;
  animation-delay: ${position * 100}ms;
  animation-fill-mode: forwards;
`

const lift = keyframes`
  from {
    transform: translateY(-30px);
  }
  to {
    transform: translateY(0px);
  }
`

const staggeredLift = ({ position }) => css`
  animation: ${lift} 1200ms;
  animation-delay: ${position * 100}ms;
  animation-fill-mode: forwards;
`

const _Lift = styled.div<{ position: number }>`
  ${staggeredLift}
`

const popRightAndScaleOnHover = ({ isHovering }) => css`
  ${isHovering ? 'transform: translateX(30px) scale(1.25)' : ''}
`

const popRightOnPlay = ({ isPlaying }) => css`
  ${isPlaying ? 'transform: translateX(70px)' : ''}
`

const popRightOnPause = ({ isPaused }) => css`
  ${isPaused ? 'transform: translateX(70px)' : ''}
`

const scaleOnPlay = ({ isPlaying }) => css`
  ${isPlaying ? 'transform: scale(1)' : ''}
`

const scaleOnPause = ({ isPaused }) => css`
  ${isPaused ? 'transform: scale(1)' : ''}
`

const TrackContainer = styled.div<{
  position: number
  isHovering: boolean
  isPlaying: boolean
  isPaused: boolean
}>`
  position: absolute;
  width: 500px;

  display: flex;
  justify-content: left;
  align-items: center;

  height: 128px;

  cursor: pointer;
  user-select: none;

  transition: transform 0.7s cubic-bezier(0.14, 0.97, 1, 1);

  ${staggeredFade}
  ${popRightAndScaleOnHover}
  ${popRightOnPlay}
  ${popRightOnPause}
  ${scaleOnPlay}
  ${scaleOnPause}
`

export default React.memo(Track)
