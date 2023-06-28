<script setup>
import BundleSize from '../../components/BundleSize.vue'
</script>

# Headless playback Preact

The @headlessplayback/preact adapter is a wrapper around the core
headlessplayback API.

## `usePlayback` - <BundleSize func="usePlayback" pkg="@headlessplayback/preact" />

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
