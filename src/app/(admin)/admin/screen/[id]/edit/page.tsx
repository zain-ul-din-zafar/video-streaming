"use client";

import PlaylistForm from "@/components/forms/playlist";
import Loader from "@/components/shared/loader";
import { collections, firestore } from "@/lib/firebase";
import { Playlist } from "@/types/playlist";
import { collection, doc } from "firebase/firestore";
import { notFound, useParams } from "next/navigation";
import { useDocument } from "react-firebase-hooks/firestore";

export default function ScreenEditPage() {
  const { id } = useParams();

  const [data, loading] = useDocument(
    doc(collection(firestore, collections.playlists), id as string)
  );

  if (loading) return <Loader />;

  if (!data?.exists || !data.data()) return notFound();

  const playlist = { id, ...data?.data() } as Playlist;

  return <PlaylistForm defaultValues={playlist} />;
}
