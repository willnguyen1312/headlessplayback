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

type CleanupFunc = () => void

type OnCleanupHook = (element: HTMLMediaElement, cb: CleanupFunc) => void

export type Plugin<T = unknown> = {
  install: (
    arg: {
      store: ReturnType<typeof createStore<PlaybackState>>
      playback: PlaybackFunc
      onCleanup: OnCleanupHook
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
  $pluginsQueue: ((arg: {
    store: ReturnType<typeof createStore<PlaybackState>>
    onCleanup: OnCleanupHook
  }) => void)[]
} & CustomPlaybackFunc

const producers = new Map<string, { playback: ReturnType<PlaybackFunc>; users: number }>()
const cleanupCallbackMap = new WeakMap<HTMLMediaElement, CleanupFunc[]>()
const playbackActivatedSet = new WeakSet<HTMLMediaElement>()

export const playback: PlaybackFunc = ({ id }) => {
  if (producers.has(id)) {
    const cachedResult = producers.get(id)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    cachedResult!.users++
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    producers.set(id, cachedResult!)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return producers.get(id)!.playback
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
      const cachedResult = producers.get(id)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      cachedResult!.users--
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      producers.set(id, cachedResult!)

      if (producers.get(id)?.users === 0) {
        playbackElement?.removeEventListener("loadedmetadata", handleLoadedMetadata)
        playbackElement?.removeEventListener("seeking", handleSeeking)
        playbackElement?.removeEventListener("timeupdate", handleTimeUpdate)
        store.cleanup()
        playbackElement && playbackActivatedSet.delete(playbackElement)
        if (cleanupCallbackMap.has(playbackElement as HTMLMediaElement)) {
          cleanupCallbackMap.get(playbackElement as HTMLMediaElement)?.forEach((cb) => cb())
          cleanupCallbackMap.delete(playbackElement as HTMLMediaElement)
        }
        producers.delete(id)
      }
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

    const onCleanup: OnCleanupHook = (element: HTMLMediaElement, cb) => {
      cleanupCallbackMap.set(element, [...(cleanupCallbackMap.get(element) ?? []), cb])
    }

    playback.$pluginsQueue.forEach((item) => item({ store, onCleanup }))
    playbackActivatedSet.add(playbackElement)
  }

  producers.set(id, { playback: result, users: 1 })
  return result
}

playback.$pluginsQueue = []
playback.use = <T>(plugin: Plugin<T>, options: T) => {
  playback.$pluginsQueue.push(({ store, onCleanup }) => {
    plugin.install({ store, playback, onCleanup }, options)
  })
}
