import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { useAuthActions } from '../contexts/Auth'

const Playlist: React.FC<RouteComponentProps> = () => {
  const { logout } = useAuthActions()

  return (
    <div>
      <div>playlist!!!!!</div>
      <button onClick={logout}>logout</button>
    </div>
  )
}

export default Playlist
