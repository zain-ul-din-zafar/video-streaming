"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { collections, firestore } from "@/lib/firebase";
import { collection, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import {
  EditIcon,
  EllipsisVertical,
  Monitor,
  MonitorX,
  Settings,
  TrashIcon,
} from "lucide-react";
import { useCollection } from "react-firebase-hooks/firestore";
import { ROUTES } from "../../../lib/constants";
import { Playlist } from "@/types/playlist";
import Link from "next/link";
import Loader from "@/components/shared/loader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AreYouSure from "@/components/shared/are-you-sure";
import { RefObject, useRef, useState, useTransition } from "react";

export default function Admin() {
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

  const deleteBtnRef = useRef<HTMLDivElement>(null);
  const [deleteTarget, setDeleteTarget] = useState<
    (typeof playlists)[0] | null
  >(null);
  const [pendingDeletion, startDeleteTransition] = useTransition();

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

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h2 className="my-4 text-xl font-medium">TV Screens</h2>

      <AreYouSure
        onClick={() => {
          if (!deleteTarget) return;
          startDeleteTransition(async () => {
            await deleteDoc(
              doc(collection(firestore, collections.playlists), deleteTarget.id)
            );
          });
        }}
        isLoading={pendingDeletion}
        ref={deleteBtnRef as RefObject<HTMLButtonElement | null>}
      />

      <div className="grid  sm:grid-cols-2 lg:grid-cols-3  gap-4">
        {playlists.map((playlist, i) => {
          return (
            <Card key={i} className="break-inside-avoid">
              <CardHeader className="space-y-4">
                <CardTitle className="flex gap-2 items-center">
                  <Monitor />
                  {playlist.name}

                  <DropdownMenu>
                    <DropdownMenuTrigger className="ml-auto">
                      <EllipsisVertical />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <Link href={`${ROUTES.screenDetails}/${playlist.id}`}>
                        <DropdownMenuItem>
                          <Settings />
                          Manage
                        </DropdownMenuItem>
                      </Link>
                      <Link
                        href={`${ROUTES.screenDetails}/${playlist.id}/edit`}
                      >
                        <DropdownMenuItem>
                          <EditIcon />
                          Edit
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        onClick={() => {
                          setDeleteTarget(playlist);
                          deleteBtnRef.current?.click();
                        }}
                        // ref={deleteBtnRef}
                        className="text-red-500 focus:text-red-400"
                      >
                        <TrashIcon />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardTitle>
                <CardDescription className="line-clamp-4">
                  {playlist.description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
