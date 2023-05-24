import "virtual:uno.css"
import "@unocss/reset/tailwind.css"
import { component$ } from "@builder.io/qwik"
import { PlaybackProvider } from "@headlessplayback/qwik"
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from "@builder.io/qwik-city"

export default component$(() => {
  return (
    <QwikCityProvider>
      <PlaybackProvider>
        <head>
          <meta charSet="utf-8" />
          <link rel="manifest" href="/manifest.json" />
        </head>
        <body lang="en">
          <RouterOutlet />
          <ServiceWorkerRegister />
        </body>
      </PlaybackProvider>
    </QwikCityProvider>
  )
})
