/* eslint-disable @next/next/no-img-element */
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Button } from "./ui/button";
import { collection, deleteField, doc, updateDoc } from "firebase/firestore";
import { collections, firestore } from "@/lib/firebase";
import { GripVertical, Loader, TrashIcon } from "lucide-react";

const ItemType = "VIDEO";

export function DraggableVideo({ video, index, moveVideo, moving }: any) {
  const ref = useRef(null);

  const [, drop] = useDrop({
    accept: ItemType,
    hover(item: any) {
      if (!ref.current || moving) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveVideo(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`flex bg-card border gap-4 p-1 items-center rounded-sm ${
        isDragging ? "opacity-50" : ""
      }`}
      style={{ cursor: "move" }}
    >
      <img
        src={video.pictures.base_link}
        alt={video.name}
        className="rounded-md object-cover"
        width={150}
        height={150}
      />
      <h3>{video.name}</h3>

      <div className="ml-auto flex items-center gap-2">
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => {
            updateDoc(
              doc(collection(firestore, collections.playlists), video.id),
              {
                [`videos.${video.slug}`]: deleteField()
              }
            );
          }}
        >
          <TrashIcon className="text-red-400" />
        </Button>
        <Button size={"icon"} variant={"ghost"}>
          {moving ? <Loader className="animate-spin" /> : <GripVertical />}
        </Button>
      </div>
    </div>
  );
}
