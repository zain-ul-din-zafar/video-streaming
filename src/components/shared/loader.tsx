import { Loader as LoaderIcon } from "lucide-react";

export default function Loader() {
  return (
    <div className="w-full h-[100svh] transition-all flex flex-col z-10 fixed inset-0 bg-foreground/5">
      <LoaderIcon className="animate-spin m-auto w-8 h-8" />
    </div>
  );
}
