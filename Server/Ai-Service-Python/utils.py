from typing import Any
from constants import NOTES

def normalize_tempo(bpm: float) -> float:
    if bpm >= 140:
        return bpm / 2
    if bpm <= 50:
        return bpm * 2
    return bpm


def refine_mode_with_chords(key, detected_mode, chords):
    if not chords:
        return detected_mode

    chord_set = set(chords)
    if key + "m" in chord_set:
        return "minor"
    if key in chord_set:
        return "major"

    return detected_mode

RELATIVE_KEYS = {
    "C major": "A minor",
    "G major": "E minor",
    "D major": "B minor",
    "A major": "F# minor",
    "E major": "C# minor",
    "F major": "D minor",
    "Bb major": "G minor",
    "Eb major": "C minor",
}


def normalize_energy(e: Any) -> str | None:
    if isinstance(e, str):
        return e
    if isinstance(e, dict) and "energy_level" in e:
        return e["energy_level"]
    return None


def key_mode(key: str) -> str:
    return "minor" if "minor" in key else "major"

    # ---------------- ROMAN → REAL CHORDS ----------------

ROMAN_TO_INTERVAL_MINOR = {
    "i": 0,
    "ii°": 2,
    "♭III": 3,
    "iv": 5,
    "v": 7,
    "♭VI": 8,
    "♭VII": 10,
}

ROMAN_TO_INTERVAL_MAJOR = {
    "I": 0,
    "ii": 2,
    "iii": 4,
    "IV": 5,
    "V": 7,
    "vi": 9,
    "vii°": 11,
}


def transpose_note(root: str, semitones: int) -> str:
    return NOTES[(NOTES.index(root) + semitones) % 12]


def roman_to_chord(key: str, degree: str) -> str:
    """
    Example:
      key = 'C minor'
      degree = '♭VI'
      → 'Ab'
    """
    tonic, mode = key.split()

    if mode == "minor":
        semitone = ROMAN_TO_INTERVAL_MINOR[degree]
        root = transpose_note(tonic, semitone)
        quality = "m" if degree.islower() else ""
    else:
        semitone = ROMAN_TO_INTERVAL_MAJOR[degree]
        root = transpose_note(tonic, semitone)
        quality = "" if degree.isupper() else "m"

    return f"{root}{quality}"
