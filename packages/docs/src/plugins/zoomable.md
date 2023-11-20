<script setup>
import BundleSize from '../components/BundleSize.vue'
</script>

## `hijack` - <BundleSize func="zoomablePlaybackPlugin" pkg="@headlessplayback/zoomable-plugin" />

### Basic Usage

```ts
import { createPlayback } from "@headlessplayback/core"
import { zoomablePlaybackPlugin } from "@headlessplayback/zoomable-plugin"
createPlayback.use(zoomablePlaybackPlugin)

const { activate, playbackActions } = createPlayback({
  id: "playback",
})

activate()
playbackActions.createZoomablePlayback({
  // Reference to the playback's container element
  container,
})
```

### Type Declaration

```ts
interface CustomPlaybackActions {
  createZoomablePlayback: (arg: {
    container: HTMLElement
    options?: ZoomableVideoOptions
  }) => void
  setEnableZoom: (arg: { enableZoom: boolean }) => void
  setCurrentZoom: (arg: { currentZoom: number }) => void
}

type ZoomableVideoOptions = {
  maxZoom?: number
  wheelZoomRatio?: number
}
```
