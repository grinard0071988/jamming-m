import React, { useState } from "react";
import { SearchBar } from "./components/SearchBar";
import { Playlist } from "./components/Playlist";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { login, logout, useSpotifyAuth } from "./uti/spotify_config";
import BgImage from "./assets/jam_bg_2.jpg";
import BgImage_2 from "./assets/jam_bg.jpg";

export default function App() {
  const { user, accessToken, error } = useSpotifyAuth();
  const [playlistTracks, setPlaylistTracks] = useState([]);

  return (
    <div
      style={{ backgroundImage: `url(${BgImage})`, backgroundSize: "cover" }}
      className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6"
    >
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold">Jammming</h1>
          {user ? (
            <div className="flex items-center gap-2">
              <img
                src={user.images?.[0]?.url}
                className="w-10 h-10 rounded-full"
              />
              <span>{user.display_name}</span>
              <Button variant="secondary" onClick={logout}>
                <LogOut className="w-4 h-4 mr-1" /> Log out
              </Button>
            </div>
          ) : (
            <Button onClick={login}>
              <LogIn className="w-4 h-4 mr-1" /> Log in with Spotify to add your
              Playlists
            </Button>
          )}
        </header>

        {error && (
          <div className="p-3 bg-red-100 text-red-600 rounded">{error}</div>
        )}

        <main className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.section
            style={{
              backgroundImage: `url(${BgImage_2})`,
              color: "#eef2ff",
            }}
            layout
            className="md:col-span-2 bg-white rounded-xl shadow p-4"
          >
            <SearchBar
              accessToken={accessToken}
              setPlaylistTracks={setPlaylistTracks}
              playlistTracks={playlistTracks}
            />
          </motion.section>

          <motion.aside
            style={{
              backgroundImage: `url(${BgImage_2})`,
              color: "#eef2ff",
            }}
            layout
            className="bg-white rounded-xl shadow p-4"
          >
            <Playlist
              playlistTracks={playlistTracks}
              setPlaylistTracks={setPlaylistTracks}
              accessToken={accessToken}
              user={user}
            />
          </motion.aside>
        </main>
      </div>
      <footer
        style={{ color: "black" }}
        className="mt-8 text-center text-sm text-gray-500"
      >
        Built with ❤️ by SIBA — Jammming
      </footer>
    </div>
  );
}
