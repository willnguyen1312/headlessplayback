import { Plugin } from "@headlessplayback/core"

declare module "@headlessplayback/core" {
  export interface CustomPlaybackState {}

  export interface CustomPlaybackActions {}
}

export const zoomablePlaybackPlugin: Plugin = {
  install: () => {
    return {}
  },
}
