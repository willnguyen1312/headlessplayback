import { PlaybackStore } from "@headlessplayback/core"
import Hls from "hls.js"

declare module "@headlessplayback/core" {
  export interface CustomPlaybackState {
    resolutions: string[]
  }
}

export default {
  install(store: PlaybackStore, options: { mseString: string }) {
    const playbackElement = store.getState().playbackElement

    if (playbackElement) {
      var hls = new Hls()
      hls.loadSource(options.mseString)
      hls.attachMedia(playbackElement)

      hls.on(Hls.Events.MANIFEST_PARSED, function (_, data) {
        store.setState({
          resolutions: data.levels.map((level) => level.height.toString()),
        })
      })
    }
  },
}
