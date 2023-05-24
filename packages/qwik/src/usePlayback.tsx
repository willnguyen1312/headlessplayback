import { playback, PlaybackState, PluginFunc, PlaybackActions } from "@headlessplayback/core"
import { useVisibleTask$, Slot, component$, createContextId, useContextProvider, useStore } from "@builder.io/qwik"

type Playback = typeof playback

type UsePlaybackFunc = {
  (arg: Parameters<Playback>[0]): {
    playbackState: PlaybackState
    playbackActions: PlaybackActions
    activate: () => void
  }
  use: PluginFunc
}

const PlaybackContext = createContextId<Record<string, PlaybackState>>("playbackContext")

export const PlaybackProvider = component$(() => {
  const playbackStateMaster = useStore<Record<string, PlaybackState>>({}, { deep: true })
  useContextProvider(PlaybackContext, playbackStateMaster)
  return <Slot />
})

const playbackStateMaster: Record<string, PlaybackState> = {}

export const usePlayback: UsePlaybackFunc = (arg) => {
  const playbackInstance = playback(arg)

  if (!playbackRef.current) {
    playbackRef.current = playback(arg)

    if (!playbackStateMaster[arg.id]) {
      playbackStateMaster[arg.id] = proxy(playbackRef.current.getState())
      playbackRef.current.subscribe(({ updatedProperties }) => {
        for (const key in updatedProperties) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          playbackStateMaster[arg.id][key] = updatedProperties[key]
        }
      })
    }
  }

  useVisibleTask$(({ cleanup }) => {
    cleanup(() => {
      playbackRef.current?.cleanup()
      playbackRef.current?.getNumberOfUsers() === 0 && delete playbackStateMaster[arg.id]
    })
  })

  return {
    playbackState,
    activate: playbackRef.current.activate,
    playbackActions: playbackRef.current.playbackActions,
  }
}

usePlayback.use = playback.use
