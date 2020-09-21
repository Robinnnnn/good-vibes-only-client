import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { useAuthActions } from '../../contexts/Auth'
import useSWR from 'swr'
import styled from '@emotion/styled'
import clamp from 'lodash.clamp'
import swap from 'lodash-move'
import { useGesture } from 'react-use-gesture'
import { useSprings, animated, interpolate } from 'react-spring'
import Track from './Track'

const height = 108

const fn = (order, down, originalIndex, curIndex, y) => (index) =>
  down && index === originalIndex
    ? {
        y: curIndex * height + y,
        scale: 1.3,
        zIndex: '1',
        // shadow: 15,
        immediate: (n) => n === 'y' || n === 'zIndex',
      }
    : {
        y: order.indexOf(index) * height,
        scale: 1,
        zIndex: '0',
        // shadow: 1,
        immediate: false,
      }

const Playlist: React.FC<RouteComponentProps> = ({ id }) => {
  const { logout } = useAuthActions()

  const { data } = useSWR(['getPlaylist', id])

  const tracks = data.tracks.items.slice(0, 10)
  const covers = tracks.map((t) => t.track.album.images)
  console.log(tracks)

  const order = React.useRef(tracks.map((_, index) => index)) // Store indicies as a local ref, this represents the item order
  const [springs, setSprings] = useSprings(tracks.length, fn(order.current)) // Create springs, each corresponds to an item, controlling its transform, scale, etc.
  console.log({ springs })
  const bind = useGesture(({ args: [originalIndex], down, delta: [, y] }) => {
    const curIndex = order.current.indexOf(originalIndex)
    const curRow = clamp(
      Math.round((curIndex * height + y) / 100),
      0,
      tracks.length - 1
    )
    const newOrder = swap(order.current, curIndex, curRow)
    setSprings(fn(newOrder, down, originalIndex, curIndex, y)) // Feed springs new style data, they'll animate the view without causing a single render
    if (!down) order.current = newOrder
  })

  return (
    <PlaylistContainer>
      <Tracks>
        {springs.map(({ zIndex, shadow, y, scale }, i) => (
          <animated.div
            {...bind(i)}
            key={i}
            style={{
              zIndex,
              // boxShadow: shadow.interpolate(
              //   (s) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`
              // ),
              transform: interpolate(
                [y, scale],
                (y, s) => `translate3d(0,${y}px,0) scale(${s})`
              ),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            children={
              <Track
                key={tracks[i].track.id}
                position={i}
                data={tracks[i].track}
              />
            }
          />
        ))}
      </Tracks>
      {/* <button onClick={logout}>logout</button> */}
    </PlaylistContainer>
  )
}

const PlaylistContainer = styled.div`
  padding: 80px 200px;
`

const Tracks = styled.div`
  display: flex;
  flex-direction: column;
`

export default Playlist
