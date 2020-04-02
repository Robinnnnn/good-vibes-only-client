import React from 'react'
import { Router, Redirect } from '@reach/router'
import Login from './Login'
import Playlist from './Playlist'
import NotFound from './NotFound'
import { useAuthState, LoggedOutState } from '../contexts/Auth'

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
    <Router>
      <Playlist path='playlist/:id' />
      <NotFound path='404' />
      <Redirect noThrow from='/' to='/playlist/37i9dQZF1DXcBWIGoYBM5M' />
      <Redirect noThrow from='login' to='/playlist/37i9dQZF1DXcBWIGoYBM5M' />
      <Redirect noThrow from='oauth' to='/playlist/37i9dQZF1DXcBWIGoYBM5M' />
      <Redirect noThrow from='*' to='404' />
    </Router>
  )
}

export default Routes
