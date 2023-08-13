import { AfterViewInit, Component } from "@angular/core"
import { PlaybackService, PlaybackState } from "@headlessplayback/angular"
import { dashPlaybackPlugin } from "@headlessplayback/dash-plugin"
import { sleep } from "./helper"
PlaybackService.use(dashPlaybackPlugin)

const source1 = "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd"
const source2 =
  "https://rdmedia.bbc.co.uk/elephants_dream/1/client_manifest-all.mpd"

@Component({
  selector: "playback-dash",
  templateUrl: "./dash.component.html",
  providers: [PlaybackService],
})
export class PlaybackDashComponent implements AfterViewInit {
  id = "dash"
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
    this.playbackService.playbackActions.loadDashSource({
      source: this.source,
    })
  }

  switchStream() {
    this.source = this.source === source1 ? source2 : source1
    this.playbackService.playbackActions.loadDashSource({
      source: this.source,
    })
  }

  jumpTo(time: number) {
    this.playbackService.playbackActions.setCurrentTime(time)
  }

  getBitrateInfo() {
    return this.playbackState.bitrateInfo
      .map((level) => level.height)
      .join(", ")
  }
}
