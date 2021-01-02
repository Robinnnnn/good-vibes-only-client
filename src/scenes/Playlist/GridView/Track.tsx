import React from 'react'
import { css, keyframes } from '@emotion/core'
import styled from '@emotion/styled'
import {
  usePlaybackActions,
  usePlaybackState,
} from '../../../contexts/Spotify/PlaybackContext/PlaybackContext'
import { useAnimatedProgress } from '../shared/AnimatedText'
import AlbumCover from '../shared/AlbumCover/AlbumCover'
import TrackInfo from './TrackInfo'

/**
 * using css here because importing an SVG filepath into emotionjs is unclear
 */
import './cursor.css'

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
  }, [animateText, enableHover])

  const handleMouseLeave = React.useCallback(() => {
    disableHover()
    deanimateText()
  }, [deanimateText, disableHover])

  const handlePlayPause = React.useCallback(() => {
    playPauseTrack(track)
  }, [playPauseTrack, track])

  const className = React.useMemo(() => {
    return isPlaying ? 'track playing' : 'track'
  }, [isPlaying])

  return (
    <TrackContainer
      position={position}
      isHovering={isHovering}
      isPlaying={isPlaying}
      isPaused={isPaused}
      className={className}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onClick={handlePlayPause}
    >
      <AlbumCover
        position={position}
        thumbnailSize={100}
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

const staggeredFade = ({ position }) => css`
  opacity: 0;
  animation: ${fadein} 1200ms;
  animation-delay: ${position * 50}ms;
  animation-fill-mode: forwards;
`

const TrackContainer = styled.div<{
  position: number
  isHovering: boolean
  isPlaying: boolean
  isPaused: boolean
}>`
  width: 140px;

  /* ensures hover effects take place even when cursor is "in between" elements */
  padding: 20px;

  display: flex;
  justify-content: center;
  align-items: center;

  flex-direction: column;

  user-select: none;

  transition: transform 0.5s cubic-bezier(0.14, 0.97, 1, 1);

  ${staggeredFade}
`

export default React.memo(Track)
