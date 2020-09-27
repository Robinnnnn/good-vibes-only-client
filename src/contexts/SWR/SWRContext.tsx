import React from 'react'
import { SWRConfig } from 'swr'
import { useSpotifyState } from '../Spotify/ConfigContext/ConfigContext'
import log from '../../util/log'
import SpotifyWebApi from 'spotify-web-api-js'

// Have to use `any` here because Spotify's interface doesn't follow a generic pattern
type SpotifyRequestMethod = (...args: any) => any

// Sends authenticated requests via Spotify SDK
export const AuthenticatedSpotifySWRProvider: React.FC = ({ children }) => {
  log.info('initializing spotify SWR provider')
  const { sdk } = useSpotifyState()
  const value = {
    fetcher: (action: keyof SpotifyWebApi.SpotifyWebApiJs, ...args) => {
      log.trace(`calling ${action}`, args)
      const fn = sdk[action] as SpotifyRequestMethod
      return fn(...args)
    },
    refreshInterval: 1000 * 60 * 5, // refresh data every 5 minutes
    suspense: true,
  }
  return <SWRConfig value={value}>{children}</SWRConfig>
}
