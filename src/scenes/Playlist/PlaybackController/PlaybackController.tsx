import React from 'react'
import styled from '@emotion/styled'

type Props = {}

const PlaybackController: React.FC<Props> = () => {
  return <Container>playback controller</Container>
}

// controller will take the form of a footer
const Container = styled.div`
  display: flex;
  position: fixed;
  bottom: 0;
  width: 100vw;

  height: 80px;
  background: white;

  /* makes room for sidebar, which is also position fixed */
  margin-left: 80px;

  /* inset version */
  /* box-shadow: inset 6px 0px 20px -10px #888cff; */
  box-shadow: 6px 0px 12px -1px #888cff;
`

export default React.memo(PlaybackController)
