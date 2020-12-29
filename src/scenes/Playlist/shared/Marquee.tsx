/**
 * proof of concept: https://codesandbox.io/s/text-carousel-with-requestanimationframe-jz214
 */
import React from 'react'

export enum SCROLL_SPEED {
  FAST = 0.02,
  SLOW = 0.01,
}

type Props = {
  speed: SCROLL_SPEED
}

const Marquee: React.FC<Props> = React.memo(({ children, speed }) => {
  // ref for HTML element that we'll be moving
  const marquee = React.useRef<HTMLDivElement | null>(null)

  const animationId = React.useRef<number | null>(null)

  /**
   * TL;DR: distance = time × speed
   *
   * take the time elapsed and multiply by desired speed to get distance traveled for
   * moving element.
   *
   * speed values are relatively small (less than 0.1) since time is measured in ms.
   *
   * previous speed is needed to calculate what the startTime *would have been* if
   * the element had traveled the same distance in the new speed. more comments below!
   */
  const startTime = React.useRef<number>(Date.now())

  // current speed
  const s = React.useRef<SCROLL_SPEED>(speed)
  // previous speed
  const ps = React.useRef<SCROLL_SPEED>(speed)

  const animate = React.useCallback(() => {
    // time that's elapsed since animation start
    let dT = Date.now() - startTime.current
    // if the user has triggered a change in speed
    if (s.current !== ps.current) {
      // figure out how much the element has moved up until now, using previous speed
      const dDPrevious = dT * ps.current
      // figure out how much time it would have taken to move the same amount of pixels
      // using new speed
      const dtNew = dDPrevious / s.current
      // override the start position to be where we would have started had the above time elapsed
      startTime.current = Date.now() - dtNew
      // recalculate elapsed time
      dT = Date.now() - startTime.current
      // mark speed as up-to-date, since we've successfully accounted for the change!
      ps.current = s.current
    }

    // calculate distance in pixels
    const dD = dT * s.current

    if (marquee.current) {
      /**
       * reset translation once the carousel has moved the width of one child element:
       *
       * t = 0             | crave you    | crave you    |
       * t = 1         crav|e you    crave| you
       * t = 2    crave you|              |
       *
       *                      ~ RESET ~
       *
       * t = 0             | crave you    | crave you    |
       */
      const halfwayPoint = marquee.current.offsetWidth / 2
      marquee.current.style.transform = `translateX(-${dD}px)`
      if (dD >= halfwayPoint) startTime.current = Date.now()

      requestAnimationFrame(animate)
    }
  }, [])

  // animation handler
  React.useEffect(() => {
    // kill any existing animation loops
    if (animationId.current) cancelAnimationFrame(animationId.current)
    animationId.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId.current)
  }, [animate])

  // triggers the speed change handler in `animate` callback
  React.useEffect(() => {
    s.current = speed
  }, [speed])

  return <div ref={marquee}>{children}</div>
})

export default Marquee
