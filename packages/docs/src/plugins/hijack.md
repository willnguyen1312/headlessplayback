<script setup>
import BundleSize from '../components/BundleSize.vue'
</script>

## `hijack` - <BundleSize func="hijackPlaybackPlugin" pkg="@headlessplayback/hijack-plugin" />

### Basic Usage

```ts
import { createPlayback } from "@headlessplayback/core"
import { hijackPlaybackPlugin } from "@headlessplayback/hijack-plugin"
createPlayback.use(hijackPlaybackPlugin)

const { activate, playbackActions } = createPlayback({
  id: "playback",
})

activate()
playbackActions.hijack({
  duration: 1000,
  frequency: 4,
})
```

### Type Declaration

```ts
interface CustomPlaybackActions {
  hijack: (arg: {
    frequency: number
    duration: number
    direction?: Direction
  }) => void
  setDirection: (arg: { direction: Direction }) => void
  setDuration: (arg: { duration: number }) => void
  setFrequency: (arg: { frequency: number }) => void
}

interface CustomPlaybackState {
  direction: Direction
}

type Direction = "forward" | "backward"
```
