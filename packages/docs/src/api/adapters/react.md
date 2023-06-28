<script setup>
import BundleSize from '../../components/BundleSize.vue'
</script>

# Headless playback React

The @headlessplayback/react adapter is a wrapper around the core
headlessplayback API.

## `usePlayback` - <BundleSize func="usePlayback" pkg="@headlessplayback/react" />

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
