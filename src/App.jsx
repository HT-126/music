import { MusicPlayerProvider } from "./contexts/MusicPlayerContext";
import useMusicPlayer from "./hooks/useMusicPlayer";
import "./App.css";

function TrackList() {
  const {
    tracks,
    currentTrackIndex,
    isPlaying,
    playTrack,
  } = useMusicPlayer();

  return (
    <div className="track-list">
      {tracks.map((track, index) => {
        const playing = currentTrackIndex === index && isPlaying;

        return (
          <button
            key={track.file}
            className="track"
            onClick={() => playTrack(index)}
            aria-label={`${playing ? "Pause" : "Play"} ${track.name}`}
          >
            <span className="track-icon" aria-hidden="true">
              {playing ? "||" : "▶"}
            </span>
            <span>{track.name}</span>
          </button>
        );
      })}
    </div>
  );
}

function Controller() {
  const {
    isPlaying,
    togglePlay,
    playPreviousTrack,
    playNextTrack,
  } = useMusicPlayer();

  return (
    <div className="controller">
      <button onClick={playPreviousTrack} aria-label="Previous track">
        ⏮
      </button>

      <button
        className="main-button"
        onClick={togglePlay}
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? "||" : "▶"}
      </button>

      <button onClick={playNextTrack} aria-label="Next track">
        ⏭
      </button>
    </div>
  );
}

function MusicPlayer() {
  const { tracks, currentTrackIndex } = useMusicPlayer();

  return (
    <div className="player">
      <div className="player-header" aria-live="polite">
        {currentTrackIndex !== null && tracks[currentTrackIndex].name}
      </div>

      <TrackList />
      <Controller />
    </div>
  );
}

export default function App() {
  return (
    <MusicPlayerProvider>
      <main className="page">
        <MusicPlayer />

        <footer>
          Copyright ©
          <a href="https://www.coderschool.vn/">CoderSchool</a>
          {new Date().getFullYear()}
        </footer>
      </main>
    </MusicPlayerProvider>
  );
}