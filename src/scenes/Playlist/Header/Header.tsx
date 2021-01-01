import React from 'react'
import styled from '@emotion/styled'
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
    </Container>
  )
}

const Container = styled.div`
  position: fixed;
  height: 100vh;
  display: flex;
  flex-direction: column;

  border: 1px solid red;
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
  /* actually adds padding to bottom due to rotation */
  padding-top: 100px;
`

const PlaylistTitle = styled.div`
  font-size: 50px;
`

// const PlaylistDescription = styled.div`
//   font-size: 12px;
// `

const PlaylistDetails = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
`

const PlaylistCoverContainer = styled.div`
  width: 80px;
  height: 80px;
`

const Cover = styled.img`
  width: 100%;
`

export default React.memo(Header)
