import { Plugin } from "@headlessplayback/core"

interface _CustomPlaybackState {
  width: number
  height: number
  currentRotation: number
  currentScale: number
}

const createDefaultState = (): _CustomPlaybackState => {
  return {
    width: 0,
    height: 0,
    currentRotation: 0,
    currentScale: 1,
  }
}

declare module "@headlessplayback/core" {
  export interface CustomPlaybackState extends _CustomPlaybackState {}

  export interface CustomPlaybackActions {
    createRotatablePlayback: (arg: { container: HTMLElement }) => void
    rotate: () => void
  }
}

const activeRotatableMap = new Map()

export const rotatablePlaybackPlugin: Plugin = {
  install: ({ store, onCleanup }) => {
    store.setState(createDefaultState())

    function _createRotatablePlayback({
      id,
      container,
    }: {
      id: string
      container: HTMLElement
    }) {
      const playbackElement = document.getElementById(
        id,
      ) as HTMLVideoElement | null
      const controller = new AbortController()
      const { signal } = controller

      function updatePlaybackDimensions() {
        if (!playbackElement) return

        const { clientWidth, clientHeight } = container
        const { videoWidth, videoHeight } = playbackElement

        const isDimensionsSwitched =
          store.getState().currentRotation % 180 !== 0
        const finalVideoWidth = isDimensionsSwitched ? videoHeight : videoWidth
        const finalVideoHeight = isDimensionsSwitched ? videoWidth : videoHeight

        const containerRatio = clientWidth / clientHeight
        const videoRatio = finalVideoWidth / finalVideoHeight

        const currentScale = isDimensionsSwitched
          ? Math.max(videoWidth, videoHeight) /
            Math.min(videoWidth, videoHeight)
          : 1

        playbackElement.style.transform = `rotate(${
          store.getState().currentRotation
        }deg) scale(${currentScale})`

        if (containerRatio > videoRatio) {
          store.setState({
            width: clientHeight * videoRatio,
            height: clientHeight,
            currentScale,
          })
        } else {
          store.setState({
            width: clientWidth,
            height: clientWidth / videoRatio,
            currentScale,
          })
        }
      }

      playbackElement?.addEventListener(
        "loadedmetadata",
        () => {
          updatePlaybackDimensions()
        },
        { signal },
      )

      const resizeObserver = new ResizeObserver(updatePlaybackDimensions)

      resizeObserver.observe(container)

      store.subscribe(({ updatedProperties }) => {
        if (updatedProperties.currentRotation) {
          updatePlaybackDimensions()
        }
      })

      return {
        cleanup: () => {
          controller.abort()
          store.cleanup()
          resizeObserver.disconnect()
        },
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createRotatablePlayback: any = (
      arg: Parameters<typeof _createRotatablePlayback>[0],
    ) => {
      const zoomableResult = activeRotatableMap.get(arg.id)

      if (zoomableResult) {
        return
      } else {
        const result = _createRotatablePlayback(arg)
        activeRotatableMap.set(arg.id, result)

        onCleanup(arg.id, () => {
          result.cleanup()
          activeRotatableMap.delete(arg.id)
        })
      }
    }

    function rotate() {
      store.setState({
        currentRotation: store.getState().currentRotation + 90,
      })
    }

    return {
      createRotatablePlayback,
      rotate,
    }
  },
}
