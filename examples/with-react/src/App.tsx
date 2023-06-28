import { useMemo, useState } from "react"
import Dash from "./Dash"
import Hijack from "./Hijack"
import Hls from "./Hls"

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ")
}

export default function App() {
  const [tabs, setTabs] = useState([
    { name: "Hls", href: "#", current: true },
    { name: "Dash", href: "#", current: false },
    { name: "Hijack", href: "#", current: false },
  ])

  const activeComponentName = tabs.find((tab) => tab.current)?.name

  const renderedComponent = useMemo(() => {
    if (activeComponentName === "Hijack") {
      return <Hijack />
    }

    if (activeComponentName === "Hls") {
      return <Hls />
    }

    if (activeComponentName === "Dash") {
      return <Dash />
    }

    return null
  }, [activeComponentName])

  return (
    <div className="p-4">
      <nav className="-mb-px flex space-x-8 border-gray-200" aria-label="Tabs">
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
            className={classNames(
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

      <div className="mt-4">{renderedComponent}</div>
    </div>
  )
}
