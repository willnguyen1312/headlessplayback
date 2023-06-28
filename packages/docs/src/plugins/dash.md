<script setup>
import BundleSize from '../components/BundleSize.vue'
</script>

## `dash` - <BundleSize func="dashPlaybackPlugin" pkg="@headlessplayback/dash-plugin" />

### Basic Usage

```ts
import { createPlayback } from "@headlessplayback/core"
import { dashPlaybackPlugin } from "@headlessplayback/dash-plugin"
createPlayback.use(dashPlaybackPlugin)

const { activate, playbackActions } = createPlayback({
  id: "playback",
})

activate()
playbackActions.loadDashSource({
  source: "dash-source",
})
```

### Type Declaration

```ts
interface CustomPlaybackActions {
  loadDashSource: LoadDashSource
}

type LoadDashSource = (arg: { source: string }) => void

interface CustomPlaybackState {
  bitrateInfo: BitrateInfo[]
}

type BitrateInfo = {
  mediaType: MediaType
  bitrate: number
  width: number
  height: number
  scanType: string
  qualityIndex: number
}

type MediaType = "video" | "audio" | "text" | "image"
```
