import { playback, PlaybackState, PluginFunc, PlaybackActions, Plugin } from "@headlessplayback/core"
import {
  useStore,
  $,
  useVisibleTask$,
  component$,
  Slot,
  createContextId,
  useContextProvider,
  useContext,
} from "@builder.io/qwik"

type Playback = typeof playback

type UsePlaybackFunc = {
  (arg: Parameters<Playback>[0]): {
    playbackState: PlaybackState
    playbackActions: PlaybackActions
    activate: () => void
    use: PluginFunc
  }
}

const PlaybackMasterStateContext = createContextId<PlaybackState>("PlaybackMasterStateContext")

export const PlaybackProvider = component$(() => {
  const playbackMasterState = useStore<PlaybackState>({
    currentTime: 0,
    duration: 0,
  })
  useContextProvider(PlaybackMasterStateContext, playbackMasterState)
  return <Slot />
})

const playbackInstanceMap = new Map<string, ReturnType<Playback>>()

export const usePlayback: UsePlaybackFunc = (arg) => {
  const playbackState = useContext(PlaybackMasterStateContext)
  const playbackActionsRef: { value: PlaybackActions } = { value: {} as PlaybackActions }

  const activate = $(() => {
    if (playbackInstanceMap.has(arg.id)) {
      return
    }

    const playbackInstance = playback(arg)
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

  const use: PluginFunc = $((plugin: Plugin) => {
    const playbackInstance = playbackInstanceMap.get(arg.id) ?? playback(arg)
    const result = playbackInstance.use(plugin)

    Object.assign(playbackActionsRef.value, result)
  })

  return {
    playbackState,
    activate,
    playbackActions: playbackActionsRef.value,
    use,
  }
}
