import { usePlayback } from "@headlessplayback/react"
import { useEffect } from "react"

type ShareProps = {
  id: string
}

function Duration({ id }: ShareProps) {
  const { playbackState } = usePlayback({
    id,
  })

  return <p>Duration: {playbackState.duration}</p>
}

function currentTime({ id }: ShareProps) {
  const { playbackState } = usePlayback({
    id,
  })

  return <p>Current time: {playbackState.currentTime}</p>
}

function VideoPlayer({ id }: ShareProps) {
  const { activate } = usePlayback({
    id,
  })

  useEffect(() => {
    activate()
  }, [])

  function handleClick() {
    ;(document.getElementById(id) as HTMLMediaElement)!.src =
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  }

  return (
    <div id="app" className="p-4">
      <div className="border-emerald border-1 h-[400px] w-[600px]">
        <video
          className="h-full w-full"
          id={id}
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          controls
        ></video>
      </div>

      <currentTime id={id} />
      <Duration id={id} />
      <button onClick={handleClick}>Switch stream</button>
    </div>
  )
}

function App1() {
  return (
    <div id="app" className="p-4">
      <VideoPlayer id="video1" />
      <VideoPlayer id="video2" />
    </div>
  )
}

export default App1
