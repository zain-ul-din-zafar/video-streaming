import { z } from "zod";

export const PlaylistFormSchema = z.object({
  name: z.string().min(1, { message: "name is required field" }),
  description: z.string().optional(),
});

export type PlaylistFormSchemaType = z.infer<typeof PlaylistFormSchema>;
