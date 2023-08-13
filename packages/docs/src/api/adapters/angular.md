<script setup>
import BundleSize from '../../components/BundleSize.vue'
</script>

# Headless playback Angular

The @headlessplayback/angular adapter is a wrapper around the core API.

## `PlaybackService` - <BundleSize func="PlaybackService" pkg="@headlessplayback/angular" />

### Basic Usage

```ts
class PlaybackService {
  // Observable of the current playback state
  playbackState$
  // Current playback state
  playbackState
  // Activate a playback
  activate
  // Playback actions of the current playback
  playbackActions
  // Create playback section
  usePlayback
  // Use plugin
  use
}

class Component {
  id = "playback"
  constructor(private playbackService: PlaybackService) {
    this.playbackService.usePlayback({ id: this.id })
  }
}

PlaybackService.use(plugin, {
  /* Your plugin config */
})
```
