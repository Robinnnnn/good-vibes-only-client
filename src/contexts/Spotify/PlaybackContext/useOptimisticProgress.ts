import React from 'react'
import SpotifyWebApi from 'spotify-web-api-js'
import { PLAYBACK_REFRESH_INTERVAL } from './constants'

const UPDATE_PROGRESS_FREQUENCY_MS = 250

export type ProgressControls = {
  progressMs: number
  setProgressMs: React.Dispatch<React.SetStateAction<number>>
  setLastManuallyTriggeredClientUpdate: React.Dispatch<
    React.SetStateAction<number>
  >
  seekTo: (positionMs: number) => void
}

type Props = {
  serverProgressMs: number
  serverSeekTo: SpotifyWebApi.SpotifyWebApiJs['seek']
  isSelectedTrackInSync: boolean
  isPlaying: boolean
}

export default function useOptimisticProgress({
  serverProgressMs,
  serverSeekTo,
  isSelectedTrackInSync,
  isPlaying,
}: Props): ProgressControls {
  // the progress that's displayed to the client. this may not be 100% in sync with
  // the server, since we only receive updates from the server every 2s
  const [clientProgressMs, setClientProgressMs] = React.useState(
    serverProgressMs
  )
  // capture when the client was last updated in order to deal with a potential race
  // condition against the server
  const [
    lastManuallyTriggeredClientUpdate,
    setLastManuallyTriggeredClientUpdate,
  ] = React.useState<number>(Date.now())
  // capture when the server was last updated in order to deal with a potential race
  // condition against the client
  const lastServerUpdate = React.useRef<number>(Date.now())

  // some refs to prevent unnecessary reruns of useEffect
  // TODO: we should be able to skip these if we use an "isOptimisticallyUpdating" ref,
  // and in the useEffect just return if an optimistic update is occurring
  const clientProgressMsRef = React.useRef(clientProgressMs)
  React.useEffect(() => {
    clientProgressMsRef.current = clientProgressMs
  }, [clientProgressMs])
  const lastManuallyTriggeredClientUpdateRef = React.useRef(
    lastManuallyTriggeredClientUpdate
  )
  React.useEffect(() => {
    lastManuallyTriggeredClientUpdateRef.current = lastManuallyTriggeredClientUpdate
  }, [lastManuallyTriggeredClientUpdate])
  const selectedTrackInSyncRef = React.useRef(isSelectedTrackInSync)
  React.useEffect(() => {
    selectedTrackInSyncRef.current = isSelectedTrackInSync
  }, [isSelectedTrackInSync])

  // disables client updates
  const pauseOptimisticUpdatesUntilServerCatchesUp = React.useRef(false)

  // handle server updates
  React.useEffect(() => {
    if (selectedTrackInSyncRef.current) {
      /**
       * if client has progressed further than server, client updates should
       * be disabled until the server catches up. this prevents the progress
       * from flickering "backwards" when syncing with server.
       */
      if (serverProgressMs < clientProgressMsRef.current) {
        pauseOptimisticUpdatesUntilServerCatchesUp.current = true
        return
      }
    }

    // if server time is on par with client time, allow optimistic updates
    if (pauseOptimisticUpdatesUntilServerCatchesUp.current) {
      pauseOptimisticUpdatesUntilServerCatchesUp.current = false
    }

    /**
     * if we've just triggered an optimistic update (e.g. picked out a new
     * song which resets the progress timestamp to 0), we should kill any
     * attempt for the server time to apply, as it may be behind / stuck
     * on the previous song. we won't know whether the server time is legit
     * until we wait 1 full refresh cycle (2s)
     */
    const timeSinceLastClientUpdate =
      Date.now() - lastManuallyTriggeredClientUpdateRef.current
    if (timeSinceLastClientUpdate < PLAYBACK_REFRESH_INTERVAL) return

    setClientProgressMs(serverProgressMs)
    lastServerUpdate.current = Date.now()
  }, [serverProgressMs])

  // need this as a ref as to not kick off multiple fx / setIntervals below
  const isPlayingRef = React.useRef(isPlaying)
  React.useEffect(() => {
    isPlayingRef.current = isPlaying
  }, [isPlaying])

  /**
   * we don't get updates from the server terribly often (every 2s,
   * but this will likely have to increase as we scale). in order to
   * prevent UI jank by only updating the progress bar every 2s, we
   * perform client-side updates more frequently, which helps to
   * "fill in the temporal gap"
   */
  React.useEffect(() => {
    const id = setInterval(() => {
      // if the song is no longer playing, we should stop progress
      if (!isPlayingRef.current) return

      // if we should stop optimistic updates, it means we're waiting
      // for the server to catch up
      if (pauseOptimisticUpdatesUntilServerCatchesUp.current) return

      // if we just received a server update, let's skip the client
      // to avoid unnecessarily aggressive updates
      const timeSinceLastServerUpdate = Date.now() - lastServerUpdate.current
      if (timeSinceLastServerUpdate > UPDATE_PROGRESS_FREQUENCY_MS) {
        setClientProgressMs((p) => p + UPDATE_PROGRESS_FREQUENCY_MS)
      }
    }, UPDATE_PROGRESS_FREQUENCY_MS)

    return () => clearInterval(id)
  }, [])

  const seekTo = React.useCallback(
    (positionMs: number) => {
      // immediately set client position
      setClientProgressMs(positionMs)
      setLastManuallyTriggeredClientUpdate(Date.now())
      // send request to server
      serverSeekTo(positionMs)
    },
    [serverSeekTo]
  )

  const controls = React.useMemo(
    () => ({
      progressMs: clientProgressMs,
      setProgressMs: setClientProgressMs,
      setLastManuallyTriggeredClientUpdate,
      seekTo,
    }),
    [clientProgressMs, seekTo]
  )

  return controls
}
