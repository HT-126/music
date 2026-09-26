import { createContext, useEffect, useRef, useState } from "react";

export const MusicPlayerContext = createContext(null);

const tracks = [
  { name: "Track 1", file: "/music/track1.mp3" },
  { name: "Track 2", file: "/music/track2.mp3" },
  { name: "Track 3", file: "/music/track3.mp3" },
];

export function MusicPlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  function playTrack(index) {
    if (index === currentTrackIndex) {
      setIsPlaying((playing) => !playing);
    } else {
      setCurrentTrackIndex(index);
      setIsPlaying(true);
    }
  }

  function togglePlay() {
    if (currentTrackIndex === null) {
      playTrack(0);
    } else {
      setIsPlaying((playing) => !playing);
    }
  }

  function playNextTrack() {
    setCurrentTrackIndex((index) =>
      index === null ? 0 : (index + 1) % tracks.length
    );
    setIsPlaying(true);
  }

  function playPreviousTrack() {
    setCurrentTrackIndex((index) =>
      index === null
        ? tracks.length - 1
        : (index - 1 + tracks.length) % tracks.length
    );
    setIsPlaying(true);
  }

  useEffect(() => {
    const audio = audioRef.current;
    let cancelled = false;

    if (isPlaying) {
      audio.play().catch((error) => {
        if (!cancelled && error.name !== "AbortError") {
          setIsPlaying(false);
        }
      });
    } else {
      audio.pause();
    }

    return () => {
      cancelled = true;
    };
  }, [currentTrackIndex, isPlaying]);

  return (
    <MusicPlayerContext.Provider
      value={{
        tracks,
        currentTrackIndex,
        isPlaying,
        playTrack,
        togglePlay,
        playNextTrack,
        playPreviousTrack,
      }}
    >
      {children}

      <audio
        ref={audioRef}
        src={
          currentTrackIndex === null
            ? undefined
            : tracks[currentTrackIndex].file
        }
        onEnded={playNextTrack}
        onError={() => setIsPlaying(false)}
      />
    </MusicPlayerContext.Provider>
  );
}