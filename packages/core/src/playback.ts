import { StoreListener, createStore } from "@namnode/store"
import { clamp } from "@namnode/utils"

export interface InternalPlaybackState {
  currentTime: number
  duration: number
  seeking: boolean
  waiting: boolean
  stalled: boolean
  ended: boolean
  playbackRate: number
  paused: boolean
  muted: boolean
  volume: number
  isPictureInPicture: boolean
  buffered?: TimeRanges
  textTracks?: TextTrackList
  selectedTrackIndex: number
  isPictureInPictureSupported: boolean
}

export type CustomPlaybackAction<T> = (arg: T & { id: string }) => void

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomPlaybackState {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CustomPlaybackActions {}

export type PlaybackActions = {
  setCurrentTime: (value: number) => void
  setPlaybackRate: (value: number) => void
  setVolume: (value: number) => void
  setMuted: (value: boolean) => void
  setPaused: (value: boolean) => void
  disableTrack: () => void
  enableTrack: (index: number) => void
  setPictureInPicture: (value: boolean) => Promise<void | PictureInPictureWindow>
} & CustomPlaybackActions

export type PlaybackState = InternalPlaybackState & CustomPlaybackState

export type PlaybackStore = ReturnType<typeof createStore<PlaybackState>>

type CleanupFunc = () => void

type OnCleanupHook = (id: string, cb: CleanupFunc) => void

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
    subscribe: (listener: StoreListener<PlaybackState>) => () => void
    activate: () => boolean
    getState: () => PlaybackState
    playbackActions: PlaybackActions
    onCleanup: (cb: CleanupFunc) => void
    use: PluginFunc
  }
  use: PluginFunc
  $pluginsQueue: ((arg: {
    store: ReturnType<typeof createStore<PlaybackState>>
    onCleanup: OnCleanupHook
  }) => CustomPlaybackActions)[]
}

const cleanupCallbackMap = new Map<string, Set<CleanupFunc>>()
const playbackActivatedSet = new WeakSet<HTMLMediaElement>()

