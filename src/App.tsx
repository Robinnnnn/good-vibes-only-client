import React from 'react'
import Routes from './scenes'
import { SpotifyProvider } from './contexts/Spotify/ConfigContext/ConfigContext'
import { AuthProvider } from './contexts/Auth/AuthContext'
import { ErrorProvider } from './contexts/Error/ErrorContext'
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
