import { SECOND } from '../../../util/time'

/**
 * we'll receive the latest playback state from the server every 2 seconds.
 * this means that a user taking actions directly from the Spotify client
 * may not see any updates reflected in the browser for 2 seconds (worst case).
 *
 * unfortuately, this also means that we won't be able to scale up the # of
 * concurrent users for this app until we have realtime streaming (since all
 * connected clients will refresh every 2s).
 */
export const PLAYBACK_REFRESH_INTERVAL = 2 * SECOND
