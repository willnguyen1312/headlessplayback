import { Plugin } from "@headlessplayback/core"
import Hls, { HlsConfig } from "hls.js"

declare module "@headlessplayback/core" {
  export interface CustomPlaybackState {
    resolutions: string[]
  }

  export interface CustomPlaybackFunc {
    load: (arg: { id: string; src: string }) => void
  }
}

export const hlsPlaybackPlugin: Plugin<Partial<HlsConfig>> = {
  install({ playback, store, onCleanup }, config) {
    const hlsMap = new WeakMap<HTMLMediaElement, Hls>()

    playback.load = ({ id, src }) => {
      const playbackElement = document.getElementById(id) as HTMLVideoElement
      let hls = hlsMap.get(playbackElement)

      if (hls) {
        hls.destroy()
        hls = new Hls(config)
        hlsMap.set(playbackElement, hls)
      } else {
        hls = new Hls(config)
        hlsMap.set(playbackElement, hls)
        onCleanup(playbackElement, () => {
          hls?.destroy()
        })
      }

      hls.loadSource(src)
      hls.attachMedia(playbackElement)
      hls.on(Hls.Events.MANIFEST_PARSED, function (_, data) {
        store.setState({
          resolutions: data.levels.map((level) => level.height.toString()),
        })
      })
    }
  },
}
