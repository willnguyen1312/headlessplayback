import { createPlayback, PlaybackActions, PlaybackState, PluginFunc } from "@headlessplayback/core"
import { useEffect } from "react"
import { proxy, useSnapshot } from "valtio"

type CreatePlayback = typeof createPlayback

type UsePlaybackFunc = {
  (arg: Parameters<CreatePlayback>[0]): {
    playbackState: PlaybackState
    playbackActions: PlaybackActions
    activate: () => void
  }
  use: PluginFunc
}

const playbackStateMaster = new Map<string, PlaybackState>()
const playbackInstanceMap = new Map<string, ReturnType<CreatePlayback>>()

export const usePlayback: UsePlaybackFunc = (arg) => {
  if (!playbackInstanceMap.has(arg.id)) {
    const playbackInstance = createPlayback(arg)
    playbackInstanceMap.set(arg.id, playbackInstance)
    playbackStateMaster.set(arg.id, proxy(playbackInstance.getState()))

    playbackInstance.subscribe(({ updatedProperties }) => {
      const playbackState = playbackStateMaster.get(arg.id) as PlaybackState
      for (const key in updatedProperties) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        playbackState[key] = updatedProperties[key]
      }
    })
  }

  const activate = () => {
    const playbackInstance = playbackInstanceMap.get(arg.id) as ReturnType<CreatePlayback>
    const isActivated = playbackInstance.activate()
    if (isActivated) {
      playbackInstance.onCleanup(() => {
        playbackStateMaster.delete(arg.id)
        playbackInstanceMap.delete(arg.id)
      })
    }
  }

  useEffect(() => {
    return () => {
      playbackInstanceMap.get(arg.id)?.cleanup()
    }
  }, [])

  const playbackState = useSnapshot(playbackStateMaster.get(arg.id) as PlaybackState)

  return {
    playbackState,
    activate,
    playbackActions: (playbackInstanceMap.get(arg.id) as ReturnType<CreatePlayback>).playbackActions,
  }
}

usePlayback.use = createPlayback.use
