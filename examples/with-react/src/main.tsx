import "virtual:uno.css"
import "@unocss/reset/tailwind.css"

import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import App from "./Routes.tsx"

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
