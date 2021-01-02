import React from 'react'
import styled from '@emotion/styled'
import { keyframes } from '@emotion/core'
import { msToTimestamp } from '../../../util/time'
import { ImageWithSuspense } from '../../../contexts/ImageLoader/ImageLoaderContext'
import ExternalLink from '../../../shared/notifications/ExternalLink'

type Props = {
  data: SpotifyApi.SinglePlaylistResponse
}

const Header: React.FC<Props> = ({ data: playlist }) => {
  console.log({ playlist })

  const duration = React.useMemo(
    () =>
      msToTimestamp(
        playlist.tracks.items.reduce((d, i) => d + i.track.duration_ms, 0)
      ),
    [playlist.tracks.items]
  )

  return (
    <Container>
      <Content>
        <_RotateVertical>
          <TitleContainer>
            <PlaylistTitle>{playlist.name}</PlaylistTitle>
            {/* description seems kinda confusing to have sideways... figure out what to do with this later
          <PlaylistDescription>{playlist.description}</PlaylistDescription> */}
          </TitleContainer>
          {/* put details somewhere else ...
        <PlaylistDetails>
          <span>Tracks: {playlist.tracks.items.length}</span>
          <span>Followers: {playlist.followers.total}</span>
          <span>Duration: {duration}</span>
          <span>Producer: {playlist.owner.id}</span>
        </PlaylistDetails> */}
        </_RotateVertical>
        <PlaylistCoverContainer>
          <ExternalLink to={playlist.external_urls.spotify}>
            <ImageWithSuspense
              src={playlist.images[0].url}
              Component={<Cover src={playlist.images[0].url} />}
            />
          </ExternalLink>
        </PlaylistCoverContainer>
      </Content>
      <GradientBorder />
    </Container>
  )
}

const Container = styled.div`
  position: fixed;
  height: 100vh;
  display: flex;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
`

const backgroundGradient = keyframes`
  from {
    background-position: 0;
  }
  to {
    background-position: 100%;
  }
`

const GradientBorder = styled.div`
  /* attributes are flipped because we're rotated */
  height: 2px;
  width: 100vh;
  transform: rotate(90deg);
  transform-origin: top left;

  /* needs to appear beneath album cover */
  z-index: -1;

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
  animation: ${backgroundGradient} 2s linear infinite;
`

const _RotateVertical = styled.div`
  height: 100%;
  transform: rotate(180deg);
  writing-mode: vertical-rl;

  display: flex;
`

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* moves text closer to line */
  transform: translateX(-22px);
  /* actually adds padding to bottom due to rotation */
  padding-top: 20px;
`

const PlaylistTitle = styled.div`
  font-size: 50px;
`

// const PlaylistDescription = styled.div`
//   font-size: 12px;
// `

// const PlaylistDetails = styled.div`
//   display: flex;
//   flex-direction: column;
//   font-size: 12px;
// `

const PlaylistCoverContainer = styled.div`
  width: 80px;
  height: 80px;
`

const Cover = styled.img`
  width: 100%;
`

export default React.memo(Header)
