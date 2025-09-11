import { render, screen, fireEvent } from "@testing-library/react";
import { TrackItem } from "../components/TrackItem";

const sampleTrack = {
  id: "1",
  name: "Test Song",
  artists: [{ name: "Test Artist" }],
  album: { images: [{}, {}, { url: "test.jpg" }] },
  uri: "spotify:track:1",
};

test("renders track info", () => {
  render(
    <TrackItem track={sampleTrack} isInPlaylist={false} onAdd={jest.fn()} />
  );
  expect(screen.getByText("Test Song")).toBeInTheDocument();
  expect(screen.getByText("Test Artist")).toBeInTheDocument();
});

test("calls onAdd when Add button clicked", () => {
  const onAdd = jest.fn();
  render(<TrackItem track={sampleTrack} isInPlaylist={false} onAdd={onAdd} />);
  fireEvent.click(screen.getByText(/Add/i));
  expect(onAdd).toHaveBeenCalledWith(sampleTrack);
});

test("calls onRemove when Remove button clicked", () => {
  const onRemove = jest.fn();
  render(
    <TrackItem track={sampleTrack} isInPlaylist={true} onRemove={onRemove} />
  );
  fireEvent.click(screen.getByText(/Remove/i));
  expect(onRemove).toHaveBeenCalledWith(sampleTrack);
});
