<script setup>
import BundleSize from '../../components/BundleSize.vue'
</script>

# Headless playback Qwik

The @headlessplayback/qwik adapter is a wrapper around the core API.

## `usePlayback` - <BundleSize func="usePlayback" pkg="@headlessplayback/qwik" />

```ts
function usePlayback(arg: { id: string }): {
  activate
  playbackActions
  playbackState
  use
}
```
