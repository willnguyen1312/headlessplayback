## Plugin

A plugin is an independent module that can be installed to headlessplayback core
to extend functionalities.

By default, headlessplayback comes with no installed plugin to keep the core
lean, fast and small bundle size.

Plugins can be installed by either:

- Calling `use` as returned by `createPlayback` to have plugins installed per
  instance
- Calling `use` method of `createPlayback` to have plugins installed globally

Please feel free to open a pull request to share your plugin 😊

## Template

```ts
declare module "@headlessplayback/core" {
  // This is the type that you can use to extend the core state
  export interface CustomPlaybackState {
    // Your custom state
    customState: string
  }

  // This is the type that you can use to extend the core actions
  export interface CustomPlaybackActions {
    // Your custom actions
    customAction: (arg: { message: string }) => void
  }
}

type Plugin<T = unknown> = {
  install: (
    arg: {
      store: PlaybackStore
      onCleanup: OnCleanupHook
    },
    ...options: T[]
  ) => CustomPlaybackActions
}

type CustomPluginConfig = {
  // Your plugin config
}

export const customPlugin: Plugin<CustomPluginConfig> = {
  install({ store, onCleanup }, config) {
    // Your plugin code

    const customAction = (arg: {
      // id will be injected by headlessplayback core
      id: string
      // The rest is up to you :)
      message: string
    }) => {
      // Your custom actions code
      const playbackElement = document.getElementById(arg.id)

      onCleanup(arg.id, () => {
        // Your cleanup code to be run when the instance is destroyed
      })

      // You have access to the store as well ;)
      const { subscribe, cleanup, getState, setState, batch } = store

      setState({
        customState: arg.message,
      })

      console.log(`customPlugin installed with message: ${message}`)
    }

    return {
      customAction,
    }
  },
}

// Usage
import { createPlayback } from "@headlessplayback/core"
import { customPlugin } from "custom-plugin"

createPlayback.use(customPlugin, {
  /* Your plugin config */
})

const { playbackActions, getState } = createPlayback({ id: "playback" })
// customAction will be available on playbackActions
playbackActions.customAction({
  message: "Hello from plugin",
})

// customState will be available on the state too
const { customState } = getState()
```