export const createPlayback: PlaybackFunc = ({ id }) => {
  const isPictureInPictureSupported = document && "pictureInPictureEnabled" in document

  const store = createStore<PlaybackState>({
    currentTime: 0,
    duration: 0,
    seeking: false,
    volume: 1,
    waiting: false,
    ended: false,
    paused: true,
    playbackRate: 1,
    stalled: false,
    muted: false,
    isPictureInPicture: false,
    selectedTrackIndex: -1,
    isPictureInPictureSupported,
  })

  const abortController = new AbortController()
  const { signal } = abortController

  let playbackElement: HTMLMediaElement | undefined

  const playbackActions: PlaybackActions = {
    setCurrentTime: (value: number) => {
      if (playbackElement) {
        playbackElement.currentTime = clamp(value, 0, playbackElement.duration)
      }
    },
    setPlaybackRate: (value: number) => {
      if (playbackElement) {
        playbackElement.playbackRate = value
      }
    },
    setVolume: (value: number) => {
      if (playbackElement) {
        playbackElement.volume = clamp(value, 0, 1)
      }
    },
    setMuted: (value: boolean) => {
      if (playbackElement) {
        playbackElement.muted = value
      }
    },
    setPaused: (value: boolean) => {
      if (playbackElement) {
        if (value) {
          playbackElement.pause()
        } else {
          playbackElement.play()?.catch(() => {
            // ignore
          })
        }
      }
    },
    disableTrack: () => {
      const { selectedTrackIndex } = store.getState()
      if (playbackElement && playbackElement.textTracks) {
        playbackElement.textTracks[selectedTrackIndex].mode = "disabled"
      }
      store.setState({ selectedTrackIndex: -1 })
    },
    enableTrack: (index: number) => {
      playbackActions.disableTrack()
      if (playbackElement && playbackElement.textTracks) {
        playbackElement.textTracks[index].mode = "showing"
      }
      store.setState({ selectedTrackIndex: index })
    },
    setPictureInPicture: (value: boolean) => {
      if (!isPictureInPictureSupported || !playbackElement || !(playbackElement instanceof HTMLVideoElement)) {
        return Promise.reject()
      }

      const isPictureInPicture = store.getState().isPictureInPicture

      if (isPictureInPicture === value) {
        return Promise.resolve()
      }

      if (value) {
        return playbackElement.requestPictureInPicture()
      }

      return document.exitPictureInPicture()
    },
  }

  const addCleanupCallback = (cb: CleanupFunc) => {
    cleanupCallbackMap.set(id, (cleanupCallbackMap.get(id) || new Set()).add(cb))
  }

  const onCleanup: OnCleanupHook = (id: string, cb) => {
    cleanupCallbackMap.set(id, (cleanupCallbackMap.get(id) || new Set()).add(cb))
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
    playbackElement?.addEventListener(
      "timeupdate",
      () => {
        store.setState({
          currentTime: playbackElement?.currentTime,
        })
      },
      { signal },
    )
    playbackElement?.addEventListener(
      "durationchange",
      () => {
        store.setState({
          duration: playbackElement?.duration,
        })
      },
      { signal },
    )
    playbackElement?.addEventListener("progress", () => {
      store.setState({
        buffered: playbackElement?.buffered,
      })
    })
    playbackElement?.addEventListener(
      "seeking",
      () => {
        store.setState({
          currentTime: playbackElement?.currentTime,
        })
      },
      { signal },
    )
    playbackElement?.addEventListener(
      "seeking",
      () => {
        store.setState({
          seeking: true,
        })
      },
      { signal },
    )
    playbackElement?.addEventListener(
      "seeked",
      () => {
        store.setState({
          seeking: false,
        })
      },
      { signal },
    )

    for (const event of ["waiting", "loadstart"]) {
      playbackElement?.addEventListener(
        event,
        () => {
          store.setState({
            waiting: true,
            paused: false,
          })
        },
        { signal },
      )
    }

    playbackElement?.addEventListener(
      "loadeddata",
      () => {
        store.setState({
          waiting: false,
        })
      },
      { signal },
    )
    playbackElement?.addEventListener(
      "ratechange",
      () => {
        store.setState({
          playbackRate: playbackElement?.playbackRate ?? 1,
        })
      },
      { signal },
    )
    playbackElement?.addEventListener(
      "stalled",
      () => {
        store.setState({
          stalled: true,
        })
      },
      { signal },
    )
    playbackElement?.addEventListener(
      "ended",
      () => {
        store.setState({
          ended: true,
        })
      },
      { signal },
    )
    playbackElement?.addEventListener(
      "pause",
      () => {
        store.setState({
          paused: true,
        })
      },
      { signal },
    )
    playbackElement?.addEventListener(
      "play",
      () => {
        store.setState({
          paused: false,
        })
      },
      { signal },
    )
    playbackElement?.addEventListener(
      "play",
      () => {
        store.setState({
          volume: playbackElement?.volume ?? 1,
          muted: playbackElement?.muted ?? false,
        })
      },
      { signal },
    )
    playbackElement?.addEventListener(
      "enterpictureinpicture",
      () => {
        store.setState({
          isPictureInPicture: true,
        })
      },
      { signal },
    )
    playbackElement?.addEventListener(
      "leavepictureinpicture",
      () => {
        store.setState({
          isPictureInPicture: false,
        })
      },
      { signal },
    )

    // Tracks events
    for (const event of ["addtrack", "removetrack", "change"]) {
      playbackElement?.textTracks?.addEventListener(
        event,
        () => {
          store.setState({
            textTracks: playbackElement?.textTracks,
          })
        },
        { signal },
      )
    }

    store.setState({
      currentTime: playbackElement?.currentTime,
      duration: Number.isFinite(playbackElement?.duration) ? playbackElement?.duration : 0,
    })

    playbackActivatedSet.add(playbackElement)
    return true
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processActions = (actions: any) => {
    for (const key in actions) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const originalAction = actions[key]
      const wrappedAction = <T extends object>(arg: T) => {
        originalAction({ ...arg, id })
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      actions[key] = wrappedAction
    }
  }

  const result = {
    cleanup() {
      if (document.body.contains(playbackElement as HTMLMediaElement)) {
        return
      }

      abortController.abort()
      store.cleanup()
      playbackElement && playbackActivatedSet.delete(playbackElement)
      if (cleanupCallbackMap.has(id)) {
        const cbs = cleanupCallbackMap.get(id) as Set<CleanupFunc>

        for (const cb of cbs) {
          cb()
        }

        cleanupCallbackMap.delete(id)
      }

      playbackElement = undefined
    },
    onCleanup: addCleanupCallback,
    activate,
    subscribe: store.subscribe,
    getState: store.getState,
    playbackActions,
    use: <T>(plugin: Plugin<T>, options: T) => {
      const actions = plugin.install(
        {
          store,
          onCleanup,
        },
        options,
      )
      processActions(actions)
      Object.assign(result.playbackActions, actions)
      return actions
    },
  }

  for (const pluginQueueItem of createPlayback.$pluginsQueue) {
    const actions = pluginQueueItem({ store, onCleanup })
    processActions(actions)
    Object.assign(result.playbackActions, actions)
  }

  return result
}

createPlayback.$pluginsQueue = []
createPlayback.use = <T>(plugin: Plugin<T>, options: T) => {
  createPlayback.$pluginsQueue.push(({ store, onCleanup }) => {
    return plugin.install({ store, onCleanup }, options)
  })
}
