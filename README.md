# Good Vibes Only

<img src="./good-vibes-only.jpeg" width="400" />

A pretty skin for your Spotify playlist.

## Getting Started

**1) Bootstrap the backend**

This will likely be the most annoying step...

If you'd like to run this client locally, you'll need the OAuth server up and running. The backend lives in [a sister repo](https://github.com/Robinnnnn/good-vibes-only-server) written in Golang. There you'll find instructions on running the server and setting up your Spotify Developer Account.

_In the future, I'd like to make it a simple Docker image so you don't need to have the Go toolchain installed locally._

**2. Install deps and run the app**

```
$ yarn install
$ yarn start
```

## Generating a Prod Build

```
$ yarn build
```
