"use client";

import { useParams } from "next/navigation";

export default function ScreenDetails() {
  const { id } = useParams();

  console.log(id);

  return (
    <div className="max-w-screen-xl p-4 mx-auto">
      This screen allow you to set videos
    </div>
  );
}
