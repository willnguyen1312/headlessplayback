import "virtual:uno.css"
import "@unocss/reset/tailwind.css"

import { playback } from "@headlessplayback/core"
// import { hlsPlaybackPlugin } from "@headlessplayback/plugins"

// playback.use(hlsPlaybackPlugin)

const source1 =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"

const source2 = "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"

const videoElement = document.getElementById("video") as HTMLVideoElement
const currentTime = document.getElementById("currentTime") as HTMLParagraphElement
const duration = document.getElementById("duration") as HTMLParagraphElement
const switchBtn = document.getElementById("switch") as HTMLButtonElement

switchBtn.addEventListener("click", () => {
  videoElement.src = videoElement.src === source1 ? source2 : source1
})

const result = playback({
  id: "video",
})

result.subscribe((state) => {
  currentTime.innerText = `Current time: ${state.currentTime.toString()}`
  duration.innerText = `Duration: ${state.duration.toString()}`
  // console.log(state.resolutions)
})

result.activate()
