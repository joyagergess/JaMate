
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
