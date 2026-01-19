import { useRef, useState } from "react";
import { Audio } from "expo-av";

export function useAudioPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);
  const playingIdRef = useRef<number | null>(null);

  const [playingId, setPlayingId] = useState<number | null>(null);
  const [loadingTrackId, setLoadingTrackId] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const onPlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) return;

    if (status.durationMillis) {
      setProgress(status.positionMillis / status.durationMillis);

      const remaining = Math.ceil(
        (status.durationMillis - status.positionMillis) / 1000
      );
      setRemainingSeconds(Math.max(remaining, 0));
    }

    if (status.didJustFinish) {
      soundRef.current?.unloadAsync();
      soundRef.current = null;
      playingIdRef.current = null;

      setPlayingId(null);
      setIsPlaying(false);
      setProgress(0);
      setRemainingSeconds(null);
    }
  };

  const togglePlay = async (track: any) => {
    const isSameTrack = playingIdRef.current === track.id;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      playThroughEarpieceAndroid: false,
    });

    // ⏸ PAUSE (do NOT reset anything)
    if (soundRef.current && isSameTrack && isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
      return;
    }

    // ▶️ RESUME SAME TRACK
    if (soundRef.current && isSameTrack && !isPlaying) {
      await soundRef.current.playAsync();
      setIsPlaying(true);
      return;
    }

    // 🔁 SWITCH TRACK
    if (soundRef.current && !isSameTrack) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
      playingIdRef.current = null;

      setProgress(0);
      setRemainingSeconds(null);
    }

    // ▶️ FIRST PLAY
    setLoadingTrackId(track.id);

    const { sound } = await Audio.Sound.createAsync(
      { uri: track.audio_public_url },
      {
        shouldPlay: true,
        progressUpdateIntervalMillis: 50,
      },
      onPlaybackStatusUpdate
    );

    soundRef.current = sound;
    playingIdRef.current = track.id;

    setPlayingId(track.id);
    setIsPlaying(true);
    setLoadingTrackId(null);
  };

  return {
    togglePlay,
    playingId,
    isPlaying,
    loadingTrackId,
    remainingSeconds,
    progress,
  };
}
