import { playback, PlaybackState, PluginFunc, PlaybackActions } from "@headlessplayback/core"
import {
  useVisibleTask$,
  Slot,
  component$,
  createContextId,
  useContextProvider,
  useStore,
  useContext,
  $,
  noSerialize,
  useTask$,
} from "@builder.io/qwik"

type Playback = typeof playback

type UsePlaybackFunc = {
  (arg: Parameters<Playback>[0]): {
    playbackState: PlaybackState
    playbackActions: PlaybackActions
    activate: () => void
  }
  use: PluginFunc
}

const PlaybackStateContext = createContextId<Record<string, PlaybackState>>("PlaybackStateContext")
const PlaybackMapContext = createContextId<Record<string, ReturnType<Playback>>>("PlaybackMapContext")

export const PlaybackProvider = component$(() => {
  const playbackStateMaster = useStore<Record<string, PlaybackState>>({}, { deep: true })
  const playbackInstanceMap = useStore<Record<string, ReturnType<Playback>>>({}, { deep: true })
  useContextProvider(PlaybackStateContext, playbackStateMaster)
  useContextProvider(PlaybackMapContext, playbackInstanceMap)
  return <Slot />
})

// const playbackStateMaster = new Map<string, PlaybackState>()
const playbackInstanceMap = new Map<string, ReturnType<Playback>>()

export const usePlayback: UsePlaybackFunc = (arg) => {
  const playbackState = useStore<{ currentTime: number; duration: number }>({ currentTime: 0, duration: 0 })
  const playbackActionsRef: { value: PlaybackActions } = { value: {} as PlaybackActions }

  const activate = $(() => {
    if (!playbackInstanceMap.has(arg.id)) {
      const playbackInstance = playback(arg)
      playbackInstance.activate()

      Object.assign(playbackActionsRef.value, playbackInstance.playbackActions)

      playbackInstance.onCleanup(() => {
        // playbackStateMaster.delete(arg.id)
        playbackInstanceMap.delete(arg.id)
      })

      // if (!playbackInstanceMap.has(arg.id)) {
      // const playbackInstance = playback(arg)
      playbackInstanceMap.set(arg.id, playbackInstance)
      // playbackStateMaster.set(arg.id, (playbackInstance.getState()))

      const currentState = playbackInstance.getState()
      for (const key in currentState) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        playbackState[key] = currentState[key]
      }

      playbackInstance.subscribe(({ updatedProperties }) => {
        // const playbackState = playbackStateMaster.get(arg.id) as PlaybackState
        for (const key in updatedProperties) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          playbackState[key] = updatedProperties[key]
        }
      })
    }
    // }

    // const playbackInstance = playback(arg) as ReturnType<Playback>
    // playbackInstance.activate() // console.log("playbackInstance", playbackInstance)

    // Object.assign(playbackActionsRef.value, playbackInstance.playbackActions)
    // const currentState = playbackInstance.getState()

    // for (const key in currentState) {
    //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //   // @ts-ignore
    //   playbackState[key] = currentState[key]
    // }

    // playbackInstance.subscribe(({ updatedProperties }) => {
    //   for (const key in updatedProperties) {
    //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //     // @ts-ignore
    //     playbackState[key] = updatedProperties[key]
    //   }
    // })
  })

  return {
    playbackState,
    activate,
    playbackActions: playbackActionsRef.value,
  }
}

usePlayback.use = playback.use
