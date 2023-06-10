import { $, noSerialize, useStore, useVisibleTask$ } from "@builder.io/qwik"
import { PlaybackActions, PlaybackState, Plugin, PluginFunc, createPlayback } from "@headlessplayback/core"

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
  const playbackActionsRef: { value: PlaybackActions } = { value: {} as PlaybackActions }

  const activate = $(() => {
    const playbackInstance = playbackInstanceMap.get(arg.id) ?? createPlayback(arg)
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
        // These two are special cases because they are objects that are not serializable
        if (["textTracks", "buffered", "levels"].includes(key)) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          playbackState[key] = noSerialize(updatedProperties[key])
          continue
        }

        if (["subtitleTracks", "audioTracks"].includes(key)) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          playbackState[key] = updatedProperties[key].map((track) => ({
            id: track.id,
            lang: track.lang,
          }))
          continue
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        playbackState[key] = updatedProperties[key]

        console.log(playbackState)
      }
    })

    if (!playbackInstanceMap.has(arg.id)) {
      playbackInstanceMap.set(arg.id, playbackInstance)
    }
  })

  const use: PluginFunc = $((plugin: Plugin) => {
    const playbackInstance = playbackInstanceMap.get(arg.id) ?? createPlayback(arg)
    const result = playbackInstance.use(plugin)
    Object.assign(playbackActionsRef.value, result)
  })

  useVisibleTask$(() => {
    activate()
  })

  return {
    playbackState,
    activate,
    playbackActions: playbackActionsRef.value,
    use,
  }
}
