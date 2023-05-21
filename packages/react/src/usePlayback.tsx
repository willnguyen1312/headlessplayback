import { playback, PlaybackState, PluginFunc } from "@headlessplayback/core"
import { useEffect, useRef, useSyncExternalStore } from "react"

type Playback = typeof playback

type UsePlaybackFunc = {
  (arg: Parameters<Playback>[0]): {
    playbackState: PlaybackState
    activate: () => void
    playback: Playback
  }
  use: PluginFunc
}

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

  useEffect(() => {
    return () => {
      playbackRef.current?.cleanup()
    }
  }, [])

  return {
    playbackState,
    activate: playbackRef.current.activate,
    playback: playback,
  }
}

usePlayback.use = playback.use
