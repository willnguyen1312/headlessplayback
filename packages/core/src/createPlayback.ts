import { createStore } from "./store"

type PlaybackElement = HTMLMediaElement

export interface PlaybackState {
  playbackElement?: PlaybackElement
  currentTime: number
  duration: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomPlaybackState {}

type MergedState = PlaybackState & CustomPlaybackState

export type PlaybackStore = ReturnType<typeof createStore<MergedState>>

type Plugin = <T>(
  plugin: {
    install: (store: ReturnType<typeof createStore<MergedState>>, ...options: T[]) => void
  },
  ...options: T[]
) => void

type UsePlaybackFunc = {
  (playbackElement: PlaybackElement): {
    cleanup: () => void
    subscribe: (callback: (state: MergedState) => void) => void
    activate: () => void
  }
  use: Plugin
  store: ReturnType<typeof createStore<MergedState>>
  pluginsQueue: (() => void)[]
}

const store = createStore<MergedState>({
  currentTime: 0,
  duration: 0,
})

export const createPlayback: UsePlaybackFunc = (playbackElement: PlaybackElement) => {
  function activate() {
    store.setState({
      playbackElement,
      currentTime: playbackElement.currentTime,
      duration: playbackElement.duration,
    })

    createPlayback.pluginsQueue.forEach((item) => item())
  }

  function handleTimeUpdate() {
    store.setState({
      currentTime: playbackElement.currentTime,
    })
  }

  function handleLoadedMetadata() {
    store.setState({
      duration: playbackElement.duration,
    })
  }

  function handleSeeking() {
    store.setState({
      currentTime: playbackElement.currentTime,
    })
  }

  playbackElement.addEventListener("loadedmetadata", handleLoadedMetadata)
  playbackElement.addEventListener("seeking", handleSeeking)
  playbackElement.addEventListener("timeupdate", handleTimeUpdate)

  return {
    cleanup() {
      playbackElement.removeEventListener("loadedmetadata", handleLoadedMetadata)
      playbackElement.removeEventListener("seeking", handleSeeking)
      playbackElement.removeEventListener("timeupdate", handleTimeUpdate)
    },
    subscribe: store.subscribe,
    activate,
  }
}

createPlayback.store = store
createPlayback.pluginsQueue = []

createPlayback.use = <T>(
  plugin: {
    install: (store: ReturnType<typeof createStore<MergedState>>, options: T) => void
  },
  options: T,
) => {
  createPlayback.pluginsQueue.push(() => {
    plugin.install(store, options)
  })
}
