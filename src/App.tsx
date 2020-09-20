import React from 'react'
import Routes from './scenes'
import { SpotifyProvider } from './contexts/Spotify'
import { AuthProvider } from './contexts/Auth'
import { ErrorProvider } from './contexts/Error'
import styled from '@emotion/styled'

const App: React.FC = () => (
  <StyledContainer>
    <ErrorProvider>
      <SpotifyProvider>
        <AuthProvider>
          <Routes />
        </AuthProvider>
      </SpotifyProvider>
    </ErrorProvider>
  </StyledContainer>
)

const StyledContainer = styled.div`
  min-height: 100vh;
  background: white;
  /* background: #f6e9fsf; */
  /* dark mode */
  /* background: #303030; */
`

export default App
