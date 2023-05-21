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
  install(arg, config) {
    arg.playback.load = ({ id, src }) => {
      const playbackElement = document.getElementById(id) as HTMLVideoElement
      const hls = new Hls(config)
      hls.loadSource(src)
      hls.attachMedia(playbackElement)
      hls.on(Hls.Events.MANIFEST_PARSED, function (_, data) {
        arg.store.setState({
          resolutions: data.levels.map((level) => level.height.toString()),
        })
      })
    }
  },
}
