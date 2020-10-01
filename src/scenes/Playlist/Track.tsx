import React from 'react'
import { keyframes } from '@emotion/core'
import styled from '@emotion/styled'
import AlbumCover from './AlbumCover'
import TrackInfo from './TrackInfo'
import { useAnimatedProgress } from './AnimatedText'
import {
  usePlaybackActions,
  usePlaybackState,
} from '../../contexts/Spotify/PlaybackContext/PlaybackContext'
import { useSpotifyState } from '../../contexts/Spotify/ConfigContext/ConfigContext'

type Props = {
  position: number
  data: SpotifyApi.TrackObjectFull
}

const Track: React.FC<Props> = ({ position, data: track }) => {
  const { isSelectedTrack, playTrack } = usePlaybackActions()
  const isSelected = isSelectedTrack(track.id)

  const [hoverEnabled, setHoverEnabled] = React.useState(false)
  const enableHover = React.useCallback(() => setHoverEnabled(true), [])
  const disableHover = React.useCallback(() => setHoverEnabled(false), [])

  const { progress, animateText, deanimateText } = useAnimatedProgress()

  const handleMouseOver = React.useCallback(() => {
    enableHover()
    animateText()
  }, [enableHover, animateText])

  const handleMouseLeave = React.useCallback(() => {
    disableHover()
    deanimateText()
  }, [disableHover, deanimateText])

  const { sdk } = useSpotifyState()
  const { isPlaying } = usePlaybackState()
  const thisTrackIsPlaying = isSelected && isPlaying
  const handlePlay = React.useCallback(() => {
    if (thisTrackIsPlaying) {
      sdk.pause()
      return
    }
    playTrack(track)
  }, [thisTrackIsPlaying, playTrack, track, sdk])

  return (
    <TrackContainer
      position={position}
      className='track'
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onClick={handlePlay}
    >
      <AlbumCover
        position={position}
        imgUrl={track.album.images[0].url}
        hoverEnabled={hoverEnabled}
        isSelected={isSelected}
      />
      <TrackInfo
        position={position}
        data={track}
        progress={progress}
        hoverEnabled={hoverEnabled}
        isSelected={isSelected}
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

const TrackContainer = styled.div<{ position: number }>`
  position: absolute;
  width: 500px;

  display: flex;
  justify-content: left;
  align-items: center;

  height: 128px;

  cursor: pointer;
  user-select: none;

  opacity: 0;
  animation: ${fadein} 1200ms;
  animation-delay: ${({ position }) => `${position * 100}ms`};
  animation-fill-mode: forwards;

  transition: transform 0.5s cubic-bezier(0.14, 0.97, 1, 1);
`
export default Track
