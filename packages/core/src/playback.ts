import { Listener, createStore } from "./store"
import { clamp } from "./utils"

export interface InternalPlaybackState {
  currentTime: number
  duration: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomPlaybackState {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomPlaybackActions {}

export type PlaybackActions = {
  setCurrentTime: (value: number) => void
} & CustomPlaybackActions

export type PlaybackState = InternalPlaybackState & CustomPlaybackState

export type PlaybackStore = ReturnType<typeof createStore<PlaybackState>>

type CleanupFunc = () => void

type OnCleanupHook = (element: HTMLMediaElement, cb: CleanupFunc) => void

export type Plugin<T = unknown> = {
  install: (
    arg: {
      store: ReturnType<typeof createStore<PlaybackState>>
      onCleanup: OnCleanupHook
    },
    options: T,
  ) => CustomPlaybackActions
}

export type PluginFunc = <T>(plugin: Plugin<T>, ...options: T[]) => void

type PlaybackFunc = {
  (arg: { id: string }): {
    cleanup: () => void
    subscribe: (listener: Listener<PlaybackState>) => () => void
    activate: () => boolean
    getState: () => PlaybackState
    playbackActions: PlaybackActions
    onCleanup: (cb: CleanupFunc) => void
    use: PluginFunc
  }
  use: PluginFunc
  $pluginsQueue: ((arg: { store: ReturnType<typeof createStore<PlaybackState>>; onCleanup: OnCleanupHook }) => void)[]
}

const cleanupCallbackMap = new WeakMap<HTMLMediaElement, Set<CleanupFunc>>()
const playbackActivatedSet = new WeakSet<HTMLMediaElement>()

export const playback: PlaybackFunc = ({ id }) => {
  const store = createStore<PlaybackState>({
    currentTime: 0,
    duration: 0,
  })

  const abortController = new AbortController()
  const { signal } = abortController

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

  const playbackActions: PlaybackActions = {
    setCurrentTime: (value: number) => {
      if (playbackElement) {
        playbackElement.currentTime = clamp(value, 0, playbackElement.duration)
      }
    },
  }

  const addCleanupCallback = (cb: CleanupFunc) => {
    cleanupCallbackMap.set(
      playbackElement as HTMLMediaElement,
      (cleanupCallbackMap.get(playbackElement as HTMLMediaElement) || new Set()).add(cb),
    )
  }

  const onCleanup: OnCleanupHook = (element: HTMLMediaElement, cb) => {
    cleanupCallbackMap.set(element, (cleanupCallbackMap.get(element) || new Set()).add(cb))
  }

  function activate() {
    const _playbackElement = document.getElementById(id) as HTMLMediaElement | null

    if (!_playbackElement) {
      throw new Error(`Playback element with id ${id} not found`)
    }

    if (playbackActivatedSet.has(_playbackElement)) {
      return false
    }

    playbackElement = _playbackElement
    playbackElement?.addEventListener("loadedmetadata", handleLoadedMetadata, { signal })
    playbackElement?.addEventListener("seeking", handleSeeking, { signal })
    playbackElement?.addEventListener("timeupdate", handleTimeUpdate, { signal })

    store.setState({
      currentTime: playbackElement?.currentTime,
      duration: Number.isFinite(playbackElement?.duration) ? playbackElement?.duration : 0,
    })

    for (const pluginQueueItem of playback.$pluginsQueue) {
      Object.assign(result.playbackActions, pluginQueueItem({ store, onCleanup }))
    }

    playbackActivatedSet.add(playbackElement)
    return true
  }

  const result = {
    cleanup() {
      if (document.body.contains(playbackElement as HTMLMediaElement)) {
        return
      }

      abortController.abort()
      store.cleanup()
      playbackElement && playbackActivatedSet.delete(playbackElement)
      if (cleanupCallbackMap.has(playbackElement as HTMLMediaElement)) {
        const cbs = cleanupCallbackMap.get(playbackElement as HTMLMediaElement) as Set<CleanupFunc>

        for (const cb of cbs) {
          cb()
        }

        cleanupCallbackMap.delete(playbackElement as HTMLMediaElement)
      }

      playbackElement = undefined
    },
    onCleanup: addCleanupCallback,
    activate,
    subscribe: store.subscribe,
    getState: store.getState,
    playbackActions,
    use: <T>(plugin: Plugin<T>, options: T) => {
      const data = plugin.install(
        {
          store,
          onCleanup,
        },
        options,
      )
      Object.assign(result.playbackActions, data)
      return data
    },
  }

  return result
}

playback.$pluginsQueue = []
playback.use = <T>(plugin: Plugin<T>, options: T) => {
  playback.$pluginsQueue.push(({ store, onCleanup }) => {
    return plugin.install({ store, onCleanup }, options)
  })
}
