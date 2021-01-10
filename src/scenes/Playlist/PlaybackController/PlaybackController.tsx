import React from 'react'
import styled from '@emotion/styled'

import { usePlaybackState } from '../../../contexts/Spotify/PlaybackContext/PlaybackContext'
import ExternalLink from '../../../shared/notifications/ExternalLink'
import { ImageWithSuspense } from '../../../contexts/ImageLoader/ImageLoaderContext'
import PlaybackNav from './PlaybackNav'
import ProgressBar from './ProgressBar'

type Props = {}

const PlaybackController: React.FC<Props> = () => {
  // TODO: check if we can make a connected component using next ~5 lines
  // to prevent frequent rerenders. right now `selectedTrack` will log every second
  const { isPlaying, selectedTrack } = usePlaybackState()

  return (
    <Container>
      <ProgressBar
        duration={selectedTrack?.duration_ms}
        isPlaying={isPlaying}
      />
      <Content>
        <TextContent>
          <PlaybackNav />
          {selectedTrack ? (
            <TrackDetails>
              <div>{selectedTrack.name}</div>
              <TrackArtists>
                {selectedTrack.artists.map((artist, i) => (
                  <ArtistAndPlus key={artist.name}>
                    <ExternalLink to={artist.external_urls.spotify}>
                      {artist.name}
                    </ExternalLink>
                    {i !== selectedTrack.artists.length - 1 ? (
                      <Plus>+</Plus>
                    ) : null}
                  </ArtistAndPlus>
                ))}
              </TrackArtists>
            </TrackDetails>
          ) : null}
        </TextContent>
        {/* <PlaylistCoverContainer>
          <ExternalLink to={selectedTrack.external_urls.spotify}>
            <ImageWithSuspense
              // TODO: this pulls the highest res image, which is probably over kill
              // we need to do this though since sometimes images[1] doesn't exist
              src={selectedTrack.album.images[0].url}
              Component={<Cover src={selectedTrack.album.images[0].url} />}
            />
          </ExternalLink>
        </PlaylistCoverContainer> */}
      </Content>
    </Container>
  )
}

// controller will take the form of a footer
const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  bottom: 0;
  width: 100%;

  height: 80px;
  background: white;

  /* inset version */
  /* box-shadow: inset 6px 0px 20px -10px #888cff; */
  box-shadow: 6px 0px 8px -2px #a1a4ff;
`

const Content = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const TextContent = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`

const TrackDetails = styled.div`
  display: flex;
  flex-direction: column;
  text-transform: lowercase;
  position: absolute;
  left: 0;
`

const TrackArtists = styled.div`
  display: flex;
`

const ArtistAndPlus = styled.div`
  display: flex;
`

const Plus = styled.div`
  padding: 0px 6px;
`

const PlaylistCoverContainer = styled.div`
  width: 80px;
  height: 80px;
`

const Cover = styled.img`
  width: 100%;
`

export default React.memo(PlaybackController)
