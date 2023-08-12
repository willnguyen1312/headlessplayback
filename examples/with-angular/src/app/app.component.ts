import { Component } from "@angular/core"
import { PlaybackService } from "@headlessplayback/angular"

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  providers: [PlaybackService],
})
export class AppComponent {
  constructor(private playbackService: PlaybackService) {}
}
