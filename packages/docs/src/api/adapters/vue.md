<script setup>
import BundleSize from '../../components/BundleSize.vue'
</script>

# Headless playback Vue

The @headlessplayback/vue adapter is a wrapper around the core API.

## `usePlayback` - <BundleSize func="usePlayback" pkg="@headlessplayback/vue" />

### Basic Usage

```ts
function usePlayback(arg: { id: string }): {
  activate
  playbackActions
  playbackState
}

usePlayback.use(plugin, {
  /* Your plugin config */
})
```
