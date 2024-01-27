/* eslint-disable @typescript-eslint/no-explicit-any */
import { Plugin } from "@headlessplayback/core"
import { flushPromises } from "@namnode/utils"
import Hls, { HlsConfig } from "hls.js"

type LoadFunction = (arg: { source: string }) => void
type SetCurrentLevel = (arg: { level: number }) => void
type SetSubtitleTrack = (arg: { subtitleTrack: number }) => void
type SetAudioTrack = (arg: { audioTrack: number }) => void

export type HlsStatus = "loading" | "recovering" | "error"

export type ErrorDetails =
  | "keySystemNoKeys"
  | "keySystemNoAccess"
  | "keySystemNoSession"
  | "keySystemNoConfiguredLicense"
  | "keySystemLicenseRequestFailed"
  | "keySystemServerCertificateRequestFailed"
  | "keySystemServerCertificateUpdateFailed"
  | "keySystemSessionUpdateFailed"
  | "keySystemStatusOutputRestricted"
  | "keySystemStatusInternalError"
  | "manifestLoadError"
  | "manifestLoadTimeOut"
  | "manifestParsingError"
  | "manifestIncompatibleCodecsError"
  | "levelEmptyError"
  | "levelLoadError"
  | "levelLoadTimeOut"
  | "levelParsingError"
  | "levelSwitchError"
  | "audioTrackLoadError"
  | "audioTrackLoadTimeOut"
  | "subtitleTrackLoadError"
  | "subtitleTrackLoadTimeOut"
  | "fragLoadError"
  | "fragLoadTimeOut"
  | "fragDecryptError"
  | "fragParsingError"
  | "fragGap"
  | "remuxAllocError"
  | "keyLoadError"
  | "keyLoadTimeOut"
  | "bufferAddCodecError"
  | "bufferIncompatibleCodecsError"
  | "bufferAppendError"
  | "bufferAppendingError"
  | "bufferStalledError"
  | "bufferFullError"
  | "bufferSeekOverHole"
  | "bufferNudgeOnStall"
  | "internalException"
  | "aborted"
  | "unknown"

export interface Level {
  bitrate: number
  width: number
  height: number
  id: number
}

export interface SubtitleTrack {
  id: number
  lang?: string
}

export interface AudioTrack {
  id: number
  lang?: string
  name: string
}

interface _CustomPlaybackState {
  levels: Level[]
  currentLevel: number
  subtitleTracks: SubtitleTrack[]
  subtitleTrack: number
  audioTracks: AudioTrack[]
  audioTrack: number
  hlsStatus: HlsStatus
  errorDetail: ErrorDetails | null
}

declare module "@headlessplayback/core" {
  export interface CustomPlaybackState extends _CustomPlaybackState {}

  export interface CustomPlaybackActions {
    loadHlsSource: LoadFunction
    setCurrentLevel: SetCurrentLevel
    setSubtitleTrack: SetSubtitleTrack
    setAudioTrack: SetAudioTrack
  }
}

const activeHlsMap = new Map<string, Hls>()
const activeIdSourceMap = new Map<string, string>()

const createDefaultState = (): _CustomPlaybackState => {
  return {
    levels: [],
    currentLevel: -1,
    subtitleTracks: [],
    subtitleTrack: -1,
    audioTracks: [],
    audioTrack: -1,
    hlsStatus: "loading",
    errorDetail: null,
  }
}

