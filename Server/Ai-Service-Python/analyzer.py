import librosa
import soundfile as sf
import numpy as np

from constants import (
    TARGET_SR, NOTES,
    KRUMHANSL_MAJOR, KRUMHANSL_MINOR
)
from utils import normalize_tempo
from features import extract_energy, extract_brightness, detect_groove
from clap_analyzer import ClapAnalyzer

clap = ClapAnalyzer()


def analyze_audio(audio_path: str) -> dict:
    audio, sr = sf.read(audio_path)

    if audio.ndim > 1:
        audio = audio.mean(axis=1)

    if sr != TARGET_SR:
        audio = librosa.resample(audio, orig_sr=sr, target_sr=TARGET_SR)
        sr = TARGET_SR

    raw_tempo, _ = librosa.beat.beat_track(y=audio, sr=sr, trim=False)
    tempo = normalize_tempo(float(raw_tempo))

    harmonic, _ = librosa.effects.hpss(audio)

    chroma = librosa.feature.chroma_cqt(
        y=harmonic,
        sr=sr,
        bins_per_octave=24
    )

    chroma_vec = np.median(chroma, axis=1)
    chroma_vec /= np.sum(chroma_vec) + 1e-6

    best_score = -1
    best_key = None
    best_mode = None
    alt_key = None

    for i in range(12):
        maj = np.corrcoef(np.roll(KRUMHANSL_MAJOR, i), chroma_vec)[0, 1]
        minr = np.corrcoef(np.roll(KRUMHANSL_MINOR, i), chroma_vec)[0, 1]

        if maj > best_score:
            alt_key = f"{best_key} {best_mode}" if best_key else None
            best_score = maj
            best_key = NOTES[i]
            best_mode = "major"

        if minr > best_score:
            alt_key = f"{best_key} {best_mode}" if best_key else None
            best_score = minr
            best_key = NOTES[i]
            best_mode = "minor"

    energy = extract_energy(audio, sr)
    brightness = extract_brightness(audio, sr)
    groove = detect_groove(audio, sr)

    mood = (
        "dark and intense" if best_mode == "minor" and energy == "high energy"
        else "dark and emotional" if best_mode == "minor"
        else "uplifting and energetic" if energy == "high energy"
        else "calm and steady"
    )

    clap_info = clap.analyze(audio_path)

    return {
        "tempo": tempo,
        "key": f"{best_key} {best_mode}",
        "confidence": round(best_score, 3),
        "alt_key": alt_key,

        "energy": energy,
        "brightness": brightness,
        "groove": groove,
        "mood": mood,

        "style": clap_info["style"],
        "emotion": clap_info["emotion"],
        "feel": clap_info["feel"],
    }
