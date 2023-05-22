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

export const usePlayback: UsePlaybackFunc = (arg) => {
  const playbackRef = useRef<ReturnType<Playback>>()
  const playbackStateRef = useRef<PlaybackState>()

  if (!playbackRef.current) {
    playbackRef.current = playback(arg)
    playbackStateRef.current = proxy(playbackRef.current.getState()) as PlaybackState

    playbackRef.current.subscribe((state) => {
      for (const key in state) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        playbackStateRef.current[key] = state[key]
      }
    })
  }

  const playbackState = useSnapshot(playbackStateRef.current as PlaybackState)

  useEffect(() => {
    return () => {
      playbackRef.current?.cleanup()
    }
  }, [])

  return {
    playbackState,
    activate: playbackRef.current.activate,
    playback,
  }
}

usePlayback.use = playback.use
