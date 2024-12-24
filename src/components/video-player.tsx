import { useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";
import { Playlist } from "@/types/playlist";
import { MonitorX } from "lucide-react";

export default function VideoPlayer({ playlist }: { playlist: Playlist }) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [videoIds, setVideoIds] = useState<string[]>([]);

  useEffect(() => {
    setCurrentVideoIndex(0);
    setVideoIds(
      Object.values(playlist.videos || {})
        .sort((a, b) => a.order - b.order)
        .map((video) => video.link.split("/").at(-1))
    );
  }, [playlist]);

  useEffect(() => {
    if (!ref.current) return;

    const player = new Player(ref.current);

    player.on("error", () => {
      setCurrentVideoIndex(0);
    });

    player.setLoop(videoIds.length == 1);

    const handleVideoEnd = () => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videoIds.length);
    };

    player.on("ended", handleVideoEnd);

    return () => {
      player.off("ended", handleVideoEnd);
    };
  }, [ref, videoIds]);

  useEffect(() => {
    if (!ref.current) return;
    const player = new Player(ref.current);

    // Load the next video when the index changes
    player.loadVideo(videoIds[currentVideoIndex]).catch((error: Error) => {
      console.error("Error loading video:", error);
    });
  }, [ref, videoIds, currentVideoIndex]);

  return (
    <div className="fixed inset-0 bg-background w-[100svw] h-[100svh]">
      {videoIds.length === 0 ? (
        <>
          <div className="flex items-center justify-center h-full">
            <MonitorX size={64} />
            <p className="text-lg ml-4">No videos found</p>
          </div>
        </>
      ) : (
        <>
          <iframe
            ref={ref}
            src={`https://player.vimeo.com/video/${videoIds[currentVideoIndex]}?autoplay=1&muted=1&controls=0`}
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
        </>
      )}
    </div>
  );
}
