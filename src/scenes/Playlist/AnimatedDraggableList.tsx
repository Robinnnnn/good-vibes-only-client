import React from 'react'
import { useSprings, animated, interpolate } from 'react-spring'
import { useGesture } from 'react-use-gesture'
import clamp from 'lodash.clamp'
import swap from 'lodash-move'

// reference: https://codesandbox.io/embed/r5qmj8m6lq

const TRACK_HEIGHT = 128

type GetSpringConfigProps = {
  trackOrder: number[]
  down?: boolean
  originalIndex?: number
  currentIndex?: number
  y?: number
}

type SpringConfig = {
  y: number
  scale: number
  zIndex: string
  immediate: any
}

type ReturnFunction = (key: number) => SpringConfig

const getSpringConfigForOrder = ({
  trackOrder,
  down,
  originalIndex,
  currentIndex,
  y,
}: GetSpringConfigProps): ReturnFunction => (position) =>
  down && position === originalIndex
    ? {
        y: currentIndex * TRACK_HEIGHT + y,
        scale: 0.9,
        zIndex: '1',
        immediate: (n) => n === 'y' || n === 'zIndex',
      }
    : {
        y: trackOrder.indexOf(position) * TRACK_HEIGHT,
        scale: 1,
        zIndex: '0',
        immediate: false,
      }

type AnimatedDraggableProps = {
  numItems: number
  ChildComponent: React.FC<{ position: number }>
}

const AnimatedDraggableList = ({
  numItems,
  ChildComponent,
}: AnimatedDraggableProps) => {
  const items = React.useMemo(() => [...Array(numItems).keys()], [numItems])
  // Store indicies as a local ref, this represents the item order
  const trackOrder = React.useRef(items.map((_, index) => index))
  // Create springs, each corresponds to an item, controlling its transform, scale, etc.
  const [springs, setSprings] = useSprings(
    numItems,
    // getSpringConfigForOrder({ trackOrder: trackOrder.current })
    getSpringConfigForOrder({ trackOrder: trackOrder.current })
  )
  const bind = useGesture(({ args: [originalIndex], down, delta: [, y] }) => {
    const currentIndex = trackOrder.current.indexOf(originalIndex)
    const curRow = clamp(
      Math.round((currentIndex * TRACK_HEIGHT + y) / TRACK_HEIGHT),
      0,
      numItems - 1
    )
    const newOrder = swap(trackOrder.current, currentIndex, curRow)
    // Feed springs new style data, they'll animate the view without causing a single render
    setSprings(
      // @ts-expect-error
      getSpringConfigForOrder({
        trackOrder: newOrder,
        down,
        originalIndex,
        currentIndex,
        y,
      })
    )
    if (!down) trackOrder.current = newOrder
  })

  return (
    <>
      {springs.map(({ zIndex, y, scale }, index) => (
        <animated.div
          key={index}
          {...bind(index)}
          style={{
            // @ts-expect-error
            zIndex,
            transform: interpolate(
              [y, scale],
              (y, s) => `translate3d(0,${y}px,0) scale(${s})`
            ),
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <ChildComponent position={index} />
        </animated.div>
      ))}
    </>
  )
}

export default AnimatedDraggableList
