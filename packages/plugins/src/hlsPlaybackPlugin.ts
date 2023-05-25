import { Plugin } from "@headlessplayback/core"
import Hls, { HlsConfig } from "hls.js"

// Credit: https://github.com/kentor/flush-promises
const flushPromises = () => new Promise((resolve) => setTimeout(resolve))

type LoadFunction = (arg: { id: string; source: string }) => void

declare module "@headlessplayback/core" {
  export interface CustomPlaybackState {
    resolutions: string[]
    message: string
  }

  export interface CustomPlaybackActions {
    load: LoadFunction
  }
}

const activeHlsMap = new Map<string, Hls>()
const activeIdSourceMap = new Map<string, string>()

export const hlsPlaybackPlugin: Plugin<Partial<HlsConfig>> = {
  install({ store, onCleanup }, config) {
    const load: LoadFunction = async ({ id, source }) => {
      await flushPromises()

      if (activeIdSourceMap.get(id) === source) {
        return
      }

      const playbackElement = document.getElementById(id) as HTMLVideoElement

      let hls = activeHlsMap.get(id)

      if (hls) {
        hls.destroy()
        activeHlsMap.delete(id)

        hls = new Hls(config)
        activeHlsMap.set(id, hls)
      } else {
        hls = new Hls(config)
        activeHlsMap.set(id, hls)
        onCleanup(id, () => {
          activeHlsMap.get(id)?.destroy()
          activeHlsMap.delete(id)
          activeIdSourceMap.delete(id)
        })
      }

      hls.loadSource(source)
      hls.attachMedia(playbackElement)

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        store.setState({
          resolutions: data.levels.map((level) => level.height.toString()),
          message: "Hi there",
        })
      })

      // Reference - https://github.com/video-dev/hls.js/blob/master/docs/API.md#fifth-step-error-handling
      hls.on(Hls.Events.ERROR, function (_, data) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.info("fatal media error encountered, try to recover")
              hls?.recoverMediaError()
              break
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("fatal network error encountered", data)
              // All retries and media options have been exhausted.
              // Immediately trying to restart loading could cause loop loading.
              // Consider modifying loading policies to best fit your asset and network
              // conditions (manifestLoadPolicy, playlistLoadPolicy, fragLoadPolicy).
              break
            default:
              // cannot recover
              hls?.destroy()
              break
          }
        }
      })

      activeIdSourceMap.set(id, source)
    }

    return {
      load,
    }
  },
}
