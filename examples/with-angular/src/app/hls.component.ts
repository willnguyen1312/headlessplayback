import { AfterViewInit, Component } from "@angular/core"
import { PlaybackService, PlaybackState } from "@headlessplayback/angular"
import { hlsPlaybackPlugin } from "@headlessplayback/hls-plugin"
import { sleep } from "./helper"
PlaybackService.use(hlsPlaybackPlugin)

const source1 =
  "https://storage.googleapis.com/shaka-demo-assets/angel-one-hls/hls.m3u8"
const source2 = "https://cdn.jwplayer.com/manifests/pZxWPRg4.m3u8"

@Component({
  selector: "playback-hls",
  templateUrl: "./hls.component.html",
  providers: [PlaybackService],
})
export class PlaybackHlsComponent implements AfterViewInit {
  id = "hls"
  source = source1
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
    this.playbackService.playbackActions.loadHlsSource({
      source: this.source,
    })
  }

  switchStream() {
    this.source = this.source === source1 ? source2 : source1
    this.playbackService.playbackActions.loadHlsSource({
      source: this.source,
    })
  }

  jumpTo(time: number) {
    this.playbackService.playbackActions.setCurrentTime(time)
  }

  getLevels() {
    return this.playbackState.levels.map((level) => level.height).join(", ")
  }
}
