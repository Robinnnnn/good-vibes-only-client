import SpotifySDK from 'spotify-web-api-js'

export type InitSpotifySDKParams = {
  access_token: string
  refresh_token: string
}

export type InitializedSpotifySDK = {
  sdk: SpotifySDK.SpotifyWebApiJs
  refreshTokenIntervalId: number
}

export type InitWebPlaybackSDKParams = {
  refresh_token: string
  sdk: SpotifySDK.SpotifyWebApiJs
}

export type InitializedPlaybackSDK = {
  player: Spotify.SpotifyPlayer
  playbackInstance: Spotify.WebPlaybackInstance
}
