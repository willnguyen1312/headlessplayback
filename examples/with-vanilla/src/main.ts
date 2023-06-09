import "virtual:uno.css"
import "@unocss/reset/tailwind.css"

import { playback } from "@headlessplayback/core"
import { hlsPlaybackPlugin } from "@headlessplayback/hls-plugin"
playback.use(hlsPlaybackPlugin)

const source1 = "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8"
const source2 = "https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8"
let currentSource = source1

const currentTime = document.getElementById("currentTime") as HTMLParagraphElement
const resolutions = document.getElementById("resolutions") as HTMLParagraphElement
const duration = document.getElementById("duration") as HTMLParagraphElement
const switchBtn = document.getElementById("switch") as HTMLButtonElement

switchBtn.addEventListener("click", () => {
  currentSource = currentSource === source1 ? source2 : source1
  result.playbackActions.load({
    source: currentSource,
  })
})

const result = playback({
  id: "video",
})

result.subscribe(({ state }) => {
  currentTime.innerText = `Current time: ${state.currentTime.toString()}`
  duration.innerText = `Duration: ${state.duration.toString()}`
  resolutions.innerText = `Levels: ${state.levels.map((level) => level.height).join(", ")}`
})

result.activate()
result.playbackActions.load({
  source: source1,
})
