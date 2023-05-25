import { playback, PluginFunc, PlaybackActions, PlaybackState } from "@headlessplayback/core"
import { onDestroy } from "svelte"
import { writable } from "svelte/store"

type Playback = typeof playback

type PlaybackStateSubscriber = ReturnType<typeof writable>["subscribe"]

type UsePlaybackFunc = {
  (arg: Parameters<Playback>[0]): {
    playbackState: {
      subscribe: PlaybackStateSubscriber
    }
    playbackActions: PlaybackActions
    activate: () => void
  }
  use: PluginFunc
}

const playbackStateMaster = new Map<string, PlaybackStateSubscriber>()
const playbackInstanceMap = new Map<string, ReturnType<Playback>>()

export const usePlayback: UsePlaybackFunc = (arg) => {
  if (!playbackInstanceMap.has(arg.id)) {
    const playbackInstance = playback(arg)
    playbackInstanceMap.set(arg.id, playbackInstance)

    const { subscribe, set } = writable<PlaybackState>(playbackInstance.getState())
    playbackStateMaster.set(arg.id, subscribe)

    playbackInstance.subscribe(({ state }) => {
      set(state)
    })
  }

  onDestroy(() => {
    playbackInstanceMap.get(arg.id)?.cleanup()
  })

  const activate = () => {
    const playbackInstance = playbackInstanceMap.get(arg.id) as ReturnType<Playback>
    const isActivated = playbackInstance.activate()
    if (isActivated) {
      playbackInstance.onCleanup(() => {
        playbackStateMaster.delete(arg.id)
        playbackInstanceMap.delete(arg.id)
      })
    }
  }

  return {
    playbackState: {
      subscribe: playbackStateMaster.get(arg.id) as PlaybackStateSubscriber,
    },
    activate,
    playbackActions: (playbackInstanceMap.get(arg.id) as ReturnType<Playback>).playbackActions,
  }
}

usePlayback.use = playback.use
