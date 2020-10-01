import React from 'react'
import Loading from '../../scenes/Loading'
import { useErrorActions } from '../Error/ErrorContext'
import { navigate } from '@reach/router'
import usePersistedState from '../../hooks/usePersistedState'
import * as utils from './utils'
import { useSpotifyActions } from '../Spotify/ConfigContext/ConfigContext'
import { requestRefreshedAccessToken } from '../Spotify/ConfigContext/refreshToken'
import log, { FLAVORS } from '../../util/log'

/**
 * Auth State
 */
// The default state when the user lands on the app. Since a user's auth state could
// be determined by a variety of factors, we throw the app into pseudo-suspense and
// prevent anything from being displayed. This helps avoid a "flicker" on arrival.
export const UnknownState = Symbol('Unknown State')

// Auth state assessment is underway. This state prevents potentially duplicate
// auth-related requests from firing
export const LoadingState = Symbol('Loading State')

export const LoggedInState = Symbol('Logged In State')

export const LoggedOutState = Symbol('Logged Out State')

type AuthState =
  | typeof LoggedInState
  | typeof LoggedOutState
  | typeof LoadingState
  | typeof UnknownState

const AuthStateContext = React.createContext<AuthState>(UnknownState)

export const useAuthState = (): AuthState => {
  const context = React.useContext(AuthStateContext)
  if (!context) {
    throw Error('Attempted to use AuthState without a provider!')
  }
  return context
}

/**
 * Auth Tokens
 */
interface AuthTokens {
  access_token: string
  refresh_token: string
}

const ZeroTokens = {
  access_token: '',
  refresh_token: '',
}

const AuthTokenContext = React.createContext<AuthTokens>(ZeroTokens)

export const useAuthTokenContext = (): AuthTokens => {
  const context = React.useContext(AuthTokenContext)
  if (!context) {
    throw Error('Attempted to use AuthTokens without a provider!')
  }
  return context
}

/**
 * Auth Actions
 */
interface AuthActions {
  setLoggedIn: (response: AuthTokens) => void
  logout: () => void
}

const AuthActionContext = React.createContext<AuthActions | undefined>(
  undefined
)

export const useAuthActions = (): AuthActions => {
  const context = React.useContext(AuthActionContext)
  if (!context) {
    throw Error('Attempted to use AuthActions without a provider!')
  }
  return context
}

/**
 * Putting it all together in AuthProvider
 */
export const AuthProvider: React.FC = ({ children }) => {
  const [authState, setAuthState] = React.useState<AuthState>(UnknownState)
  const [authTokens, setAuthTokens] = usePersistedState(
    'authTokens',
    ZeroTokens
  )
  const {
    initialize: initializeSpotify,
    teardown: teardownSpotify,
  } = useSpotifyActions()
  const { setApplicationError } = useErrorActions()

  const setLoggedOutState = React.useCallback(() => {
    log.info(FLAVORS.AUTH, 'kicking user to lobby')
    localStorage.clear()
    utils.clearCookies()
    setAuthState(LoggedOutState)
    setAuthTokens(ZeroTokens)
    teardownSpotify()
    navigate('/login') // TODO: keep URL params ?
  }, [setAuthTokens, teardownSpotify])

  const setLoggedIn = React.useCallback(
    async (tokens: AuthTokens) => {
      try {
        log.info(FLAVORS.AUTH, 'setting auth tokens + logged in state')
        await initializeSpotify(tokens)

        setAuthTokens(tokens)
        setAuthState(LoggedInState)
        utils.clearCookies()
      } catch (e) {
        setApplicationError('Authorization failed! Could not fetch uer data', e)
        setLoggedOutState()
      }
    },
    [initializeSpotify, setApplicationError, setAuthTokens, setLoggedOutState]
  )

  React.useEffect(
    function authProviderMounted() {
      const loadAuthState = async () => {
        setAuthState(LoadingState)

        // Check if user is being oauth-redirected from the server, which
        // attaches tokens to cookies. We don't need to re-validate these and
        // can immediately use them to fetch user data.
        let { access_token, refresh_token } = utils.cookiesToObj()

        if (access_token && refresh_token) {
          log.trace(FLAVORS.AUTH, 'tokens discovered in cookies. validating...')
          setLoggedIn({ access_token, refresh_token } as AuthTokens)
          return
        }

        // If this isn't a server redirect, the user could be landing on an
        // authenticated page (e.g. /playlist). Check if user has a session
        // cached before kicking them to the login screen.
        refresh_token = authTokens.refresh_token

        if (refresh_token) {
          log.trace(
            FLAVORS.AUTH,
            'tokens discovered in localStorage. validating...'
          )
          try {
            // Token exists on local storage; test its validity and attempt to refresh it
            const newAccessToken = await requestRefreshedAccessToken(
              refresh_token
            )

            setLoggedIn({
              access_token: newAccessToken,
              refresh_token,
            } as AuthTokens)
          } catch (e) {
            // TODO: incorporate network retries
            setApplicationError(
              'Authorization failed! Could not refresh tokens',
              e
            )
            setLoggedOutState()
          }
        } else {
          // Could not locate tokens in localStorage
          setLoggedOutState()
        }
      }

      if (authState === UnknownState) {
        log.info(FLAVORS.AUTH, 'auth state is unknown! please hold...')
        loadAuthState()
      }
    },
    [
      authState,
      authTokens.refresh_token,
      setApplicationError,
      setLoggedIn,
      setLoggedOutState,
    ]
  )

  const authActions: AuthActions = React.useMemo(
    () => ({ setLoggedIn, logout: setLoggedOutState }),
    [setLoggedIn, setLoggedOutState]
  )

  return authState === UnknownState || authState === LoadingState ? (
    <Loading />
  ) : (
    <AuthStateContext.Provider value={authState}>
      <AuthTokenContext.Provider value={authTokens}>
        <AuthActionContext.Provider value={authActions}>
          {children}
        </AuthActionContext.Provider>
      </AuthTokenContext.Provider>
    </AuthStateContext.Provider>
  )
}
