import { Plugin } from "@headlessplayback/core"
import type { PointerPosition } from "./utils"
import {
  clamp,
  disableScroll,
  enableScroll,
  getPointersCenter,
  makeMaybeCallFunction,
} from "./utils"

interface _CustomPlaybackState {
  currentRotation?: number
  currentZoom: number
  enableZoom: boolean
}

type SetEnableZoom = (arg: { enableZoom: boolean }) => void
type SetCurrentZoom = (arg: { currentZoom: number }) => void

declare module "@headlessplayback/core" {
  export interface CustomPlaybackState extends _CustomPlaybackState {}

  export interface CustomPlaybackActions {
    createZoomablePlayback: (arg: {
      container: HTMLElement
      options?: ZoomableVideoOptions
    }) => void
    setEnableZoom: SetEnableZoom
    setCurrentZoom: SetCurrentZoom
  }
}

type ZoomableVideoOptions = {
  maxZoom?: number
  wheelZoomRatio?: number
}

/* The delta values are not consistent across browsers.
 * We need to normalize them to a consistent value.
 * https://developer.mozilla.org/en-US/docs/Web/API/WheelEvent/deltaY
 */
const ZOOM_DELTA = 0.5

const createDefaultState = (): _CustomPlaybackState => {
  return {
    currentZoom: 1,
    enableZoom: false,
  }
}

const activeZoomableMap = new Map()

