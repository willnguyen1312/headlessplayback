/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plugin } from "@headlessplayback/core"
import { clamp } from "@namnode/utils"
export type Direction = "forward" | "backward"

type Hijack = (arg: HijackArgs) => void
type SetDirection = (arg: { direction: Direction }) => void
type SetDuration = (arg: { duration: number }) => void
type SetFrequency = (arg: { frequency: number }) => void

interface _CustomPlaybackState {
  direction: Direction
}

declare module "@headlessplayback/core" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface CustomPlaybackState extends _CustomPlaybackState {}

  export interface CustomPlaybackActions {
    hijack: Hijack
    setDirection: SetDirection
    setDuration: SetDuration
    setFrequency: SetFrequency
  }
}

interface HijackedMediaElement extends HTMLMediaElement {
  paused: boolean
  duration: number
}

type HijackArgs = { frequency: number; duration: number; direction?: Direction }

const hijackPlaybackElement = (
  mediaElement: HijackedMediaElement,
  { frequency, duration, direction }: HijackArgs,
): {
  cleanup: () => void
  setDirection: (newDirection: Direction) => void
  setDuration: (newDuration: number) => void
  setFrequency: (newFrequency: number) => void
} => {
  let _direction = direction ?? "forward"
  let _duration = duration
  let _frequency = frequency

  const mediaProperties = {
    paused: true,
    currentTime: 0,
    playbackRate: 1,
  }

  // configurable value is required to override readonly value of media element
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
  Object.defineProperty(mediaElement, "paused", {
    configurable: true,
    get() {
      return mediaProperties.paused
    },
    set(newValue: boolean) {
      mediaProperties.paused = newValue
      const eventName = newValue ? "pause" : "play"

      mediaElement.dispatchEvent(new CustomEvent(eventName))
    },
  })

  Object.defineProperty(mediaElement, "duration", {
    configurable: true,
    get() {
      return _duration
    },
  })

  Object.defineProperty(mediaElement, "currentTime", {
    configurable: true,
    get() {
      return mediaProperties.currentTime
    },
    set(newValue: number) {
      const normalizedValue = clamp(newValue, 0, _duration)
      mediaProperties.currentTime = normalizedValue
      mediaElement.dispatchEvent(new CustomEvent("timeupdate"))

      // Prevent current time out of bound and dispatch ended event
      if (normalizedValue === _duration) {
        mediaElement.dispatchEvent(new CustomEvent("ended"))
        mediaElement.pause()
        return
      }

      if (normalizedValue === 0) {
        mediaElement.pause()
      }
    },
  })

  // This is meant for custom playback without involving actual media elements
  // since browsers limit the playbackRate to certain levels
  // https://stackoverflow.com/questions/30970920/html5-video-what-is-the-maximum-playback-rate
  Object.defineProperty(mediaElement, "playbackRate", {
    configurable: true,
    get() {
      return mediaProperties.playbackRate
    },
    set(newValue: number) {
      mediaProperties.playbackRate = newValue
      mediaElement.dispatchEvent(new CustomEvent("ratechange"))
    },
  })

  let timerId: number
  const clearTimer = () => {
    if (timerId) {
      clearInterval(timerId)
    }
  }

  Object.assign(mediaElement, {
    play: () => {
      if (mediaElement.currentTime === 0 && _direction === "backward") {
        mediaElement.currentTime = duration
      }

      if (duration === mediaElement.currentTime && _direction === "forward") {
        mediaElement.currentTime = 0
      }

      timerId = setInterval(() => {
        const incrementedTime = (1 * mediaElement.playbackRate) / _frequency
        const factor = _direction === "forward" ? 1 : -1

        mediaElement.currentTime += incrementedTime * factor
      }, 1000 / _frequency)

      mediaElement.paused = false
    },
    pause: () => {
      clearTimer()
      mediaElement.paused = true
    },
  })

  mediaElement.dispatchEvent(new CustomEvent("durationchange"))

  return {
    cleanup: clearTimer,
    setDirection(newDirection: Direction) {
      _direction = newDirection
    },
    setDuration(newDuration: number) {
      _duration = newDuration
      mediaElement.dispatchEvent(new CustomEvent("durationchange"))
    },
    setFrequency(newFrequency: number) {
      _frequency = newFrequency
    },
  }
}

const activeHijackedMap = new Map<
  string,
  ReturnType<typeof hijackPlaybackElement>
>()

const createDefaultState = (): _CustomPlaybackState => {
  return {
    direction: "forward",
  }
}

export const hijackPlaybackPlugin: Plugin = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  install: ({ onCleanup, store }) => {
    store.setState(createDefaultState())

    const hijack: any = ({
      id,
      direction,
      duration,
      frequency,
    }: { id: string } & HijackArgs) => {
      const playbackElement = document.getElementById(id) as HTMLVideoElement
      let hijackedResult = activeHijackedMap.get(id)

      if (hijackedResult) {
        return
      } else {
        hijackedResult = hijackPlaybackElement(playbackElement, {
          direction,
          duration,
          frequency,
        })
        activeHijackedMap.set(id, hijackedResult)
        onCleanup(id, () => {
          hijackedResult?.cleanup()
          activeHijackedMap.delete(id)
        })
      }
    }

    const setDirection = ({
      id,
      direction,
    }: { id: string } & { direction: Direction }) => {
      activeHijackedMap.get(id)?.setDirection(direction)
      store.setState({ direction })
    }

    const setDuration = ({
      id,
      duration,
    }: { id: string } & { duration: number }) => {
      activeHijackedMap.get(id)?.setDuration(duration)
    }

    const setFrequency = ({
      id,
      frequency,
    }: { id: string } & { frequency: number }) => {
      activeHijackedMap.get(id)?.setFrequency(frequency)
    }

    const result = {
      hijack,
      setDirection,
      setDuration,
      setFrequency,
    }

    return result
  },
}
