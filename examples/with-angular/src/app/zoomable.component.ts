import { AfterViewInit, Component, ViewChild } from "@angular/core"
import { PlaybackService, PlaybackState } from "@headlessplayback/angular"
import { zoomablePlaybackPlugin } from "@headlessplayback/zoomable-plugin"
import { sleep } from "./helper"

PlaybackService.use(zoomablePlaybackPlugin)

@Component({
  selector: "playback-zoomable",
  templateUrl: "./zoomable.component.html",
  providers: [PlaybackService],
})
export class PlaybackZoomableComponent implements AfterViewInit {
  id = "zoomable"
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

    this.playbackService.playbackActions.createZoomablePlayback({
      container: this.videoContainer.nativeElement,
    })

    this.playbackService.playbackActions.setEnableZoom({
      enableZoom: true,
    })
  }

  jumpTo(time: number) {
    this.playbackService.playbackActions.setCurrentTime(time)
  }

  togglePlayback() {
    this.playbackService.playbackActions.setPaused(!this.playbackState.paused)
  }
}
