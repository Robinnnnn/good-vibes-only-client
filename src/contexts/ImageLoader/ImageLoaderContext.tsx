import React from 'react'

type ImageLoaderActions = {
  read: (src: string) => Promise<boolean> | boolean | Error
}

const ImageLoaderContext = React.createContext<ImageLoaderActions | undefined>(
  undefined
)

type Props = {
  src: string
  Component?: React.ReactNode
}

export const ImageWithSuspense = ({
  src,
  Component,
}: Props): React.ReactNode => {
  const { read } = React.useContext(ImageLoaderContext)
  read(src) // suspends while image is loaded
  return Component
}

const MAX_WAIT_TIME = 5000

export const ImageLoaderProvider: React.FC = ({ children }) => {
  const cache = React.useRef<{ [url: string]: Promise<boolean> | boolean }>({})

  const read = React.useCallback((src: string) => {
    if (cache.current[src] instanceof Promise) {
      throw cache.current[src]
    } else if (cache.current[src]) {
      return cache.current[src]
    }

    const promise = new Promise((resolve) => {
      const img = new Image()
      img.src = src
      const _id = setTimeout(() => resolve(src), MAX_WAIT_TIME)
      img.onload = () => {
        resolve(src)
        clearTimeout(_id)
      }
    })
      .then(() => (cache.current[src] = true))
      // resolve anyway, users can deal with errors lol
      .catch(() => (cache.current[src] = true))

    cache.current[src] = promise

    return promise
  }, [])

  const actions: ImageLoaderActions = React.useMemo(() => ({ read }), [read])

  return (
    <ImageLoaderContext.Provider value={actions}>
      {children}
    </ImageLoaderContext.Provider>
  )
}
