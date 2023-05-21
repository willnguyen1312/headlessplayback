import { usePlayback } from "@headlessplayback/react"
import { useEffect } from "react"

function Duration() {
  const { playbackState } = usePlayback({
    id: "video",
  })

  return <p>Duration: {playbackState.duration}</p>
}

function CurrenTime() {
  const { playbackState } = usePlayback({
    id: "video",
  })

  return <p>Current time: {playbackState.currentTime}</p>
}

function App1() {
  const { activate } = usePlayback({
    id: "video",
  })

  useEffect(() => {
    activate()
  }, [])

  function handleClick() {
    ;(document.getElementById("video") as HTMLMediaElement)!.src =
      "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
  }

  return (
    <div id="app" className="p-4">
      <div className="border-emerald border-1 h-[400px] w-[600px]">
        <video
          className="h-full w-full"
          id="video"
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
          controls
        ></video>
      </div>

      <CurrenTime />
      <Duration />
      <button onClick={handleClick}>Switch stream</button>
    </div>
  )
}

export default App1
