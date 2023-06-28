<script setup>
import BundleSize from '../components/BundleSize.vue'
</script>

## `createPlayback` - <BundleSize func="createPlayback" pkg="@headlessplayback/core" />

### Basic Usage

```ts
const {
  activate,
  getState,
  cleanup,
  onCleanup,
  playbackActions,
  subscribe,
  use,
} = createPlayback({
  id: "media-player",
})

// activate playback when your element is available in the DOM
activate()

// getState returns the current state
const currentState = getState()

// Call cleanup when you don't need it anymore
cleanup()

// onCleanup register a callback function that will be called during cleanup phase
onCleanup(() => {
  console.log("cleanup is called")
})

// playbackActions that you can use to control the playback
playbackActions.setMuted(true)

// subscribe to state changes, it returns an unsubscribe function. It can be called manually or automatically during cleanup phase
const unsubscribe = subscribe(({ state, updatedProperties }) => {
  // do something with the state or updatedProperties
})

// use a plugin
use(plugin)
```

### Type Declaration

```ts
type PlaybackState = {
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
  buffered?: CustomTimeRanges
  textTracks?: CustomTextTrackList
  selectedTrackIndex: number
  isPictureInPictureSupported: boolean

  // Extra properties injected by plugins
}

type PlaybackActions = {
  setCurrentTime: (value: number) => void
  setPlaybackRate: (value: number) => void
  setVolume: (value: number) => void
  setMuted: (value: boolean) => void
  setPaused: (value: boolean) => void
  disableTrack: () => void
  enableTrack: (index: number) => void
  setPictureInPicture: (
    value: boolean,
  ) => Promise<void | PictureInPictureWindow>

  // Extra actions injected by plugins
}

type CleanupFunc = () => void

type OnCleanupHook = (id: string, cb: CleanupFunc) => void

type Plugin<T = unknown> = {
  install: (
    arg: {
      store: ReturnType<typeof createStore<PlaybackState>>
      onCleanup: OnCleanupHook
    },
    ...options: T[]
  ) => CustomPlaybackActions
}

type PluginFunc = <T>(plugin: Plugin<T>, ...options: T[]) => void

function createPlayback(id: string): {
  activate: () => void
  getState: () => PlaybackState
  cleanup: () => void
  onCleanup: (callback: () => void) => void
  playbackActions: PlaybackActions
  subscribe: (
    callback: (arg: {
      state: PlaybackState
      updatedProperties: Partial<PlaybackState>
    }) => void,
  ) => () => void
  use: <T>(plugin: Plugin<T>, options: T) => PlaybackActions
}
```
