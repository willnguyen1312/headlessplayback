import { AfterViewInit, Component } from "@angular/core"
import { PlaybackService, PlaybackState } from "@headlessplayback/angular"

@Component({
  selector: "playback-normal",
  templateUrl: "./normal.component.html",
  providers: [PlaybackService],
})
export class PlaybackNormalComponent implements AfterViewInit {
  id = "normal"
  playbackState: PlaybackState

  constructor(private playbackService: PlaybackService) {
    this.playbackService.usePlayback({ id: this.id })
    this.playbackState = this.playbackService.playbackState
  }

  ngAfterViewInit(): void {
    this.playbackService.activate()
    this.playbackService.playbackState$.subscribe((state) => {
      this.playbackState = state
    })
  }

  jumpTo(time: number) {
    this.playbackService.playbackActions.setCurrentTime(time)
  }
}
