import { Injectable, OnDestroy } from "@angular/core"
import {
  PlaybackActions,
  PlaybackState,
  PluginFunc,
  createPlayback,
} from "@headlessplayback/core"
import { BehaviorSubject, Observable } from "rxjs"

export { PlaybackState } from "@headlessplayback/core"

type CreatePlayback = typeof createPlayback

const playbackStateMaster = new Map<string, BehaviorSubject<PlaybackState>>()
const playbackInstanceMap = new Map<string, ReturnType<CreatePlayback>>()

@Injectable()
export class PlaybackService implements OnDestroy {
  static use: PluginFunc = createPlayback.use
  private arg?: Parameters<CreatePlayback>[0]

  get playbackState$() {
    return playbackStateMaster
      .get(this.arg!.id)
      ?.asObservable() as unknown as Observable<PlaybackState>
  }

  get playbackState() {
    return playbackStateMaster.get(this.arg!.id)?.value as PlaybackState
  }

  activate = () => {
    if (this.arg) {
      const playbackInstance = playbackInstanceMap.get(
        this.arg.id,
      ) as ReturnType<CreatePlayback>
      const isActivated = playbackInstance.activate()
      if (isActivated) {
        playbackInstance.onCleanup(() => {
          playbackStateMaster.delete(this.arg!.id)
          playbackInstanceMap.delete(this.arg!.id)
        })
      }
    }
  }

  get playbackActions() {
    if (this.arg) {
      return (
        playbackInstanceMap.get(this.arg!.id) as ReturnType<CreatePlayback>
      ).playbackActions
    }

    return {} as PlaybackActions
  }

  usePlayback = (arg: Parameters<CreatePlayback>[0]) => {
    this.arg = arg
    if (!playbackInstanceMap.has(arg.id)) {
      const playbackInstance = createPlayback(arg)
      playbackInstanceMap.set(arg.id, playbackInstance)

      const _playbackState = new BehaviorSubject<PlaybackState>(
        playbackInstance.getState(),
      )
      playbackStateMaster.set(arg.id, _playbackState)

      playbackInstance.subscribe(({ state }) => {
        _playbackState.next(state)
      })
    }
  }

  ngOnDestroy(): void {
    this.arg && playbackInstanceMap.get(this.arg.id)?.cleanup()
  }
}
