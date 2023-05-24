import { playback, PlaybackState, PluginFunc, PlaybackActions } from "@headlessplayback/core"
import { onCleanup } from "solid-js"
import { createStore, produce } from "solid-js/store"

type Playback = typeof playback

type UsePlaybackFunc = {
  (arg: Parameters<Playback>[0]): {
    playbackState: PlaybackState
    playbackActions: PlaybackActions
    activate: () => void
  }
  use: PluginFunc
}

const playbackStateMaster: Record<string, ReturnType<typeof createStore<PlaybackState>>[0]> = {}

export const usePlayback: UsePlaybackFunc = (arg) => {
  const playbackInstance = playback(arg)

  if (!playbackStateMaster[arg.id]) {
    const [playbackState, setPlaybackState] = createStore(playbackInstance.getState())
    playbackStateMaster[arg.id] = playbackState
    playbackInstance.subscribe(({ updatedProperties }) => {
      setPlaybackState(
        produce((currentPlaybackState) => {
          for (const key in updatedProperties) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            currentPlaybackState[key] = updatedProperties[key]
          }
        }),
      )
    })
  }

  onCleanup(() => {
    playbackInstance.cleanup()
    playbackInstance.getNumberOfUsers() === 0 && delete playbackStateMaster[arg.id]
  })

  return {
    playbackState: playbackStateMaster[arg.id],
    activate: playbackInstance.activate,
    playbackActions: playbackInstance.playbackActions,
  }
}

usePlayback.use = playback.use
