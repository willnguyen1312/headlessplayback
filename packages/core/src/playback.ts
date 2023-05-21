import { Listener, createStore } from "./store"

export interface InternalPlaybackState {
  playbackElement?: HTMLMediaElement
  currentTime: number
  duration: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomPlaybackState {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomPlaybackFunc {}

export type PlaybackState = InternalPlaybackState & CustomPlaybackState

export type PlaybackStore = ReturnType<typeof createStore<PlaybackState>>

export type Plugin<T = unknown> = {
  install: (
    arg: {
      store: ReturnType<typeof createStore<PlaybackState>>
      playback: PlaybackFunc
    },
    options: T,
  ) => void
}

export type PluginFunc = <T>(plugin: Plugin<T>, ...options: T[]) => void

type PlaybackFunc = {
  (arg: { id: string }): {
    cleanup: () => void
    subscribe: (listener: Listener<PlaybackState>) => () => void
    activate: () => void
    getState: () => PlaybackState
  }
  use: PluginFunc
  $pluginsQueue: ((store: ReturnType<typeof createStore<PlaybackState>>) => void)[]
} & CustomPlaybackFunc

const producers = new Map<string, ReturnType<PlaybackFunc>>()
const playbackActivatedSet = new Set<HTMLMediaElement>()

export const playback: PlaybackFunc = ({ id }) => {
  if (producers.has(id)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return producers.get(id)!
  }

  const store = createStore<PlaybackState>({
    currentTime: 0,
    duration: 0,
  })

  let playbackElement: HTMLMediaElement | undefined

  function handleTimeUpdate() {
    store.setState({
      currentTime: playbackElement?.currentTime,
    })
  }

  function handleLoadedMetadata() {
    store.setState({
      duration: playbackElement?.duration,
    })
  }

  function handleSeeking() {
    store.setState({
      currentTime: playbackElement?.currentTime,
    })
  }

  const result = {
    cleanup() {
      playbackElement?.removeEventListener("loadedmetadata", handleLoadedMetadata)
      playbackElement?.removeEventListener("seeking", handleSeeking)
      playbackElement?.removeEventListener("timeupdate", handleTimeUpdate)
      store.cleanup()
      producers.delete(id)
      playbackElement && playbackActivatedSet.delete(playbackElement)
    },
    subscribe: store.subscribe,
    activate,
    getState: store.getState,
  }

  function activate() {
    const _playbackElement = document.getElementById(id) as HTMLMediaElement | null
    if (!_playbackElement) {
      throw new Error(`Playback element with id ${id} not found`)
    }

    if (playbackActivatedSet.has(_playbackElement)) {
      return
    }

    playbackElement = _playbackElement
    playbackElement?.addEventListener("loadedmetadata", handleLoadedMetadata)
    playbackElement?.addEventListener("seeking", handleSeeking)
    playbackElement?.addEventListener("timeupdate", handleTimeUpdate)

    store.setState({
      playbackElement,
      currentTime: playbackElement?.currentTime,
      duration: Number.isFinite(playbackElement?.duration) ? playbackElement?.duration : 0,
    })

    playback.$pluginsQueue.forEach((item) => item(store))
    playbackActivatedSet.add(playbackElement)
  }

  producers.set(id, result)
  return result
}

playback.$pluginsQueue = []
playback.use = <T>(plugin: Plugin<T>, options: T) => {
  playback.$pluginsQueue.push((store) => {
    plugin.install({ store, playback }, options)
  })
}
