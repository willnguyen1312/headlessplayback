<script setup>
import BundleSize from '../components/BundleSize.vue'
</script>

## `rotatable` - <BundleSize func="rotatablePlaybackPlugin" pkg="@headlessplayback/rotatable-plugin" />

### Basic Usage

```ts
import { createPlayback } from "@headlessplayback/core"
import { rotatablePlugin } from "@headlessplayback/rotatable-plugin"
createPlayback.use(rotatablePlugin)

const { activate, playbackActions } = createPlayback({
  id: "playback",
})

activate()
playbackActions.createRotatablePlayback({
  // Reference to the playback's container element
  container,
})
```

### Type Declaration

```ts
interface CustomPlaybackActions {
  createRotatablePlayback: (arg: { container: HTMLElement }) => void
  rotate: () => void
}
```
