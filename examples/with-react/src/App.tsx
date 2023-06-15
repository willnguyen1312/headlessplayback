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
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          defaultValue={tabs.find((tab) => tab.current)?.name}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
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

      <div className="mt-4">{renderedComponent}</div>
    </div>
  )
}
