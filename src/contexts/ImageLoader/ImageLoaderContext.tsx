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

export const ImageWithSuspense = React.memo(
  ({ src, Component }: Props): React.ReactNode => {
    const { read } = React.useContext(ImageLoaderContext)
    read(src) // suspends while image is loaded
    return Component
  }
)

const MAX_WAIT_TIME = 5000

export const ImageLoaderProvider: React.FC = React.memo(({ children }) => {
  // a map to look up the load status for each image
  const cache = React.useRef<{ [url: string]: Promise<boolean> | boolean }>({})

  // a queue to keep track of unloaded images. the useEffect will consume
  // from this queue as to not bombard the client with a bunch of parallelized
  // image requests, which causes the loading gif to lag
  const [queue, setQueue] = React.useState([])

  const read = React.useCallback((src: string) => {
    if (cache.current[src] instanceof Promise) {
      throw cache.current[src]
    } else if (cache.current[src]) {
      return cache.current[src]
    }

    const promise = new Promise<boolean>((resolve) => resolve(true))
    cache.current[src] = promise
    setQueue((_toLoad) => [..._toLoad, src])
    throw promise
  }, [])

  React.useEffect(() => {
    if (queue.length) {
      const src = queue[0]

      new Promise((resolve) => {
        const img = new Image()
        img.src = src
        const _id = setTimeout(() => resolve(src), MAX_WAIT_TIME)
        img.onload = () => {
          // if necessary, use a timeout to space out the load even further.
          // setTimeout(() => {
          setQueue((_urls) => _urls.slice(1))
          // }, 10)
          resolve(src)
          clearTimeout(_id)
        }
      })
        .then(() => (cache.current[src] = true))
        // resolve anyway, users can deal with errors lol
        .catch(() => (cache.current[src] = true))
    }
  }, [queue])

  const actions: ImageLoaderActions = React.useMemo(() => ({ read }), [read])

  return (
    <ImageLoaderContext.Provider value={actions}>
      {children}
    </ImageLoaderContext.Provider>
  )
})
