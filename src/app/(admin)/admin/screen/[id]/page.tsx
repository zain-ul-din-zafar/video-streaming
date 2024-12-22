"use client";
export default function ScreenDetails({ params }: { params: { id: string } }) {
  const { id } = params;

  return <div className="max-w-screen-xl p-4 mx-auto">{id}</div>;
}
