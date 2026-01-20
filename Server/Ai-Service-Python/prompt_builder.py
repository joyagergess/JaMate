
def groove_to_prompt(groove: str) -> str:
    """
    Translate internal groove labels into language Lyria understands well.
    """
    mapping = {
        "straight groove": "tight straight groove with even subdivisions",
        "shuffle groove": "shuffle groove with swung eighth notes",
        "slightly swung groove": "subtle swing feel with relaxed timing",
        "pushed groove": "pushed groove with slightly ahead-of-the-beat feel",
        "free time": "free-time feel without a strict rhythmic grid",
    }

    return mapping.get(groove, "")


def build_musicgen_prompt(analysis: dict) -> str:

    brightness = (
        analysis["brightness"]["brightness"]
        if isinstance(analysis.get("brightness"), dict)
        else analysis.get("brightness", "")
    )

    groove_phrase = groove_to_prompt(analysis.get("groove", ""))

    parts = [
        f"{round(analysis['tempo'])} BPM",
        "in 4/4",
        groove_phrase,
        f"in {analysis['key']}",
        f"{brightness} tone",
        f"{analysis.get('style', '')} style",
        f"{analysis.get('emotion', '')} mood",
        f"{analysis.get('feel', '')} feel",
    ]

    parts = [p for p in parts if isinstance(p, str) and p.strip()]

    return (
        "High-quality instrumental backing track, "
        + ", ".join(parts)
        + ", featuring electric guitar, bass, and drums, "
          "drums driving the groove, "
          "strong rhythmic foundation, "
          "clean studio production, "
          "well-balanced mix, "
          "tight low end, "
          "instrumental only, no vocals."
    )
