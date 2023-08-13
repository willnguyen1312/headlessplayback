# Get Started

Headlessplayback is a little yet powerful and extensive library for powering
playback experience on the web. It is written in pure TypeScript and has no
dependencies. The library is built with framework agnostic in mind, so it can be
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
<video src="src" controls id="video"></video>

<p id="duration"></p>
<p id="currentTime"></p>
```

```ts
import { createPlayback } from "@headlessplayback/core"

const currentTime = document.getElementById(
  "currentTime",
) as HTMLParagraphElement
const duration = document.getElementById("duration") as HTMLParagraphElement

const result = createPlayback({
  id: "playback",
})

result.subscribe(({ state }) => {
  currentTime.innerText = `Current time: ${state.currentTime}`
  duration.innerText = `Duration: ${state.duration}`
})

result.activate()
```

Refer to [Core API section](/api/) for more details

## Example with React Adapter

Simply importing the utilities you need from `@headlessplayback/react`

```tsx
import { useEffect } from "react"
import { usePlayback } from "@headlessplayback/react"

function App() {
  const { activate, playbackState } = usePlayback({
    id: "video",
  })

  useEffect(() => {
    activate()
  }, [])

  return (
    <>
      <video src="src" controls id="video"></video>

      <p>{playbackState.duration}</p>
      <p>{playbackState.currentTime}</p>
    </>
  )
}
```

Refer to [React Adapter section](/api/adapters/react) for more details

## Example with Preact Adapter

Simply importing the utilities you need from `@headlessplayback/preact`

```tsx
import { useEffect } from "preact/hooks"
import { usePlayback } from "@headlessplayback/preact"

function App() {
  const { activate, playbackState } = usePlayback({
    id: "video",
  })

  useEffect(() => {
    activate()
  }, [])

  return (
    <>
      <video src="src" controls id="video"></video>

      <p>{playbackState.duration}</p>
      <p>{playbackState.currentTime}</p>
    </>
  )
}
```

Refer to [Preact Adapter section](/api/adapters/preact) for more details

## Example with Qwik Adapter

Simply importing the utilities you need from `@headlessplayback/qwik`

```tsx
import { usePlayback } from "@headlessplayback/qwik"

function App() {
  const { playbackState } = usePlayback({
    id: "video",
  })

  return (
    <>
      <video src="src" controls id="video"></video>

      <p>{playbackState.duration}</p>
      <p>{playbackState.currentTime}</p>
    </>
  )
}
```

Refer to [Qwik Adapter section](/api/adapters/qwik) for more details

## Example with Solid Adapter

Simply importing the utilities you need from `@headlessplayback/solid`

```tsx
import { onMount } from "solid-js"
import { usePlayback } from "@headlessplayback/solid"

function App() {
  const { activate, playbackActions, playbackState } = usePlayback({
    id: "video",
  })

  onMount(() => {
    activate()
  }, [])

  return (
    <>
      <video src="src" controls id="video"></video>

      <p>{playbackState.duration}</p>
      <p>{playbackState.currentTime}</p>
    </>
  )
}
```

Refer to [Solid Adapter section](/api/adapters/solid) for more details

## Example with Svelte Adapter

Simply importing the utilities you need from `@headlessplayback/svelte`

```svelte
<script lang="ts">
  import { onMount } from "svelte"
  import { usePlayback } from "@headlessplayback/svelte"

  const { activate, playbackState: _playbackState } = usePlayback({
    id,
  })

  let playbackState: PlaybackState

  const unsubscribe = _playbackState.subscribe((value: PlaybackState) => {
    playbackState = value
  })

  onMount(() => {
    activate()
  })
</script>

<video src="src" id="video" controls />

<p>{playbackState.duration}</p>
<p>{playbackState.currentTime}</p>
```

Refer to [Svelte Adapter section](/api/adapters/svelte) for more details

## Example with Vue Adapter

Simply importing the utilities you need from `@headlessplayback/vue`

```vue
<script lang="ts" setup>
import { onMounted } from "vue"
import { usePlayback } from "@headlessplayback/vue"

const { playbackState, activate } = usePlayback({
  id: "video",
})

onMounted(() => {
  activate()
})
</script>

<template>
  <video src="src" id="video" controls />

  <p>{{ playbackState.duration }}</p>
  <p>{{ playbackState.currentTime }}</p>
</template>
```

Refer to [Vue Adapter section](/api/adapters/vue) for more details

## Example with Angular Adapter

Simply importing the utilities you need from `@headlessplayback/angular`

```html
<!-- playback.component.html -->
<video src="src" [id]="id" controls />

<p>{{ playbackState.duration }}</p>
<p>{{ playbackState.currentTime }}</p>
```

```ts
// playback.component.ts
import { AfterViewInit, Component } from "@angular/core"
import { PlaybackService, PlaybackState } from "@headlessplayback/angular"

@Component({
  selector: "playback-component",
  templateUrl: "./playback.component.html",
  providers: [PlaybackService],
})
export class PlaybackNormalComponent implements AfterViewInit {
  id = "playback"
  playbackState: PlaybackState

  constructor(private playbackService: PlaybackService) {
    this.playbackService.usePlayback({ id: this.id })
    this.playbackState = this.playbackService.playbackState
  }

  ngAfterViewInit() {
    this.playbackService.activate()
    this.playbackService.playbackState$.subscribe((state) => {
      this.playbackState = state
    })
  }
}
```

Refer to [Angular Adapter section](/api/adapters/angular) for more details

## Demos

- [Vanilla JS](/examples/vanilla)
- [Vue](/examples/vue)
- [Angular](/examples/angular)
- [React](/examples/react)
- [Preact](/examples/preact)
- [Svelte](/examples/svelte)
- [Solid](/examples/solid)
- [Qwik](/examples/qwik)
