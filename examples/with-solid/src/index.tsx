import "@unocss/reset/tailwind.css"
import { render } from "solid-js/web"
import "virtual:uno.css"
import App from "./App"

const root = document.getElementById("root") as HTMLElement
render(() => <App />, root)