export const hlsPlaybackPlugin: Plugin<Partial<HlsConfig>> = {
  install({ store, onCleanup }, config) {
    store.setState(createDefaultState())

    const loadHlsSource: any = async ({
      id,
      source,
    }: {
      id: string
      source: string
    }) => {
      await flushPromises()

      if (activeIdSourceMap.get(id) === source) {
        return
      }

      const playbackElement = document.getElementById(id) as HTMLVideoElement

      if (!Hls.isSupported()) {
        playbackElement &&
          playbackElement.canPlayType("application/vnd.apple.mpegurl") &&
          playbackElement.src === source

        return
      }

      let hls = activeHlsMap.get(id)
      store.setState(createDefaultState())

      if (hls) {
        hls.destroy()
        hls = new Hls(config)
        activeHlsMap.set(id, hls)
      } else {
        hls = new Hls(config)
        activeHlsMap.set(id, hls)
        onCleanup(id, () => {
          activeHlsMap.get(id)?.destroy()
          activeHlsMap.delete(id)
          activeIdSourceMap.delete(id)
        })
      }

      hls.attachMedia(playbackElement)

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls?.loadSource(source)
      })

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        store.setState({
          levels: data.levels.map((level) => ({
            bitrate: level.bitrate,
            width: level.width,
            height: level.height,
            id: level.id,
          })),
        })
      })

      hls.on(Hls.Events.LEVEL_SWITCHING, (_, { level }) => {
        store.setState({
          currentLevel: level,
        })
      })

      hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, (_, data) => {
        store.setState({
          subtitleTracks: data.subtitleTracks.map((track) => ({
            id: track.id,
            lang: track.lang,
          })),
        })
      })

      hls.on(Hls.Events.SUBTITLE_TRACK_SWITCH, (_, data) => {
        store.setState({
          subtitleTrack: data.id,
        })
      })

      hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, (_, data) => {
        store.setState({
          audioTracks: data.audioTracks.map((track) => ({
            id: track.id,
            lang: track.lang,
            name: track.name,
          })),
        })
      })

      hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, (_, data) => {
        store.setState({
          audioTrack: data.id,
        })
      })

      // Credit to https://github.com/mlapps/videoplayer-hls-example
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (hls) {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.MEDIA_ERROR:
                switch (data.details) {
                  case Hls.ErrorDetails.MANIFEST_INCOMPATIBLE_CODECS_ERROR:
                    hls.destroy()
                    store.setState({
                      hlsStatus: "error",
                      errorDetail: data.details,
                    })
                    break
                  default:
                    hls.recoverMediaError()
                    store.setState({
                      hlsStatus: "recovering",
                    })
                    break
                }
                break

              case Hls.ErrorTypes.NETWORK_ERROR:
                switch (data.details) {
                  case Hls.ErrorDetails.FRAG_LOAD_ERROR:
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    hls.currentLevel =
                      data.frag!.start + data.frag!.duration + 0.1
                    break

                  case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
                    hls.destroy()
                    store.setState({
                      hlsStatus: "error",
                      errorDetail: data.details,
                    })
                    break

                  default:
                    hls.startLoad()
                    store.setState({
                      hlsStatus: "recovering",
                    })
                    break
                }
                break

              default:
                hls.destroy()
                store.setState({
                  hlsStatus: "error",
                  errorDetail: data.details,
                })
                break
            }
          } else {
            switch (data.details) {
              // HLS will try to loadHlsSource the next segment when encounter this error
              // so we can safely consume it as loading state
              case Hls.ErrorDetails.BUFFER_STALLED_ERROR:
                store.setState({
                  hlsStatus: "loading",
                })
                break
            }
          }
        }
      })

      activeIdSourceMap.set(id, source)
    }

    const setCurrentLevel: any = ({
      id,
      level,
    }: {
      id: string
      level: number
    }) => {
      const hls = activeHlsMap.get(id)
      if (hls && hls.currentLevel !== level) {
        hls.currentLevel = level
      }
    }

    const setSubtitleTrack: any = ({
      id,
      track,
    }: {
      id: string
      track: number
    }) => {
      const hls = activeHlsMap.get(id)
      if (hls && hls.subtitleTrack !== track) {
        hls.subtitleTrack = track
      }
    }

    const setAudioTrack: any = ({
      id,
      track,
    }: {
      id: string
      track: number
    }) => {
      const hls = activeHlsMap.get(id)
      if (hls && hls.audioTrack !== track) {
        hls.audioTrack = track
      }
    }

    return {
      loadHlsSource,
      setCurrentLevel,
      setSubtitleTrack,
      setAudioTrack,
    }
  },
}
