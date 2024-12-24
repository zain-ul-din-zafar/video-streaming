/* eslint-disable @next/next/no-img-element */
"use client";
import Loader from "@/components/shared/loader";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { collections, firestore } from "@/lib/firebase";
import { Playlist } from "@/types/playlist";
import { collection, deleteField, doc, updateDoc } from "firebase/firestore";
import { notFound, useParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import urlSlug from "url-slug";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DraggableVideo } from "@/components/drag-able-video";
import { useQuery } from "@tanstack/react-query";
import { fetchVimeoVideos } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { TriangleAlert, UploadCloud } from "lucide-react";
import Link from "next/link";

export default function ScreenDetails() {
  const { id } = useParams();
  const [videos, setVideos] = useState<any[]>([]);
  const [data, loading] = useDocument(
    doc(collection(firestore, collections.playlists), id as string)
  );

  const [moving, startMovingTransition] = useTransition();

  const query = useQuery<any>({
    initialData: [],
    queryFn: fetchVimeoVideos,
    queryKey: ["vimeo"]
  });

  useEffect(() => {
    setVideos(query.data);
  }, [query.data]);

  const toggleVideo = useCallback(
    (checked: boolean, video: any) => {
      const slug = urlSlug(video.uri);

      updateDoc(
        doc(collection(firestore, collections.playlists), id as string),
        {
          [`videos.${slug}`]: checked
            ? {
                ...video,
                slug
              }
            : deleteField()
        }
      );
    },
    [id]
  );

  if (loading || query.isLoading) return <Loader />;
  if (!data?.exists || !data.data()) return notFound();

  const playlist = { id, ...data?.data() } as Playlist;

  const moveVideo = (fromIndex: number, toIndex: number) => {
    if (moving) return;
    const playlistVideos = Object.entries(playlist.videos || {});

    const updatedVideos = [...playlistVideos];
    const [movedVideo] = updatedVideos.splice(fromIndex, 1);
    updatedVideos.splice(toIndex, 0, movedVideo);

    const backToObj = Object.fromEntries(
      updatedVideos.map(([k, v], i) => [k, { ...v, order: i }])
    );

    startMovingTransition(async () => {
      await updateDoc(
        doc(collection(firestore, collections.playlists), id as string),
        {
          videos: backToObj
        }
      );
    });
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-10 max-w-screen-xl gap-4 mx-auto p-4">
        <div className="flex col-span-full border-b mb-2 pb-2 items-center">
          <h2 className="text-lg font-medium">
            Manage Videos for {playlist.name}
          </h2>
          <Link href={"https://vimeo.com/"} target="_blank" className="ml-auto">
            <Button variant={"secondary"}>
              {" "}
              <UploadCloud /> Upload New Videos
            </Button>
          </Link>
        </div>
        <div className="col-span-3 flex flex-col gap-4 overflow-y-auto max-h-[100svh] bg-secondary/50 border p-4 rounded-sm">
          <h2 className="text-center text-xl">Video Gallery</h2>
          {videos.map((video, i) => {
            const slug = urlSlug(video.uri);

            return (
              <Card key={i}>
                <CardHeader className="p-4">
                  <img
                    src={video.pictures.base_link}
                    alt={video.name}
                    className="rounded-md mb-4 w-full object-cover"
                    width={200}
                    height={150}
                  />
                  <CardTitle className="text-lg flex items-center font-medium">
                    {video.name}

                    <Checkbox
                      className="ml-auto"
                      onCheckedChange={(checked) => {
                        toggleVideo(Boolean(checked), video);
                      }}
                      checked={Boolean(
                        playlist.videos && playlist.videos[slug]
                      )}
                    />
                  </CardTitle>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div className="col-span-7 overflow-y-auto max-h-[100svh]">
          <h2 className="mb-6 font-medium">
            Videos that will be displayed on the main screen.
          </h2>
          <div className="flex flex-col gap-2">
            {(!playlist.videos ||
              Object.values(playlist.videos).length === 0) && (
              <p className="p-4 py-6 bg-accent/50 rounded-sm flex justify-center gap-2 border text-center">
                <TriangleAlert />
                No videos added yet.
              </p>
            )}
            {playlist.videos &&
              Object.values(playlist.videos)
                .sort((a, b) => {
                  return a.order - b.order;
                })
                .map((video: any, i: number) => {
                  return (
                    <DraggableVideo
                      key={i}
                      index={i}
                      video={video}
                      moveVideo={moveVideo}
                      moving={moving}
                      docId={playlist.id}
                    />
                  );
                })}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
