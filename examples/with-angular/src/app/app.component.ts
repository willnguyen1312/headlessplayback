import { Component } from "@angular/core"
import { PlaybackService } from "@headlessplayback/angular"

type PlaybackName = "Hls" | "Hijack" | "Dash" | "Normal" | "Zoomable"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  providers: [PlaybackService],
})
export class AppComponent {
  tabs = [
    { name: "Normal", href: "#", current: true },
    { name: "Hls", href: "#", current: false },
    { name: "Dash", href: "#", current: false },
    { name: "Hijack", href: "#", current: false },
    { name: "Zoomable", href: "#", current: false },
  ]

  currentTab(): PlaybackName {
    return this.tabs.find((tab) => tab.current)?.name as PlaybackName
  }

  updateTab = (tabName: string) => {
    this.tabs = this.tabs.map((tab) => {
      if (tab.name === tabName) {
        return { ...tab, current: true }
      }
      return { ...tab, current: false }
    })
  }

  constructor(private playbackService: PlaybackService) {}
}
