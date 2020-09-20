import React, { Suspense } from 'react'
import { Router, Redirect } from '@reach/router'
import Login from './Login'
import Playlist from './Playlist/Playlist'
import NotFound from './NotFound'
import { useAuthState, LoggedOutState } from '../contexts/Auth'
import { AuthenticatedSpotifySWRProvider } from '../contexts/SWR'

const Routes: React.FC = () => {
  const state = useAuthState()

  if (state === LoggedOutState) {
    return (
      <Router>
        <Login path='login' />
        <Redirect noThrow from='*' to='login' />
      </Router>
    )
  }

  // TODO: cleanup redirects
  return (
    <AuthenticatedSpotifySWRProvider>
      <Suspense fallback={<div>SUSPENSE FALLBACK</div>}>
        <Router>
          <Playlist path='playlist/:id' />
          <NotFound path='404' />
          <Redirect noThrow from='/' to='/playlist/4pk1t6L5553jk5NDHdeQrD' />
          <Redirect
            noThrow
            from='login'
            to='/playlist/4pk1t6L5553jk5NDHdeQrD'
          />
          <Redirect
            noThrow
            from='oauth'
            to='/playlist/4pk1t6L5553jk5NDHdeQrD'
          />
          <Redirect noThrow from='*' to='404' />
        </Router>
      </Suspense>
    </AuthenticatedSpotifySWRProvider>
  )
}

export default Routes
