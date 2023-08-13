import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"

import { AppComponent } from "./app.component"
import { PlaybackNormalComponent } from "./normal.component"

@NgModule({
  declarations: [AppComponent, PlaybackNormalComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
