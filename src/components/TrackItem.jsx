import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

export function TrackItem({ track, onAdd, onRemove, isInPlaylist }) {
  return (
    <div className="flex items-center justify-between p-2 border rounded">
      <div className="flex items-center gap-3">
        <img
          src={track.album?.images?.[2]?.url}
          className="w-12 h-12 rounded"
        />
        <div>
          <div className="font-medium">{track.name}</div>
          <div className="text-sm text-gray-500">
            {track.artists.map((a) => a.name).join(", ")}
          </div>
        </div>
      </div>
      <div>
        {isInPlaylist ? (
          <Button variant="destructive" onClick={() => onRemove?.(track)}>
            <Minus className="w-4 h-4 mr-1" /> Remove
          </Button>
        ) : (
          <Button onClick={() => onAdd(track)}>
            <Plus className="w-4 h-4 mr-1" /> Add
          </Button>
        )}
      </div>
    </div>
  );
}
