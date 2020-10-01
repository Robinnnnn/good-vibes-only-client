import React from 'react'
import ErrorNotification from '../../shared/notifications/Error'
import { SECOND } from '../../util/time'

type ApplicationError = {
  message: string
  error: Error
}

const OK = Symbol('OK')

type ErrorState = ApplicationError | typeof OK

const ErrorStateContext = React.createContext<ErrorState>(OK)

export const useErrorState = (): ErrorState => {
  const context = React.useContext(ErrorStateContext)
  if (!context) {
    throw Error('Attempted to use ErrorState without a provider!')
  }
  return context
}

type ErrorActions = {
  setApplicationError: (message: string, e?: Error) => void
  clearApplicationError: () => void
}

const ErrorActionContext = React.createContext<ErrorActions | undefined>(
  undefined
)

export const useErrorActions = (): ErrorActions => {
  const context = React.useContext(ErrorActionContext)
  if (!context) {
    throw Error('Attempted to use ErrorActions without a provider!')
  }
  return context
}

export const ErrorProvider: React.FC = ({ children }) => {
  const [errorState, setErrorState] = React.useState<ErrorState>(OK)

  const setApplicationError = React.useCallback(
    (message: string, e?: Error) => {
      setErrorState({
        message,
        error: e ?? Error(message),
      } as ApplicationError)
    },
    []
  )

  const actions: ErrorActions = React.useMemo(
    () => ({
      setApplicationError,
      clearApplicationError: () => setErrorState(OK),
    }),
    [setApplicationError]
  )

  React.useEffect(() => {
    if (errorState !== OK) {
      setTimeout(() => setErrorState(OK), 5 * SECOND)
    }
  }, [errorState])

  return (
    <ErrorStateContext.Provider value={errorState}>
      <ErrorActionContext.Provider value={actions}>
        {errorState !== OK && (
          <ErrorNotification message={errorState.message} />
        )}
        {children}
      </ErrorActionContext.Provider>
    </ErrorStateContext.Provider>
  )
}
