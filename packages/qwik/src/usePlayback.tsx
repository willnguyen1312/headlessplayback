import { playback, PlaybackState, PluginFunc, PlaybackActions } from "@headlessplayback/core"
import { useStore, $, useVisibleTask$ } from "@builder.io/qwik"

type Playback = typeof playback

type UsePlaybackFunc = {
  (arg: Parameters<Playback>[0]): {
    playbackState: PlaybackState
    playbackActions: PlaybackActions
    activate: (cb?: () => void) => void
  }
  use: PluginFunc
}

const playbackInstanceMap = new Map<string, ReturnType<Playback>>()

export const usePlayback: UsePlaybackFunc = (arg) => {
  const playbackState = useStore<{ currentTime: number; duration: number }>({ currentTime: 0, duration: 0 })
  const playbackActionsRef: { value: PlaybackActions } = { value: {} as PlaybackActions }

  const activate = $((cb?: () => void) => {
    const playbackInstance = playbackInstanceMap.get(arg.id) ?? playback(arg)
    playbackInstance.activate()
    playbackInstance.onCleanup(() => {
      playbackInstanceMap.delete(arg.id)
    })
    Object.assign(playbackActionsRef.value, playbackInstance.playbackActions)

    playbackInstance.onCleanup(() => {
      playbackInstanceMap.delete(arg.id)
    })

    const currentState = playbackInstance.getState()
    for (const key in currentState) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      playbackState[key] = currentState[key]
    }

    playbackInstance.subscribe(({ updatedProperties }) => {
      for (const key in updatedProperties) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        playbackState[key] = updatedProperties[key]
      }
    })

    if (!playbackInstanceMap.has(arg.id)) {
      playbackInstanceMap.set(arg.id, playbackInstance)
    }

    cb?.()
  })

  return {
    playbackState,
    activate,
    playbackActions: playbackActionsRef.value,
  }
}

usePlayback.use = playback.use
