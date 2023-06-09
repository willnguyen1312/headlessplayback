# Get Started

Headlessplayback is a little yet powerful and extensive library for powering playback experience on the web. It is
written in pure TypeScript and has no dependencies. The library is built with framework agnostic in mind, so it can be
used with any framework adapters or even without

## Installation

::: code-group

```sh [pnpm]
$ pnpm add @headlessplayback/core
```

```sh [npm]
$ npm install @headlessplayback/core
```

```sh [yarn]
$ yarn add @headlessplayback/core
```

:::

## Example with Vanilla JS

Simply importing the utilities you need from `@headlessplayback/core`

```html
<video controls id="video"></video>

<p id="duration"></p>
<p id="currentTime"></p>
<p id="resolutions"></p>

<button id="switch">Switch stream</button>
```

```ts
import { playback } from "@headlessplayback/core"
import { hlsPlaybackPlugin } from "@headlessplayback/hls-plugin"
playback.use(hlsPlaybackPlugin)

const source1 = "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8"
const source2 = "https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8"
let currentSource = source1

const currentTime = document.getElementById("currentTime") as HTMLParagraphElement
const resolutions = document.getElementById("resolutions") as HTMLParagraphElement
const duration = document.getElementById("duration") as HTMLParagraphElement
const switchBtn = document.getElementById("switch") as HTMLButtonElement

switchBtn.addEventListener("click", () => {
  currentSource = currentSource === source1 ? source2 : source1
  result.playbackActions.load({
    source: currentSource,
  })
})

const result = playback({
  id: "video",
})

result.subscribe(({ state }) => {
  currentTime.innerText = `Current time: ${state.currentTime.toString()}`
  duration.innerText = `Duration: ${state.duration.toString()}`
  resolutions.innerText = `Levels: ${state.levels.map((level) => level.height).join(", ")}`
})

result.activate()
result.playbackActions.load({
  source: source1,
})
```

Refer to [Core API section](/api/) for more details

## Example with React Adapter

Simply importing the utilities you need from `@zoom-image/react`

```css
/* styles.css */
.imageContainer {
  width: var(--imageContainerWidth);
  height: var(--imageContainerHeight);
}

.image {
  width: 100%;
  height: 100%;
}
```

```tsx
import "style.css"
import { useRef, useEffect } from "react"
import { useZoomImageWheel } from "@zoom-image/react"

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { createZoomImage } = useZoomImageWheel()

  useEffect(() => {
    createZoomImage(containerRef.value)
  }, [])

  return (
    <div className="imageContainer" ref={containerRef}>
      <img className="image" alt="Large Pic" src="/image.webp" />
    </div>
  )
}
```

Refer to [React Adapter section](/api/adapters/react) for more details

## Example with Preact Adapter

Simply importing the utilities you need from `@zoom-image/preact`

```css
/* styles.css */
.imageContainer {
  width: var(--imageContainerWidth);
  height: var(--imageContainerHeight);
}

.image {
  width: 100%;
  height: 100%;
}
```

```tsx
import "style.css"
import { useRef, useEffect } from "preact/hooks"
import { useZoomImageWheel } from "@zoom-image/preact"

function App() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { createZoomImage } = useZoomImageWheel()

  useEffect(() => {
    createZoomImage(containerRef.value)
  }, [])

  return (
    <div class="imageContainer" ref={containerRef}>
      <img class="image" alt="Large Pic" src="/image.webp" />
    </div>
  )
}
```

Refer to [Preact Adapter section](/api/adapters/preact) for more details

## Example with Qwik Adapter

Simply importing the utilities you need from `@zoom-image/qwik`

```css
/* styles.css */
.imageContainer {
  width: var(--imageContainerWidth);
  height: var(--imageContainerHeight);
}

.image {
  width: 100%;
  height: 100%;
}
```

```tsx
import "style.css"
import { useSignal, useVisibleTask$ } from "@builder.io/qwik"
import { useZoomImageWheel } from "@zoom-image/qwik"

function App() {
  const containerRef = useSignal<HTMLDivElement>()
  const { createZoomImage } = useZoomImageWheel()

  useVisibleTask$(() => {
    createZoomImage(containerRef.value)
  })

  return (
    <div class="imageContainer" ref={containerRef}>
      <img class="image" alt="Large Pic" src="/image.webp" />
    </div>
  )
}
```

Refer to [Qwik Adapter section](/api/adapters/qwik) for more details

## Example with Solid Adapter

Simply importing the utilities you need from `@zoom-image/qwik`

```css
/* styles.css */
.imageContainer {
  width: var(--imageContainerWidth);
  height: var(--imageContainerHeight);
}

.image {
  width: 100%;
  height: 100%;
}
```

```tsx
import "style.css"
import { useZoomImageWheel } from "@zoom-image/solid"

function App() {
  let container: HTMLDivElement
  const { createZoomImage } = useZoomImageWheel()

  onMount(() => {
    createZoomImage(container)
  })

  return (
    <div class="imageContainer" ref={container}>
      <img class="image" alt="Large Pic" src="/image.webp" />
    </div>
  )
}
```

Refer to [Solid Adapter section](/api/adapters/solid) for more details

## Example with Svelte Adapter

Simply importing the utilities you need from `@zoom-image/svelte`

```svelte
<script lang="ts">
  import { onMount } from "svelte"
  import { useZoomImageWheel } from "@zoom-image/svelte"

  let container: HTMLDivElement
  const { createZoomImage } = useZoomImageWheel()

  onMount(() => {
    createZoomImage(container)
  })
</script>

<div class="imageContainer" bind:this={imageWheelContainer}>
  <img class="image" alt="Large Pic" src="/image.webp" />
</div>

<style>
  .imageContainer {
    width: var(--imageContainerWidth);
    height: var(--imageContainerHeight);
  }

  .image {
    width: 100%;
    height: 100%;
  }
</style>
```

Refer to [Svelte Adapter section](/api/adapters/svelte) for more details

## Example with Vue Adapter

Simply importing the utilities you need from `@zoom-image/vue`

```vue
<script lang="ts" setup>
import { onMounted } from "vue"
import { useZoomImageWheel } from "@zoom-image/vue"

const imageWheelContainerRef = ref<HTMLDivElement>()
const { createZoomImage } = useZoomImageWheel()

onMounted(() => {
  createZoomImage(imageWheelContainerRef.value)
})
</script>

<template>
  <div class="imageContainer" ref="imageWheelContainerRef">
    <img class="image" alt="Large Pic" src="/image.webp" />
  </div>
</template>

<style>
.imageContainer {
  width: var(--imageContainerWidth);
  height: var(--imageContainerHeight);
}

.image {
  width: 100%;
  height: 100%;
}
</style>
```

Refer to [Svelte Adapter section](/api/adapters/vue) for more details

## Demos

- [Vanilla JS](/examples/vanilla)
- [Vue](/examples/vue)
- [React](/examples/react)
- [Preact](/examples/preact)
- [Svelte](/examples/svelte)
- [Solid](/examples/solid)
- [Qwik](/examples/qwik)
