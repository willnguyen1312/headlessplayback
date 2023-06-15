import "@unocss/reset/tailwind.css"
import "virtual:uno.css"

import { createPlayback } from "@headlessplayback/core"
import { dashPlaybackPlugin } from "@headlessplayback/dash-plugin"
import { hlsPlaybackPlugin } from "@headlessplayback/hls-plugin"
createPlayback.use(hlsPlaybackPlugin)
createPlayback.use(dashPlaybackPlugin)

// const source1 = "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8"
// const source2 = "https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8"
const source1 = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd"
const source2 = "https://rdmedia.bbc.co.uk/elephants_dream/1/client_manifest-all.mpd"
let currentSource = source1

const currentTime = document.getElementById("currentTime") as HTMLParagraphElement
const resolutions = document.getElementById("resolutions") as HTMLParagraphElement
const duration = document.getElementById("duration") as HTMLParagraphElement
const switchBtn = document.getElementById("switch") as HTMLButtonElement

switchBtn.addEventListener("click", () => {
  currentSource = currentSource === source1 ? source2 : source1
  result.playbackActions.loadDashSource({
    source: currentSource,
  })
})

const result = createPlayback({
  id: "video",
})

result.subscribe(({ state }) => {
  currentTime.innerText = `Current time: ${state.currentTime.toString()}`
  duration.innerText = `Duration: ${state.duration.toString()}`
  resolutions.innerText = `Levels: ${state.levels.map((level) => level.height).join(", ")}`
  resolutions.innerText = `BitrateInfo: ${state.bitrateInfo.map((level) => level.height).join(", ")}`
})

result.activate()
result.playbackActions.loadDashSource({
  source: source1,
})
