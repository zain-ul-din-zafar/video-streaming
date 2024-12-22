"use client";

import PlaylistForm from "@/components/forms/playlist";
import Loader from "@/components/shared/loader";
import { collections, firestore } from "@/lib/firebase";
import { Playlist } from "@/types/playlist";
import { collection, doc } from "firebase/firestore";
import { notFound } from "next/navigation";
import { useDocument } from "react-firebase-hooks/firestore";

export default function ScreenEditPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [data, loading] = useDocument(
    doc(collection(firestore, collections.playlists), id)
  );

  if (loading) return <Loader />;

  if (!data?.exists || !data.data()) return notFound();

  const playlist = { id, ...data?.data() } as Playlist;

  return <PlaylistForm defaultValues={playlist} />;
}
