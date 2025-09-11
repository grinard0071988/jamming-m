import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { TrackItem } from "./TrackItem";
import { motion } from "framer-motion";
import { spotifyFetch } from "../uti/spotify_config";

export function SearchBar({ accessToken, setPlaylistTracks, playlistTracks }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    const delay = setTimeout(() => doSearch(query), 400);
    return () => clearTimeout(delay);
  }, [query]);

  async function doSearch(q) {
    if (!accessToken) return;
    setLoading(true);
    try {
      const res = await spotifyFetch(
        `/search?q=${encodeURIComponent(q)}&type=track&limit=20`,
        accessToken
      );
      setResults(res.tracks.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function addTrack(track) {
    if (playlistTracks.find((t) => t.id === track.id)) return;
    setPlaylistTracks((prev) => [...prev, track]);
  }

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Search for songs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={() => doSearch(query)}>
          <Search className="w-4 h-4 mr-1" /> Search
        </Button>
      </div>
      {loading && <p className="text-sm text-gray-500">Searching...</p>}
      <div className="space-y-2">
        {results.map((track) => (
          <motion.div
            key={track.id}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <TrackItem
              track={track}
              onAdd={addTrack}
              isInPlaylist={!!playlistTracks.find((t) => t.id === track.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
