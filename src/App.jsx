import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CLIENT_ID = "9307b19b8a844c5f9177cba8bee32517"; 
const REDIRECT_URI = "https://grinard0071988.github.io/jamming-m/";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "playlist-modify-public",
  "playlist-modify-private"
];

export default function SpotifyManager() {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");

  // Handle token
  useEffect(() => {
    const storedToken = localStorage.getItem("spotify_access_token");

    const hash = window.location.hash;
    if (!storedToken && hash) {
      const tokenFromUrl = hash
        .substring(1)
        .split("&")
        .find(elem => elem.startsWith("access_token"))
        ?.split("=")[1];

      if (tokenFromUrl) {
        localStorage.setItem("spotify_access_token", tokenFromUrl);
        setToken(tokenFromUrl);
      }
      window.location.hash = "";
    } else if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Fetch user profile
  useEffect(() => {
    if (token) {
      fetch("https://api.spotify.com/v1/me", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUser(data));
    }
  }, [token]);

  // Fetch user playlists
  useEffect(() => {
    if (token && user) {
      fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setPlaylists(data.items || []));
    }
  }, [token, user]);

  // Login
  const handleLogin = () => {
    const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(SCOPES.join(" "))}&response_type=${RESPONSE_TYPE}`;
    window.location.href = authUrl;
  };

  // Logout
  const handleLogout = () => {
    setToken("");
    setUser(null);
    setPlaylists([]);
    setSearchResults([]);
    localStorage.removeItem("spotify_access_token");
  };

  // Create playlist
  const handleCreatePlaylist = async () => {
    if (!newPlaylistName || !user) return;

    const res = await fetch(`https://api.spotify.com/v1/users/${user.id}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: newPlaylistName,
        description: "Created via My React Spotify App",
        public: false
      })
    });

    const newPlaylist = await res.json();
    setPlaylists([newPlaylist, ...playlists]);
    setNewPlaylistName("");
  };

  // Search tracks
  const handleSearch = async () => {
    if (!searchQuery) return;

    const res = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        searchQuery
      )}&type=track&limit=10`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await res.json();
    setSearchResults(data.tracks?.items || []);
  };

  // Add track to playlist
  const handleAddTrack = async trackUri => {
    if (!selectedPlaylist) {
      alert("Please select a playlist first.");
      return;
    }

    await fetch(
      `https://api.spotify.com/v1/playlists/${selectedPlaylist}/tracks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ uris: [trackUri] })
      }
    );

    alert("Track added to playlist! 🎵");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      {!token ? (
        <button
          onClick={handleLogin}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
        >
          Login with Spotify
        </button>
      ) : (
        <div className="w-full max-w-3xl">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-red-600"
          >
            Logout
          </button>

          {user && (
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold">Welcome, {user.display_name} 🎶</h2>
              <p>Email: {user.email}</p>
              {user.images?.length > 0 && (
                <img
                  src={user.images[0].url}
                  alt="User Avatar"
                  className="rounded-full w-32 h-32 mx-auto mt-4 shadow-lg"
                />
              )}
            </div>
          )}

          {/* Playlists */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">Your Playlists</h3>
            <ul className="space-y-2">
              {playlists.map(pl => (
                <li
                  key={pl.id}
                  onClick={() => setSelectedPlaylist(pl.id)}
                  className={`cursor-pointer p-3 rounded-lg flex items-center ${
                    selectedPlaylist === pl.id ? "bg-green-200" : "bg-gray-100"
                  }`}
                >
                  {pl.images?.length > 0 && (
                    <img
                      src={pl.images[0].url}
                      alt="Playlist"
                      className="w-12 h-12 rounded mr-3"
                    />
                  )}
                  <span>{pl.name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Create Playlist */}
          <div className="mt-6 mb-6">
            <h3 className="text-lg font-semibold mb-2">Create New Playlist</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Playlist name"
                value={newPlaylistName}
                onChange={e => setNewPlaylistName(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button
                onClick={handleCreatePlaylist}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
              >
                Create
              </button>
            </div>
          </div>

          {/* Search Songs */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Search Songs</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Search for a track..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="border p-2 rounded w-full"
              />
              <button
                onClick={handleSearch}
                className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600"
              >
                Search
              </button>
            </div>
            <ul className="space-y-3">
              {searchResults.map(track => (
                <li
                  key={track.id}
                  className="flex items-center justify-between bg-gray-100 p-3 rounded-lg"
                >
                  <div className="flex items-center">
                    {track.album.images?.length > 0 && (
                      <img
                        src={track.album.images[0].url}
                        alt="Album"
                        className="w-12 h-12 rounded mr-3"
                      />
                    )}
                    <div>
                      <p className="font-semibold">{track.name}</p>
                      <p className="text-sm text-gray-600">
                        {track.artists.map(a => a.name).join(", ")}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAddTrack(track.uri)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
