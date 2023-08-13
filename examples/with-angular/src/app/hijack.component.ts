import { AfterViewInit, Component } from "@angular/core"
import { PlaybackService, PlaybackState } from "@headlessplayback/angular"
import { hijackPlaybackPlugin } from "@headlessplayback/hijack-plugin"
import { sleep } from "./helper"
PlaybackService.use(hijackPlaybackPlugin)

@Component({
  selector: "playback-hijack",
  templateUrl: "./hijack.component.html",
  providers: [PlaybackService],
})
export class PlaybackHijackComponent implements AfterViewInit {
  id = "hijack"
  playbackState: PlaybackState

  constructor(private playbackService: PlaybackService) {
    this.playbackService.usePlayback({ id: this.id })
    this.playbackState = this.playbackService.playbackState
  }

  async ngAfterViewInit() {
    await sleep(0)
    this.playbackService.activate()
    this.playbackService.playbackState$.subscribe((state) => {
      this.playbackState = state
    })
    this.playbackService.playbackActions.hijack({
      duration: 1000,
      frequency: 4,
    })
  }

  jumpTo(time: number) {
    this.playbackService.playbackActions.setCurrentTime(time)
  }

  togglePlay() {
    this.playbackService.playbackActions.setPaused(
      this.playbackState.paused ? false : true,
    )
  }

  toggleDirection() {
    this.playbackService.playbackActions.setDirection({
      direction:
        this.playbackState.direction === "forward" ? "backward" : "forward",
    })
  }
}
