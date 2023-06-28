<script setup>
import BundleSize from '../components/BundleSize.vue'
</script>

## `hls` - <BundleSize func="hlsPlaybackPlugin" pkg="@headlessplayback/hls-plugin" />

### Basic Usage

```ts
import { createPlayback } from "@headlessplayback/core"
import { hlsPlaybackPlugin } from "@headlessplayback/hls-plugin"
createPlayback.use(hlsPlaybackPlugin)

const { activate, playbackActions } = createPlayback({
  id: "playback",
})

activate()
playbackActions.loadHlsSource({
  source: "hls-source",
})
```

### Type Declaration

```ts
interface CustomPlaybackActions {
  loadHlsSource: LoadFunction
  setCurrentLevel: SetCurrentLevel
  setSubtitleTrack: SetSubtitleTrack
  setAudioTrack: SetAudioTrack
}

type LoadFunction = (arg: { source: string }) => void
type SetCurrentLevel = (arg: { level: number }) => void
type SetSubtitleTrack = (arg: { subtitleTrack: number }) => void
type SetAudioTrack = (arg: { audioTrack: number }) => void

interface CustomPlaybackState {
  levels: Level[]
  currentLevel: number
  subtitleTracks: SubtitleTrack[]
  subtitleTrack: number
  audioTracks: AudioTrack[]
  audioTrack: number
  hlsStatus: HlsStatus
  errorDetail: ErrorDetails | null
}

interface Level {
  bitrate: number
  width: number
  height: number
  id: number
}

interface SubtitleTrack {
  id: number
  lang?: string
}

interface AudioTrack {
  id: number
  lang?: string
  name: string
}
```
