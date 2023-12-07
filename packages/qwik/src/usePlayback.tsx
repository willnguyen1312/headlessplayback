import { $, useStore, useVisibleTask$ } from "@builder.io/qwik"
import {
  PlaybackActions,
  PlaybackState,
  Plugin,
  PluginFunc,
  createPlayback,
} from "@headlessplayback/core"

type CreatePlayback = typeof createPlayback

type UsePlaybackFunc = {
  (arg: Parameters<CreatePlayback>[0]): {
    playbackState: PlaybackState
    playbackActions: PlaybackActions
    activate: () => void
    use: PluginFunc
  }
}

const playbackInstanceMap = new Map<string, ReturnType<CreatePlayback>>()

export const usePlayback: UsePlaybackFunc = (arg) => {
  const playbackState = useStore<PlaybackState>({} as PlaybackState)
  const playbackActionsRef: { value: PlaybackActions } = {
    value: {} as PlaybackActions,
  }

  const activate = $(() => {
    const playbackInstance =
      playbackInstanceMap.get(arg.id) ?? createPlayback(arg)
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
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const use: PluginFunc = $((plugin: Plugin) => {
    const playbackInstance =
      playbackInstanceMap.get(arg.id) ?? createPlayback(arg)
    const result = playbackInstance.use(plugin)
    Object.assign(playbackActionsRef.value, result)
  })

  useVisibleTask$(({ cleanup }) => {
    activate()

    cleanup(() => {
      playbackInstanceMap.get(arg.id)?.cleanup()
    })
  })

  return {
    playbackState,
    activate,
    playbackActions: playbackActionsRef.value,
    use,
  }
}
