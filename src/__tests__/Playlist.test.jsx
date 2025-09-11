import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Playlist } from "../components/Playlist";

jest.mock("../uti/spotify_config", () => ({
  spotifyFetch: jest.fn(),
}));

const { spotifyFetch } = require("../uti/spotify_config");

const sampleTrack = {
  id: "1",
  name: "Test Song",
  artists: [{ name: "Test Artist" }],
  album: { images: [{}, {}, { url: "test.jpg" }] },
  uri: "spotify:track:1",
};

const user = { id: "user123" };

function setupPlaylist(tracks = [sampleTrack]) {
  const setPlaylistTracks = jest.fn();
  render(
    <Playlist
      playlistTracks={tracks}
      setPlaylistTracks={setPlaylistTracks}
      accessToken="fake_token"
      user={user}
    />
  );
  return { setPlaylistTracks };
}

test("renders empty message when no tracks", () => {
  setupPlaylist([]);
  expect(screen.getByText(/No tracks yet/i)).toBeInTheDocument();
});

test("renders track in playlist", () => {
  setupPlaylist();
  expect(screen.getByText("Test Song")).toBeInTheDocument();
});

test("saves playlist with tracks", async () => {
  spotifyFetch
    .mockImplementationOnce(() => Promise.resolve({ id: "playlist1" }))
    .mockImplementationOnce(() => Promise.resolve({}));

  setupPlaylist();
  fireEvent.click(screen.getByText(/Save Playlist/i));

  await waitFor(() => expect(spotifyFetch).toHaveBeenCalledTimes(2));
  expect(spotifyFetch).toHaveBeenCalledWith(
    "/users/user123/playlists",
    "fake_token",
    expect.any(Object)
  );
  expect(spotifyFetch).toHaveBeenCalledWith(
    "/playlists/playlist1/tracks",
    "fake_token",
    expect.any(Object)
  );
});
