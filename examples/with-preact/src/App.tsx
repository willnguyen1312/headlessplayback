import { useMemo, useState } from "preact/hooks"
import Dash from "./Dash"
import Hijack from "./Hijack"
import Hls from "./Hls"
import Normal from "./Normal"
import Rotatable from "./Rotatable"
import Zoomable from "./Zoomable"

function cls(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default function App() {
  const [tabs, setTabs] = useState([
    { name: "Normal", href: "#", current: true },
    { name: "Hls", href: "#", current: false },
    { name: "Dash", href: "#", current: false },
    { name: "Hijack", href: "#", current: false },
    { name: "Rotatable", href: "#", current: false },
    { name: "Zoomable", href: "#", current: false },
  ])

  const activeComponentName = tabs.find((tab) => tab.current)?.name

  const renderedComponent = useMemo(() => {
    if (activeComponentName === "Normal") {
      return <Normal />
    }

    if (activeComponentName === "Hijack") {
      return <Hijack />
    }

    if (activeComponentName === "Hls") {
      return <Hls />
    }

    if (activeComponentName === "Dash") {
      return <Dash />
    }

    if (activeComponentName === "Zoomable") {
      return <Zoomable />
    }

    if (activeComponentName === "Rotatable") {
      return <Rotatable />
    }

    return null
  }, [activeComponentName])

  return (
    <div class="p-4">
      <nav class="-mb-px flex space-x-8 border-gray-200" aria-label="Tabs">
        {tabs.map((tab) => (
          <a
            key={tab.name}
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
        ))}
      </nav>

      <div class="mt-4">{renderedComponent}</div>
    </div>
  )
}
