import { useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";

const videoSources = [
  "1041721365", // Vimeo video ID 2
  "1041702452" // Vimeo video ID 1
];

export default function VideoPlayer() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const player = new Player(ref.current);

    // Function to switch to the next video
    const handleVideoEnd = () => {
      setCurrentVideoIndex(
        (prevIndex) => (prevIndex + 1) % videoSources.length
      );
    };

    // Listen for the video end event
    player.on("ended", handleVideoEnd);

    return () => {
      player.off("ended", handleVideoEnd); // Clean up the event listener
    };
  }, [ref]);

  useEffect(() => {
    if (!ref.current) return;
    const player = new Player(ref.current);

    // Load the next video when the index changes
    player.loadVideo(videoSources[currentVideoIndex]).catch((error: Error) => {
      console.error("Error loading video:", error);
    });
  }, [currentVideoIndex, ref]);

  return (
    <div className="fixed inset-0 bg-background w-[100svw] h-[100svh]">
      <iframe
        ref={ref}
        src={`https://player.vimeo.com/video/${videoSources[currentVideoIndex]}?autoplay=1&muted=1&controls=0`}
        className="w-full h-full"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        style={{
          overflow: "hidden",
          height: "100%",
          width: "100%"
        }}
        title="Vimeo Video"
      ></iframe>
    </div>
  );

  return (
    <video
      className="fixed inset-0 w-[100svw] h-[100svh] object-cover"
      id="myVideo"
      autoPlay
      muted
      loop
    >
      <source
        src="https://player.vimeo.com/video/1041702452"
        type="video/mp4"
      />
      Your browser does not support the video tag.
    </video>
  );
}
