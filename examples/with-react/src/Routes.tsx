import * as React from "react"
import { Routes, Route, Outlet, Link } from "react-router-dom"

const App1 = React.lazy(() => import("./App1"))
const App2 = React.lazy(() => import("./App2"))

export default function App() {
  return (
    <div>
      <h1>Code Splitting Example</h1>

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="app1"
            element={
              <React.Suspense fallback={<>...</>}>
                <App1 />
              </React.Suspense>
            }
          />
          <Route
            path="App2"
            element={
              <React.Suspense fallback={<>...</>}>
                <App2 />
              </React.Suspense>
            }
          />
          <Route path="*" element={<NoMatch />} />
        </Route>
      </Routes>
    </div>
  )
}

function Layout() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/app1">App1</Link>
          </li>
          <li>
            <Link to="/app2">App2</Link>
          </li>
        </ul>
      </nav>

      <hr />

      <Outlet />
    </div>
  )
}

function Home() {
  return (
    <div>
      <h2>Home Route</h2>
    </div>
  )
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  )
}
