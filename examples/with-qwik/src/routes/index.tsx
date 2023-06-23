import { component$, useComputed$, useSignal } from "@builder.io/qwik"
import Dash from "./Dash"
import Hijack from "./Hijack"
import Hls from "./Hls"

function cls(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

type PlaybackName = "Hls" | "Dash" | "Hijack"

const App = component$(() => {
  const tabs = useSignal<{ name: PlaybackName; href: string; current: boolean }[]>([
    { name: "Hls", href: "#", current: true },
    { name: "Dash", href: "#", current: false },
    { name: "Hijack", href: "#", current: false },
  ])

  const currentValue = useComputed$(() => {
    return tabs.value.find((tab) => tab.current)?.name as PlaybackName
  })

  return (
    <div class="p-4">
      <div class="sm:hidden">
        <label for="tabs" class="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          class="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          value={currentValue.value}
        >
          {tabs.value.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>

      <div class="hidden sm:block">
        <div class="border-gray-200">
          <nav class="-mb-px flex space-x-8" aria-label="Tabs">
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
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium",
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>

      <div class="mt-4">
        {currentValue.value === "Hls" && <Hls />}
        {currentValue.value === "Dash" && <Dash />}
        {currentValue.value === "Hijack" && <Hijack />}
      </div>
    </div>
  )
})

export default App
