
import numpy as np
import librosa

def extract_energy(audio, sr):
    rms = librosa.feature.rms(y=audio)[0]
    rms_mean = float(np.mean(rms))
    rms_std = float(np.std(rms))

    onset_env = librosa.onset.onset_strength(y=audio, sr=sr)
    onset_mean = float(np.mean(onset_env))

    rms_score = np.clip(rms_mean * 20, 0, 1)
    dyn_score = np.clip(rms_std * 50, 0, 1)
    onset_score = np.clip(onset_mean / 5, 0, 1)

    energy_score = (
        0.4 * rms_score +
        0.3 * dyn_score +
        0.3 * onset_score
    )

    if energy_score < 0.35:
        level = "low energy"
    elif energy_score < 0.65:
        level = "medium energy"
    else:
        level = "high energy"

    return {
        "energy_level": level,
        "energy_score": round(float(energy_score), 3),
    }



def extract_brightness(audio, sr):
    centroid = librosa.feature.spectral_centroid(y=audio, sr=sr)[0]
    avg = float(np.mean(centroid))

    if avg < 1800:
        tone = "dark"
    elif avg < 3200:
        tone = "balanced"
    else:
        tone = "bright"

    return {"brightness": tone}

def detect_groove(audio, sr):
    tempo, beat_frames = librosa.beat.beat_track(y=audio, sr=sr)
    if len(beat_frames) < 8:
        return "free time"

    beat_times = librosa.frames_to_time(beat_frames, sr=sr)

    onset_frames = librosa.onset.onset_detect(y=audio, sr=sr, units="frames")
    onset_times = librosa.frames_to_time(onset_frames, sr=sr)

    offsets = []

    for i in range(len(beat_times) - 1):
        beat_start = beat_times[i]
        beat_end = beat_times[i + 1]
        mid = (beat_start + beat_end) / 2

        candidates = onset_times[
            (onset_times > beat_start) & (onset_times < beat_end)
        ]

        if len(candidates) == 0:
            continue

        closest = candidates[np.argmin(np.abs(candidates - mid))]
        offset = (closest - mid) / (beat_end - beat_start)
        offsets.append(offset)

    if len(offsets) < 5:
        return "straight groove"

    avg_offset = np.mean(offsets)
    std_offset = np.std(offsets)

    if abs(avg_offset) < 0.03 and std_offset < 0.05:
        return "straight groove"

    if avg_offset > 0.08:
        return "shuffle groove"

    if avg_offset < -0.08:
        return "pushed groove"

    return "slightly swung groove"
