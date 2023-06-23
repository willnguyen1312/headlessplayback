import { Direction, hijackPlaybackPlugin } from "@headlessplayback/hijack-plugin"
import { usePlayback } from "@headlessplayback/preact"
import { useEffect, useState } from "preact/hooks"
usePlayback.use(hijackPlaybackPlugin)

const id = "hijack"

function CurrentTime() {
  const playback = usePlayback({
    id,
  })

  return <p>Current time: {playback.playbackState.currentTime}</p>
}

const Duration = () => {
  const { playbackState } = usePlayback({
    id,
  })

  return <p>Duration: {playbackState.duration}</p>
}

function Hijack() {
  const { activate, playbackActions, playbackState } = usePlayback({
    id,
  })
  const [direction, setDirection] = useState<Direction>("forward")

  useEffect(() => {
    // Activate when playback element is accessible from the DOM
    activate()

    playbackActions.hijack({ direction, duration: 1000, frequency: 4 })
  }, [])

  useEffect(() => {
    playbackActions.setDirection({ direction })
  }, [direction])

  function jumpNext5s() {
    // Core actions and state are always available
    playbackActions.setCurrentTime(playbackState.currentTime + 5)
  }

  function jumpPrev5s() {
    playbackActions.setCurrentTime(playbackState.currentTime - 5)
  }

  function togglePlay() {
    if (playbackState.paused) {
      playbackActions.setPaused(false)
    } else {
      playbackActions.setPaused(true)
    }
  }

  function toggleDirection() {
    if (direction === "forward") {
      setDirection("backward")
    } else {
      setDirection("forward")
    }
  }

  return (
    <>
      <video hidden id={id}></video>

      <CurrentTime />
      <Duration />
      <p>Direction: {direction}</p>

      <div class="flex flex-col items-start ">
        <button onClick={jumpNext5s}>Next 5s</button>
        <button onClick={togglePlay}>{playbackState.paused ? "Play" : "Pause"}</button>
        <button onClick={jumpPrev5s}>Prev 5s</button>
        <button onClick={toggleDirection}>Toggle direction</button>
      </div>
    </>
  )
}

export default Hijack
