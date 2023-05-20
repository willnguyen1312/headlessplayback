import "virtual:uno.css"
import "@unocss/reset/tailwind.css"

import { createPlayback } from "@headlessplayback/core"
import msePlaybackPlugin from "../msePlaybackPlugin"
createPlayback.use(msePlaybackPlugin, {
  mseString: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
})

const videoElement = document.getElementById("video") as HTMLVideoElement
const currentTime = document.getElementById("currentTime") as HTMLParagraphElement
const duration = document.getElementById("duration") as HTMLParagraphElement

const result = createPlayback(videoElement)

result.subscribe((state) => {
  currentTime.innerText = state.currentTime.toString()
  duration.innerText = state.duration.toString()
  console.log(state.resolutions)
})

result.activate()
