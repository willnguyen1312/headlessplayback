<script setup>
import BundleSize from '../../components/BundleSize.vue'
</script>

# Headless playback Solid

The @headlessplayback/solid adapter is a wrapper around the core API.

## `usePlayback` - <BundleSize func="usePlayback" pkg="@headlessplayback/solid" />

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
