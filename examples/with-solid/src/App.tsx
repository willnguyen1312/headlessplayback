import { For, createMemo, createSignal, type Component } from "solid-js"
import Dash from "./Dash"
import Hijack from "./Hijack"
import Hls from "./Hls"
import Normal from "./Normal"
import Zoomable from "./Zoomable"

function cls(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

const App: Component = () => {
  const [tabs, setTabs] = createSignal([
    { name: "Normal", href: "#", current: true },
    { name: "Hls", href: "#", current: false },
    { name: "Dash", href: "#", current: false },
    { name: "Hijack", href: "#", current: false },
    { name: "Zoomable", href: "#", current: false },
  ])

  const activeTab = createMemo(() => tabs().find((tab) => tab.current)!.name)

  return (
    <>
      <nav class="-mb-px flex space-x-8 border-gray-200" aria-label="Tabs">
        <For each={tabs()}>
          {(tab) => (
            <a
              href={tab.href}
              onClick={(event) => {
                event.preventDefault()
                setTabs((prevTabs) =>
                  prevTabs.map((prevTab) => ({
                    ...prevTab,
                    current: prevTab.name === tab.name,
                  })),
                )
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
          )}
        </For>
      </nav>

      <div class="mt-4">
        {activeTab() === "Normal" && <Normal />}
        {activeTab() === "Hls" && <Hls />}
        {activeTab() === "Dash" && <Dash />}
        {activeTab() === "Hijack" && <Hijack />}
        {activeTab() === "Zoomable" && <Zoomable />}
      </div>
    </>
  )
}

export default App
