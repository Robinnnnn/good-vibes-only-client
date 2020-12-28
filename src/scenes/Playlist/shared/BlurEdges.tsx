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
  backgroundColor?: string
  blurLevel?: BLUR_LEVEL
  zIndex?: number
}

const BlurEdges: React.FC<Props> = ({
  leftActive = true,
  rightActive = true,
  zIndex = 1,
  backgroundColor = '#ffffff',
  blurLevel = BLUR_LEVEL.MEDIUM,
  children,
}) => {
  return (
    <BlurContainer>
      <Overlay
        leftActive={leftActive}
        rightActive={rightActive}
        backgroundColor={backgroundColor}
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
  backgroundColor: string
  blurLevel: number
  zIndex: number
}>`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    ${({ leftActive, backgroundColor }) =>
        leftActive ? backgroundColor : 'transparent'}
      0%,
    ${({ blurLevel }) => `transparent ${blurLevel}%`},
    ${({ blurLevel }) => `transparent ${100 - blurLevel}%`},
    ${({ rightActive, backgroundColor }) =>
        rightActive ? backgroundColor : 'transparent'}
      100%
  );
  z-index: ${({ zIndex }) => zIndex};
`

export default React.memo(BlurEdges)
