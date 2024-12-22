"use client";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlaylistFormSchema, PlaylistFormSchemaType } from "@/lib/definitions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Monitor } from "lucide-react";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { collections, firestore } from "@/lib/firebase";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { Playlist } from "@/types/playlist";

export default function PlaylistForm({
  defaultValues,
}: {
  defaultValues?: Playlist;
}) {
  const form = useForm<PlaylistFormSchemaType>({
    resolver: zodResolver(PlaylistFormSchema),
    defaultValues,
  });

  const [loading, startSubmitTransition] = useTransition();
  const router = useRouter();

  return (
    <div className="mx-auto  py-12 max-lg:px-4 text-xl max-w-screen-sm">
      <h2 className="flex items-center gap-2">
        <Monitor />
        <>{defaultValues ? "Edit" : "Add new"}</> Screen
      </h2>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            startSubmitTransition(async () => {
              const colRef = collection(firestore, collections.playlists);
              const q = query(colRef, where("name", "==", data.name));
              const docs = (await getDocs(q)).docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
              }));

              const isSameDoc =
                defaultValues && defaultValues.id === docs[0].id;

              if (docs.length > 0 && !isSameDoc) {
                form.setError("name", {
                  message: "screen with same name already exists",
                });
                return;
              }

              if (defaultValues) {
                await updateDoc(doc(colRef, defaultValues.id), {
                  ...data,
                  updatedAt: serverTimestamp(),
                });
              } else {
                await setDoc(doc(colRef), {
                  ...data,
                  createdAt: serverTimestamp(),
                  updatedAt: serverTimestamp(),
                });
              }

              router.push(ROUTES.admin);
            });
          })}
          className="mt-6 max-w-xl space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Screen Name</FormLabel>
                  <Input placeholder="type screen name" {...field} />
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Description (optional)</FormLabel>
                  <Textarea placeholder="Add short description" {...field} />
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div>
            <Button className="float-right" type="submit" disabled={loading}>
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
