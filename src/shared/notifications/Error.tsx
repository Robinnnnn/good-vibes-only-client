import React from 'react'
import styled from '@emotion/styled'

type Props = {
  message: string
}

const ErrorNotification: React.FC<Props> = ({ message }) => {
  return <NotificationContainer>{`ERROR: ${message}`}</NotificationContainer>
}

const NotificationContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-top: 100px;
`

export default React.memo(ErrorNotification)
