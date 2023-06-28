import { hijackPlaybackPlugin } from "@headlessplayback/hijack-plugin"
import { usePlayback } from "@headlessplayback/solid"
import { onMount, type Component } from "solid-js"
usePlayback.use(hijackPlaybackPlugin)

const id = "hijack"

const Hijack: Component = () => {
  const { activate, playbackActions, playbackState } = usePlayback({
    id,
  })

  onMount(() => {
    // Activate when playback element is accessible from the DOM
    activate()
    playbackActions.hijack({
      direction: playbackState.direction,
      duration: 1000,
      frequency: 4,
    })
  })

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
    if (playbackState.direction === "forward") {
      playbackActions.setDirection({ direction: "backward" })
    } else {
      playbackActions.setDirection({ direction: "forward" })
    }
  }

  return (
    <>
      <video class="display-none" hidden id={id} />

      <p>Current time: {playbackState.currentTime}</p>
      <p>Duration: {playbackState.duration}</p>
      <p>Direction: {playbackState.direction}</p>

      <div class="flex flex-col items-start ">
        <button onClick={jumpNext5s}>Next 5s</button>
        <button onClick={togglePlay}>
          {playbackState.paused ? "Play" : "Pause"}
        </button>
        <button onClick={jumpPrev5s}>Prev 5s</button>
        <button onClick={toggleDirection}>Toggle direction</button>
      </div>
    </>
  )
}

export default Hijack
