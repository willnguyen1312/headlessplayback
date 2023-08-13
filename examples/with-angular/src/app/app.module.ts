import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"

import { AppComponent } from "./app.component"
import { PlaybackDashComponent } from "./dash.component"
import { PlaybackHijackComponent } from "./hijack.component"
import { PlaybackHlsComponent } from "./hls.component"
import { PlaybackNormalComponent } from "./normal.component"

@NgModule({
  declarations: [
    AppComponent,
    PlaybackNormalComponent,
    PlaybackHlsComponent,
    PlaybackDashComponent,
    PlaybackHijackComponent,
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
