import { makePlayback, PlaybackState, PluginFunc } from "@headlessplayback/core"
import { useRef, useSyncExternalStore } from "react"

type Playback = ReturnType<typeof makePlayback>

type UsePlaybackFunc = {
  (arg: Parameters<Playback>[0]): {
    playbackState: PlaybackState
    activate: () => void
    playback: Playback
  }
  use: PluginFunc
}

const playback = makePlayback()

export const usePlayback: UsePlaybackFunc = (arg) => {
  const playbackRef = useRef<ReturnType<Playback>>()

  if (!playbackRef.current) {
    playbackRef.current = playback(arg)
  }

  const playbackState = useSyncExternalStore(
    playbackRef.current.subscribe,
    playbackRef.current.getState,
    playbackRef.current.getState,
  )

  return {
    playbackState,
    activate: playbackRef.current.activate,
    playback: playback,
  }
}

usePlayback.use = playback.use
