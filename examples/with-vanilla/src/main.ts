import "@unocss/reset/tailwind.css"
import "virtual:uno.css"

import { createPlayback } from "@headlessplayback/core"
import { dashPlaybackPlugin } from "@headlessplayback/dash-plugin"
import { hijackPlaybackPlugin } from "@headlessplayback/hijack-plugin"
import { hlsPlaybackPlugin } from "@headlessplayback/hls-plugin"
createPlayback.use(hlsPlaybackPlugin)
createPlayback.use(dashPlaybackPlugin)
createPlayback.use(hijackPlaybackPlugin)

type PlayerType = "hls" | "dash" | "hijack"

let currentResult: any

function makeHlsPlayback() {
  const source1 =
    "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8"
  const source2 = "https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8"
  let currentSource = source1

  const next5sBtn = document.getElementById("next5s") as HTMLButtonElement
  const prev5sBtn = document.getElementById("prev5s") as HTMLButtonElement
  const currentTime = document.getElementById(
    "currentTime",
  ) as HTMLParagraphElement
  const resolutions = document.getElementById(
    "resolutions",
  ) as HTMLParagraphElement
  const duration = document.getElementById("duration") as HTMLParagraphElement
  const switchBtn = document.getElementById("switch") as HTMLButtonElement

  const result = createPlayback({
    id: "hls",
  })

  next5sBtn.addEventListener("click", () => {
    result.playbackActions.setCurrentTime(result.getState().currentTime + 5)
  })

  prev5sBtn.addEventListener("click", () => {
    result.playbackActions.setCurrentTime(result.getState().currentTime - 5)
  })

  switchBtn.addEventListener("click", () => {
    currentSource = currentSource === source1 ? source2 : source1
    result.playbackActions.loadHlsSource({
      source: currentSource,
    })
  })

  result.subscribe(({ state }) => {
    currentTime.innerText = `Current time: ${state.currentTime}`
    duration.innerText = `Duration: ${state.duration}`
    resolutions.innerHTML = `<strong>Levels: ${state.levels
      .map((level) => level.height)
      .join(", ")}</strong>`
  })

  result.activate()
  result.playbackActions.loadHlsSource({
    source: source1,
  })

  currentResult = result
}

function makeDashPlayback() {
  const source1 = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd"
  const source2 =
    "https://rdmedia.bbc.co.uk/elephants_dream/1/client_manifest-all.mpd"
  let currentSource = source1

  const next5sBtn = document.getElementById("next5s") as HTMLButtonElement
  const prev5sBtn = document.getElementById("prev5s") as HTMLButtonElement
  const currentTime = document.getElementById(
    "currentTime",
  ) as HTMLParagraphElement
  const resolutions = document.getElementById(
    "resolutions",
  ) as HTMLParagraphElement
  const duration = document.getElementById("duration") as HTMLParagraphElement
  const switchBtn = document.getElementById("switch") as HTMLButtonElement

  const result = createPlayback({
    id: "dash",
  })

  next5sBtn.addEventListener("click", () => {
    result.playbackActions.setCurrentTime(result.getState().currentTime + 5)
  })

  prev5sBtn.addEventListener("click", () => {
    result.playbackActions.setCurrentTime(result.getState().currentTime - 5)
  })

  switchBtn.addEventListener("click", () => {
    currentSource = currentSource === source1 ? source2 : source1
    result.playbackActions.loadDashSource({
      source: currentSource,
    })
  })

  result.subscribe(({ state }) => {
    currentTime.innerText = `Current time: ${state.currentTime}`
    duration.innerText = `Duration: ${state.duration}`
    resolutions.innerHTML = `<strong>BitrateInfo: ${state.bitrateInfo
      .map((level) => level.height)
      .join(", ")}</strong>`
  })

  result.activate()
  result.playbackActions.loadDashSource({
    source: source1,
  })

  currentResult = result
}

const makeHijackPlayback = () => {
  const currentTime = document.getElementById(
    "currentTime",
  ) as HTMLParagraphElement
  const direction = document.getElementById("direction") as HTMLParagraphElement

  const next5sBtn = document.getElementById("next5s") as HTMLButtonElement
  const prev5sBtn = document.getElementById("prev5s") as HTMLButtonElement
  const duration = document.getElementById("duration") as HTMLParagraphElement
  const togglePlayBtn = document.getElementById(
    "togglePlay",
  ) as HTMLButtonElement
  const toggleDirectionBtn = document.getElementById(
    "toggleDirection",
  ) as HTMLButtonElement

  const result = createPlayback({
    id: "hijack",
  })

  next5sBtn.addEventListener("click", () => {
    result.playbackActions.setCurrentTime(result.getState().currentTime + 5)
  })

  prev5sBtn.addEventListener("click", () => {
    result.playbackActions.setCurrentTime(result.getState().currentTime - 5)
  })

  togglePlayBtn.addEventListener("click", () => {
    if (result.getState().paused) {
      result.playbackActions.setPaused(false)
      togglePlayBtn.innerText = "Pause"
    } else {
      result.playbackActions.setPaused(true)
      togglePlayBtn.innerText = "Play"
    }
  })

  toggleDirectionBtn.addEventListener("click", () => {
    const currentDirection =
      result.getState().direction === "forward" ? "backward" : "forward"
    result.playbackActions.setDirection({ direction: currentDirection })
  })

  result.subscribe(({ state }) => {
    currentTime.innerText = `Current time: ${state.currentTime}`
    duration.innerText = `Duration: ${state.duration}`
    direction.innerText = `Direction: ${state.direction}`
    togglePlayBtn.innerText = state.paused ? "Play" : "Pause"
  })

  result.activate()
  result.playbackActions.hijack({
    duration: 1000,
    frequency: 4,
  })

  currentResult = result
}

const parent = document.getElementById("parent") as HTMLDivElement
const nav = document.getElementById("nav") as HTMLDivElement

const getImageTemplate = (id: PlayerType) => {
  const template = document.getElementById(id) as HTMLTemplateElement
  return template.content.cloneNode(true)
}

const activeClass =
  "cursor-pointer whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium border-violet-500 text-violet-600"
const inactiveClass =
  "cursor-pointer whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"

const anchorList = nav.querySelectorAll("a")
anchorList.forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    const target = event.target as HTMLAnchorElement

    if (target.dataset.current === "true") {
      return
    }

    anchorList.forEach((anchor) => {
      anchor.dataset.current = "false"
      anchor.className = inactiveClass
    })

    anchor.dataset.current = "true"
    anchor.className = activeClass
    currentResult.cleanup()

    const dataName = anchor.dataset.name as PlayerType
    const template = getImageTemplate(dataName)
    parent.replaceChildren(template)

    const handlers: Record<PlayerType, () => void> = {
      hls: makeHlsPlayback,
      dash: makeDashPlayback,
      hijack: makeHijackPlayback,
    }

    const handler = handlers[dataName]
    handler()
  })
})

const template = getImageTemplate("hls")
parent.replaceChildren(template)

makeHlsPlayback()