export const zoomablePlaybackPlugin: Plugin = {
  install: ({ store, onCleanup }) => {
    store.setState(createDefaultState())

    function _createZoomableVideo({
      id,
      container,
      options = {},
    }: {
      id: string
      container: HTMLElement
      options: ZoomableVideoOptions
    }) {
      const playbackElement = document.getElementById(id) as HTMLVideoElement
      const finalOptions: Required<ZoomableVideoOptions> = {
        maxZoom: options.maxZoom || 4,
        wheelZoomRatio: options.wheelZoomRatio || 0.1,
      }

      let currentPositionX = -1
      let currentPositionY = -1

      const calculatePositionX = (
        newPositionX: number,
        currentZoom: number,
      ) => {
        if (newPositionX > 0) return 0
        if (newPositionX + width * currentZoom < width)
          return -width * (currentZoom - 1)
        return newPositionX
      }

      const calculatePositionY = (
        newPositionY: number,
        currentZoom: number,
      ) => {
        if (newPositionY > 0) return 0
        if (newPositionY + height * currentZoom < height)
          return -height * (currentZoom - 1)
        return newPositionY
      }

      let prevDistance = -1
      let isDimensionsSwitched = false
      let enabledScroll = true
      const pointerMap = new Map<number, { x: number; y: number }>()

      let lastPositionX = 0
      let lastPositionY = 0
      let startX = 0
      let startY = 0
      let lastWidth = container.clientWidth
      let lastHeight = container.clientHeight
      let width = container.clientWidth
      let height = container.clientHeight

      container.style.overflow = "hidden"
      // playbackElement.style.transformOrigin = "0 0"

      function updateZoom() {
        const currentState = store.getState()

        playbackElement.style.transform = `translate(${currentPositionX}px, ${currentPositionY}px) scale(${currentState.currentZoom})`
      }

      function processZoomWheel({
        delta,
        x,
        y,
      }: {
        delta: number
        x: number
        y: number
      }) {
        const containerRect = container.getBoundingClientRect()
        const currentState = store.getState()

        const zoomPointX = x - containerRect.left
        const zoomPointY = y - containerRect.top

        const zoomX = currentPositionX
        const zoomY = currentPositionY

        const zoomTargetX = (zoomPointX - zoomX) / currentState.currentZoom
        const zoomTargetY = (zoomPointY - zoomY) / currentState.currentZoom

        const newCurrentZoom = clamp(
          currentState.currentZoom +
            delta * finalOptions.wheelZoomRatio * currentState.currentZoom,
          1,
          finalOptions.maxZoom,
        )

        currentPositionX = calculatePositionX(
          -zoomTargetX * newCurrentZoom + zoomPointX,
          newCurrentZoom,
        )
        currentPositionY = calculatePositionY(
          -zoomTargetY * newCurrentZoom + zoomPointY,
          newCurrentZoom,
        )

        store.setState({
          currentZoom: newCurrentZoom,
        })
      }

      function _handleWheel(event: WheelEvent) {
        event.preventDefault()

        if (
          store.getState().currentZoom === finalOptions.maxZoom &&
          event.deltaY < 0
        ) {
          return
        }

        const delta = -clamp(event.deltaY, -ZOOM_DELTA, ZOOM_DELTA)
        processZoomWheel({ delta, x: event.clientX, y: event.clientY })
        updateZoom()
      }

      function _handlePointerMove(event: PointerEvent) {
        event.preventDefault()
        const { clientX, clientY, pointerId } = event
        for (const [cachedPointerid] of pointerMap.entries()) {
          if (cachedPointerid === pointerId) {
            pointerMap.set(cachedPointerid, { x: clientX, y: clientY })
          }
        }

        if (pointerMap.size === 2) {
          const pointersIterator = pointerMap.values()
          const first = pointersIterator.next().value as PointerPosition
          const second = pointersIterator.next().value as PointerPosition
          const curDistance = Math.sqrt(
            Math.pow(first.x - second.x, 2) + Math.pow(first.y - second.y, 2),
          )
          const { x, y } = getPointersCenter(first, second)
          if (prevDistance > 0) {
            if (curDistance > prevDistance) {
              // The distance between the two pointers has increased
              processZoomWheel({ delta: ZOOM_DELTA, x, y })
            }
            if (curDistance < prevDistance) {
              // The distance between the two pointers has decreased
              processZoomWheel({ delta: -ZOOM_DELTA, x, y })
            }
          }
          // Store the distance for the next move event
          prevDistance = curDistance
          updateZoom()
          return
        }

        if (pointerMap.size === 1) {
          const { currentZoom } = store.getState()
          const normalizedClientX = clientX
          const normalizedClientY = clientY

          const offsetX = normalizedClientX - startX
          const offsetY = normalizedClientY - startY

          currentPositionX = calculatePositionX(
            lastPositionX + offsetX,
            currentZoom,
          )

          currentPositionY = calculatePositionY(
            lastPositionY + offsetY,
            currentZoom,
          )

          updateZoom()
        }
      }

      function _handlePointerDown(event: PointerEvent) {
        event.preventDefault()
        if (pointerMap.size === 2) {
          return
        }

        if (enabledScroll) {
          disableScroll()
          enabledScroll = false
        }

        const { clientX, clientY, pointerId } = event

        lastPositionX = currentPositionX
        lastPositionY = currentPositionY
        startX = clientX
        startY = clientY
        pointerMap.set(pointerId, { x: clientX, y: clientY })
      }

      function _handlePointerUp(event: PointerEvent) {
        event.preventDefault()
        pointerMap.delete(event.pointerId)

        if (pointerMap.size === 0) {
          prevDistance = -1
        }

        if (pointerMap.size === 0 && !enabledScroll) {
          enableScroll()
          enabledScroll = true
        }

        lastPositionX = currentPositionX
        lastPositionY = currentPositionY
      }

      function _handlePointerLeave(event: PointerEvent) {
        event.preventDefault()
        pointerMap.delete(event.pointerId)
        prevDistance = -1
        if (!enabledScroll) {
          enableScroll()
          enabledScroll = true
        }
      }

      function _handlePointerEnter() {
        width = container.clientWidth
        height = container.clientHeight
      }

      function checkZoomEnabled() {
        return store.getState().enableZoom
      }

      const handleWheel = makeMaybeCallFunction(checkZoomEnabled, _handleWheel)
      const handlePointerDown = makeMaybeCallFunction(
        checkZoomEnabled,
        _handlePointerDown,
      )
      const handlePointerLeave = makeMaybeCallFunction(
        checkZoomEnabled,
        _handlePointerLeave,
      )
      const handlePointerMove = makeMaybeCallFunction(
        checkZoomEnabled,
        _handlePointerMove,
      )
      const handlePointerUp = makeMaybeCallFunction(
        checkZoomEnabled,
        _handlePointerUp,
      )

      const handlePointerEnter = makeMaybeCallFunction(
        checkZoomEnabled,
        _handlePointerEnter,
      )

      const controller = new AbortController()
      const { signal } = controller
      container.addEventListener("wheel", handleWheel, { signal })
      container.addEventListener("pointerenter", handlePointerEnter, { signal })
      container.addEventListener("pointerdown", handlePointerDown, { signal })
      container.addEventListener("pointerleave", handlePointerLeave, { signal })
      container.addEventListener("pointermove", handlePointerMove, { signal })
      container.addEventListener("pointerup", handlePointerUp, { signal })

      store.subscribe(async ({ state }) => {
        if (state.currentRotation === undefined) return

        isDimensionsSwitched = state.currentRotation % 180 !== 0

        // Wait for the next frame to get the correct dimensions
        await new Promise((resolve) => setTimeout(resolve, 1))

        lastWidth = width
        lastHeight = height
        width = container.clientWidth
        height = container.clientHeight

        calculatePositionX(currentPositionX, state.currentZoom)
        calculatePositionY(currentPositionY, state.currentZoom)
      })

      return {
        cleanup() {
          controller.abort()
          store.cleanup()
        },
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createZoomablePlayback: any = (
      arg: Parameters<typeof _createZoomableVideo>[0],
    ) => {
      const zoomableResult = activeZoomableMap.get(arg.id)

      if (zoomableResult) {
        return
      } else {
        const result = _createZoomableVideo(arg)
        activeZoomableMap.set(arg.id, result)

        onCleanup(arg.id, () => {
          result.cleanup()
          activeZoomableMap.delete(arg.id)
        })
      }
    }

    const setEnableZoom = ({ enableZoom }: { enableZoom: boolean }) => {
      store.setState({ enableZoom })
    }

    const setCurrentZoom = ({ currentZoom }: { currentZoom: number }) => {
      store.setState({ currentZoom })
    }

    return {
      createZoomablePlayback,
      setEnableZoom,
      setCurrentZoom,
    }
  },
}
