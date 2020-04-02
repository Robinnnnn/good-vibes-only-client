import React from 'react'
import styled from '@emotion/styled'
import { ReactComponent as Animation } from './loading.svg'
import excuse from './excuses'

const Loading: React.FC = () => {
  return (
    <LoadingScene>
      <p>{excuse()}</p>
      <Animation />
    </LoadingScene>
  )
}

const LoadingScene = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

export default Loading
