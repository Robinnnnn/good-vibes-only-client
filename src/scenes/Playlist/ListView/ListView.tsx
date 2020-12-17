import React from 'react'
import styled from '@emotion/styled'
import AnimatedDraggableList from './AnimatedDraggableList'
import Track from './Track'
// import Deck from './Deck'

const TRACKS_TO_DISPLAY = 50

const useMemoizedTrackList = (items) => {
  const hash = React.useMemo(
    () =>
      items
        .slice(0, TRACKS_TO_DISPLAY)
        .map((item) => item.track.id)
        .join('-'),
    [items]
  )

  // only update playlist array if track composition changes;
  // otherwise, we'll have a LOT of React re-renders as we poll
  // for the latest state
  //
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useMemo(() => items.slice(0, TRACKS_TO_DISPLAY), [hash])
}

type Props = {
  data: any
}

const ListView: React.FC<Props> = ({ data }) => {
  const tracks = useMemoizedTrackList(
    data.tracks.items.slice(0, TRACKS_TO_DISPLAY)
  )
  // const tracks = data.tracks.items

  const TrackRow = React.useCallback(
    ({ position }) => (
      <Track
        key={tracks[position].track.id}
        position={position}
        data={tracks[position].track}
      />
    ),
    [tracks]
  )

  return (
    <ListContainer>
      <AnimatedDraggableList
        numItems={tracks.length}
        ChildComponent={TrackRow}
      />
    </ListContainer>
    // <Deck />
  )
}

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
`

export default ListView
