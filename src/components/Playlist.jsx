import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { TrackItem } from "./TrackItem";
import { spotifyFetch } from "../uti/spotify_config";

export function Playlist({
  playlistTracks,
  setPlaylistTracks,
  accessToken,
  user,
}) {
  const [name, setName] = useState("New Jammming Playlist");

  async function savePlaylist() {
    if (!user || !accessToken || playlistTracks.length === 0) return;
    try {
      const created = await spotifyFetch(
        `/users/${user.id}/playlists`,
        accessToken,
        {
          method: "POST",
          body: JSON.stringify({ name, public: false }),
        }
      );
      const uris = playlistTracks.map((t) => t.uri);
      await spotifyFetch(`/playlists/${created.id}/tracks`, accessToken, {
        method: "POST",
        body: JSON.stringify({ uris }),
      });
      alert("Playlist saved to Spotify!");
      setPlaylistTracks([]);
      setName("New Jammming Playlist");
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div>
      <input
        className="w-full border rounded p-2 mb-3"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <div className="space-y-2 max-h-64 overflow-auto mb-4">
        {playlistTracks.length === 0 && (
          <p className="text-sm text-gray-400">No tracks yet</p>
        )}
        {playlistTracks.map((track) => (
          <TrackItem
            key={track.id}
            track={track}
            onRemove={(t) =>
              setPlaylistTracks((prev) => prev.filter((p) => p.id !== t.id))
            }
            isInPlaylist
          />
        ))}
      </div>
      <Button onClick={savePlaylist}>
        <Save className="w-4 h-4 mr-1" /> Save Playlist
      </Button>
    </div>
  );
}
