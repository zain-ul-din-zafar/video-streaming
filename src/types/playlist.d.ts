import { PlaylistFormSchemaType } from "@/lib/definitions";

export interface Playlist extends PlaylistFormSchemaType {
  id: string;
  createdAt: string;
  updatedAt: string;
  videos?: {
    [key: string]: any;
  };
}
