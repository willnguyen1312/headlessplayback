import { Plugin } from "@headlessplayback/core"
import { flushPromises } from "@namnode/utils"
import dashjs, { MediaPlayerSettingClass } from "dashjs"

interface _CustomPlaybackState {
  bitrateInfo: dashjs.BitrateInfo[]
}

declare module "@headlessplayback/core" {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface CustomPlaybackState extends _CustomPlaybackState {}

  export interface CustomPlaybackActions {
    loadDashSource: (arg: { source: string }) => void
  }
}

const activeDashMap = new Map<string, dashjs.MediaPlayerClass>()
const activeIdSourceMap = new Map<string, string>()

const createDefaultState = (): _CustomPlaybackState => {
  return {
    bitrateInfo: [],
  }
}

export type DashConfig = MediaPlayerSettingClass

export const dashPlaybackPlugin: Plugin<DashConfig> = {
  install({ store, onCleanup }, config) {
    store.setState(createDefaultState())

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const loadDashSource: any = async ({ id, source }: { id: string; source: string }) => {
      await flushPromises()

      if (activeIdSourceMap.get(id) === source) {
        return
      }

      const playbackElement = document.getElementById(id) as HTMLVideoElement

      let dashInstance = activeDashMap.get(id)

      if (dashInstance) {
        dashInstance.destroy()
        dashInstance = dashjs.MediaPlayer().create()
        activeDashMap.set(id, dashInstance)
      } else {
        dashInstance = dashjs.MediaPlayer().create()
        activeDashMap.set(id, dashInstance)

        onCleanup(id, () => {
          activeDashMap.get(id)?.destroy()
          activeDashMap.delete(id)
          activeIdSourceMap.delete(id)
        })
      }

      dashInstance.updateSettings(config)
      dashInstance.initialize()
      dashInstance.attachView(playbackElement)
      dashInstance.attachSource(source)

      dashInstance.on(dashjs.MediaPlayer.events.STREAM_INITIALIZED, () => {
        const infos = dashInstance?.getBitrateInfoListFor("video")

        store.setState({
          bitrateInfo: infos,
        })
      })
    }

    return {
      loadDashSource,
    }
  },
}
