"use client";

import Loader from "@/components/shared/loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import VideoPlayer from "@/components/video-player";
import { ROUTES } from "@/lib/constants";
import { collections, firestore } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import { Playlist } from "@/types/playlist";
import { collection, orderBy, query } from "firebase/firestore";
import { Monitor, MonitorX } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";

export default function Home() {
  const [data, loading] = useCollection(
    query(
      collection(firestore, collections.playlists),
      orderBy("updatedAt", "desc")
    )
  );

  const playlists = data?.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  })) as Playlist[];

  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [play, setPlay] = useState<boolean>(false);

  useEffect(() => {
    if (!playlists) return;

    const onKeyPress = (ev: KeyboardEvent) => {
      const key = ev.key;
      if (key === "ArrowUp" || key === "ArrowRight")
        setActiveIdx((val) => (val + 1) % playlists.length);
      else if (key === "ArrowDown" || key === "ArrowLeft")
        setActiveIdx((val) => (val - 1 < 0 ? playlists.length - 1 : val - 1));

      if (key === "Enter") {
        document.documentElement.requestFullscreen();
        setPlay((val) => !val);
      }

      if (key === "Escape") {
        setPlay(false);
      }
    };

    window.addEventListener("keydown", onKeyPress);

    return () => window.removeEventListener("keydown", onKeyPress);
  }, [playlists]);

  if (loading) return <Loader />;

  if (!playlists || playlists.length === 0) {
    return (
      <div className="min-h-[90svh] flex justify-center items-center flex-col gap-6">
        <div className="flex flex-col justify-center items-center gap-2">
          <MonitorX className="w-16 h-16" />
          <h2 className="font-medium text-muted-foreground">
            No Screen found!
          </h2>
        </div>
        <Link href={ROUTES.newScreen}>
          <Button size={"sm"}>Add new screen</Button>
        </Link>
      </div>
    );
  }

  if (play) return <VideoPlayer />;

  return (
    <>
      <div className="max-w-screen-xl mx-auto p-4 py-6">
        <div className="grid  sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {playlists.map((playlist, i) => {
            return (
              <Card
                key={i}
                className={cn(
                  "break-inside-avoid cursor-pointer",
                  i == activeIdx && "border-primary/80 border-2"
                )}
                onClick={() => {
                  setActiveIdx(i);
                  document.documentElement.requestFullscreen();
                  setPlay(true);
                }}
              >
                <CardHeader className="space-y-4">
                  <CardTitle className="flex gap-2 items-center">
                    <Monitor />
                    {playlist.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-4">
                    {playlist.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div className="mt-24">
          <p className="text-center font-mono text-sm text-muted-foreground">
            Press <Badge>⬆/⬇</Badge> arrows to switch. <Badge> Enter</Badge> to
            play/exit video.
          </p>
        </div>
      </div>
    </>
  );
}
