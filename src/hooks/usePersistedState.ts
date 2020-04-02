import React from 'react'

function usePersistedState(key: string, defaultValue: any) {
  const [value, setValue] = React.useState(() => {
    const persistedValue = window.localStorage.getItem(key)
    return persistedValue !== null ? JSON.parse(persistedValue) : defaultValue
  })

  // TODO: debounce
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}

export default usePersistedState
