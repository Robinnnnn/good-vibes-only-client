import React from 'react'
import styled from '@emotion/styled'

export enum BLUR_LEVEL {
  LOW = 1,
  MEDIUM = 8,
  HIGH = 20,
}

type Props = {
  leftActive?: boolean
  rightActive?: boolean
  blurLevel?: BLUR_LEVEL
  zIndex?: number
}

const BlurEdges: React.FC<Props> = ({
  leftActive = true,
  rightActive = true,
  zIndex = 1,
  blurLevel = BLUR_LEVEL.MEDIUM,
  children,
}) => {
  return (
    <BlurContainer>
      <Overlay
        leftActive={leftActive}
        rightActive={rightActive}
        blurLevel={blurLevel}
        zIndex={zIndex}
      />
      {children}
    </BlurContainer>
  )
}

const BlurContainer = styled.div`
  position: relative;
`

const Overlay = styled.span<{
  leftActive: boolean
  rightActive: boolean
  blurLevel: number
  zIndex: number
}>`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    ${({ leftActive }) => (leftActive ? '#ffffff' : 'transparent')} 0%,
    ${({ blurLevel }) => `transparent ${blurLevel}%`},
    ${({ blurLevel }) => `transparent ${100 - blurLevel}%`},
    ${({ rightActive }) => (rightActive ? '#ffffff' : 'transparent')} 100%
  );
  z-index: ${({ zIndex }) => zIndex};
`

export default BlurEdges
