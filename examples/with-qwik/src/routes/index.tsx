import { component$, useComputed$, useSignal } from "@builder.io/qwik"
import Dash from "./Dash"
import Hijack from "./Hijack"
import Hls from "./Hls"

function cls(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

type PlaybackName = "Hls" | "Dash" | "Hijack"

const componentLookup: Record<PlaybackName, ReturnType<typeof component$>> = {
  Hls,
  Dash,
  Hijack,
}

const App = component$(() => {
  const tabs = useSignal<
    { name: PlaybackName; href: string; current: boolean }[]
  >([
    { name: "Hls", href: "#", current: true },
    { name: "Dash", href: "#", current: false },
    { name: "Hijack", href: "#", current: false },
  ])

  const currentValue = useComputed$(() => {
    return tabs.value.find((tab) => tab.current)?.name as PlaybackName
  })

  const ComponentToRender = useComputed$(() => {
    return componentLookup[currentValue.value]
  }).value

  return (
    <div class="p-4">
      <nav class="-mb-px flex space-x-8 border-gray-200" aria-label="Tabs">
        {tabs.value.map((tab) => (
          <a
            key={tab.name}
            href={tab.href}
            preventdefault:click
            onClick$={() => {
              tabs.value = tabs.value.map((prevTab) => ({
                ...prevTab,
                current: prevTab.name === tab.name,
              }))
            }}
            class={cls(
              tab.current
                ? "border-violet-500 text-violet-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
              "whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium",
            )}
            aria-current={tab.current ? "page" : undefined}
          >
            {tab.name}
          </a>
        ))}
      </nav>

      <div class="mt-4">
        <ComponentToRender />
      </div>
    </div>
  )
})

export default App
