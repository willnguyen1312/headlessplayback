import "@unocss/reset/tailwind.css"
import "virtual:uno.css"

import { playback } from "@headlessplayback/core"

const source1 = "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8"
const source2 = "https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8"
let currentSource = source1

const currentTime = document.getElementById("currentTime") as HTMLParagraphElement
const resolutions = document.getElementById("resolutions") as HTMLParagraphElement
const duration = document.getElementById("duration") as HTMLParagraphElement
const switchBtn = document.getElementById("switch") as HTMLButtonElement
const activate = document.getElementById("activate") as HTMLButtonElement

const hitIt = async () => {
  const { hlsPlaybackPlugin } = await import("@headlessplayback/hls-plugin")
  playback.use(hlsPlaybackPlugin)

  const result = playback({
    id: "video",
  })

  switchBtn.addEventListener("click", () => {
    currentSource = currentSource === source1 ? source2 : source1
    result.playbackActions.load({
      source: currentSource,
    })
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
}

activate.addEventListener("click", hitIt)
