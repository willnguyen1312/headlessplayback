import { playback, PlaybackState, PluginFunc } from "@headlessplayback/core"
import { useEffect, useRef } from "react"
import { proxy, useSnapshot } from "valtio"

type Playback = typeof playback

type UsePlaybackFunc = {
  (arg: Parameters<Playback>[0]): {
    playbackState: PlaybackState
    activate: () => void
    playback: Playback
  }
  use: PluginFunc
}

const playbackStateMaster: Record<string, PlaybackState> = {}

export const usePlayback: UsePlaybackFunc = (arg) => {
  const playbackRef = useRef<ReturnType<Playback>>()

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

  const playbackState = useSnapshot(playbackStateMaster[arg.id])

  useEffect(() => {
    return () => {
      playbackRef.current?.cleanup()
      playbackRef.current?.getNumberOfUsers() === 0 && delete playbackStateMaster[arg.id]
    }
  }, [])

  return {
    playbackState,
    activate: playbackRef.current.activate,
    playback,
  }
}

usePlayback.use = playback.use
