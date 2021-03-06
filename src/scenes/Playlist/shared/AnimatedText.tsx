/**
 * proof of concept: https://codesandbox.io/s/color-rotation-73c7f?file=/src/index.js
 */
import React from 'react'
import { animated, AnimatedValue, useSpring } from 'react-spring'
import { SECOND } from '../../../util/time'

export const useAnimatedProgress = () => {
  // @ts-expect-error: `progress` is not a valid CSS param
  const [{ progress }, set] = useSpring(() => ({
    from: { progress: 0 },
    config: {
      duration: 2 * SECOND,
      easing: function easeOutQuart(x: number) {
        return 1 - Math.pow(1 - x, 3)
      },
    },
    // reset: true,
  }))

  const setProgress = React.useCallback(
    (progress: number) => {
      // @ts-expect-error: `progress` is not a valid CSS param
      set({ progress })
    },
    [set]
  )

  const animateText = React.useCallback(() => {
    // @ts-expect-error: `progress` is not a valid CSS param
    set({ progress: 100 })
  }, [set])

  const deanimateText = React.useCallback(() => {
    // @ts-expect-error: `progress` is not a valid CSS param
    set({ progress: 0 })
  }, [set])

  return { progress, setProgress, animateText, deanimateText }
}

// TODO: `interp` function should be generated based on desired colors
// const colors = ['#ab6bff', '#9ad5f9', '#575df0']

const interp = (r: number) => `
  linear-gradient(
    90deg,
    #ab6bff ${r - 100}%, #9ad5f9 ${r - 85}%, #575df0 ${r - 65}%,
    #ab6bff ${r - 50}%, #9ad5f9 ${r - 35}%, #575df0 ${r - 15}%,
    #ab6bff ${r}%, #9ad5f9 ${r + 15}%, #575df0 ${r + 35}%,
    #ab6bff ${r + 50}%, #9ad5f9 ${r + 65}%, #575df0 ${r + 85}%,
    #ab6bff ${r + 100}%
  )`

type Props = {
  text: string
  textWidth: number
  // @ts-expect-error
  progress: AnimatedValue
}

const AnimatedText: React.FC<Props> = ({ text, textWidth, progress }) => {
  /**
   * This is probably one of the hackiest things I've ever had to do.
   *
   * In order to properly animate the linear gradient, the background
   * color is set on the parent, while the element itself is set to be
   * invisible. The child inherits the background and is set to visible.
   *
   * This is because the `animated.div` component from react-spring does
   * not properly process the `WebkitBackgroundClip` property when set
   * using the `style` attribute. I've tried various permutations and
   * I'm pretty sure it's just unsupported by the library.
   */
  const animatedParentStyles = React.useMemo(() => {
    return {
      visibility: 'hidden' as const,
      // animated background
      background: progress.interpolate(interp),
      // even though the div should technically be invisible, the text
      // appears black without this property
      WebkitTextFillColor: 'transparent',
      display: 'flex',
    }
  }, [progress])

  const animatedChildStyles = React.useMemo(() => {
    return {
      visibility: 'visible' as const,
      background: 'inherit',
      // backgroundClip is for text gradient animation
      WebkitBackgroundClip: 'text',
      /**
       * minWidth ensures the text is positioned like this:
       *
       *   | crave you      | crave you      |
       *
       * instead of like this:
       *
       *   | crave you crave| you            |
       */
      minWidth: `${textWidth}px`,
      /**
       * padding ensures that texts that are almost but not quite 120px
       * don't get sandwiched with the next title.
       *
       * TODO: this should be dynamic based on text content; if the title
       * is very short, we can end up with too wide of a gap, like so:
       *
       *   | fuji           |    fuji        |
       *
       * not a super big deal though
       */
      paddingRight: '40px',
    }
  }, [textWidth])

  return (
    <animated.div style={animatedParentStyles}>
      <div style={animatedChildStyles}>{text}</div>
      <div style={animatedChildStyles}>{text}</div>
    </animated.div>
  )
}

export default React.memo(AnimatedText)
