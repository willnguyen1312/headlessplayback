import { AfterViewInit, Component, ViewChild } from "@angular/core"
import { PlaybackService, PlaybackState } from "@headlessplayback/angular"
import { rotatablePlaybackPlugin } from "@headlessplayback/rotatable-plugin"
import { sleep } from "./helper"

PlaybackService.use(rotatablePlaybackPlugin)

@Component({
  selector: "playback-rotatable",
  templateUrl: "./rotatable.component.html",
  providers: [PlaybackService],
})
export class PlaybackRotatableComponent implements AfterViewInit {
  id = "rotatable"
  @ViewChild("videoContainer") videoContainer: { nativeElement: HTMLDivElement }
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

    this.playbackService.playbackActions.createRotatablePlayback({
      container: this.videoContainer.nativeElement,
    })
  }

  rotate() {
    this.playbackService.playbackActions.rotate()
  }

  jumpTo(time: number) {
    this.playbackService.playbackActions.setCurrentTime(time)
  }

  togglePlayback() {
    this.playbackService.playbackActions.setPaused(!this.playbackState.paused)
  }
}
