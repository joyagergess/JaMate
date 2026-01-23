import numpy as np
import librosa


def extract_energy(audio, sr):
    # loudness over time
    rms_values = librosa.feature.rms(y=audio)[0]
    rms_average = float(np.mean(rms_values))
    rms_variation = float(np.std(rms_values))

    # (how strong rhythmic hits are
    onset_strength = librosa.onset.onset_strength(y=audio, sr=sr)
    onset_average = float(np.mean(onset_strength))

    # Normalized scores
    loudness_score = np.clip(rms_average * 20, 0, 1)
    dynamics_score = np.clip(rms_variation * 50, 0, 1)
    rhythm_score = np.clip(onset_average / 5, 0, 1)

    energy_score = (
        0.4 * loudness_score +
        0.3 * dynamics_score +
        0.3 * rhythm_score
    )

    if energy_score < 0.35:
        energy_level = "low energy"
    elif energy_score < 0.65:
        energy_level = "medium energy"
    else:
        energy_level = "high energy"

    return {
        "energy_level": energy_level,
        "energy_score": round(float(energy_score), 3),
    }



def extract_brightness(audio, sr):
    spectral_centroid = librosa.feature.spectral_centroid(
        y=audio, sr=sr
    )[0]

    # Average brightness over the whole track
    average_centroid = float(np.mean(spectral_centroid))

    if average_centroid < 1800:
        brightness = "dark"
    elif average_centroid < 3200:
        brightness = "balanced"
    else:
        brightness = "bright"

    return {
        "brightness": brightness
    }


def _compute_groove_offsets(audio, sr):
    # Detect beats and estimate tempo
    tempo, beat_frames = librosa.beat.beat_track(
        y=audio, sr=sr
    )

    # Not enough beats 
    if len(beat_frames) < 8:
        return None

    # Convert beat positions from frames to seconds
    beat_times = librosa.frames_to_time(
        beat_frames, sr=sr
    )

    # Detect note onsets 
    onset_frames = librosa.onset.onset_detect(
        y=audio, sr=sr, units="frames"
    )

    onset_times = librosa.frames_to_time(
        onset_frames, sr=sr
    )

    offsets = []

    for i in range(len(beat_times) - 1):
        beat_start = beat_times[i]
        beat_end = beat_times[i + 1]

        beat_middle = (beat_start + beat_end) / 2

        onsets_in_beat = onset_times[
            (onset_times > beat_start) &
            (onset_times < beat_end)
        ]

        if len(onsets_in_beat) == 0:
            continue

        closest_onset = onsets_in_beat[
            np.argmin(np.abs(onsets_in_beat - beat_middle))
        ]

        normalized_offset = (
            (closest_onset - beat_middle) /
            (beat_end - beat_start)
        )

        offsets.append(normalized_offset)

    return offsets


def _classify_groove_from_offsets(offsets):

    if offsets is None:
        return "free time"

    if len(offsets) < 5:
        return "straight groove"

    # Average timing feel and its consistency
    average_offset = np.mean(offsets)
    offset_variation = np.std(offsets)

    if abs(average_offset) < 0.03 and offset_variation < 0.05:
        return "straight groove"

    if average_offset > 0.08:
        return "shuffle groove"

    if average_offset < -0.08:
        return "pushed groove"

    return "slightly swung groove"


def detect_groove(audio, sr):
    offsets = _compute_groove_offsets(audio, sr)
    return _classify_groove_from_offsets(offsets)