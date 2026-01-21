from typing import Dict, List
from utils import normalize_energy


def generate_jam_strategies(a: Dict, b: Dict, tempo_diff: float) -> List[Dict]:
    strategies = []

    energy_a = normalize_energy(a.get("energy"))
    energy_b = normalize_energy(b.get("energy"))

    if tempo_diff <= 6 and a.get("groove") == b.get("groove"):
        strategies.append({
            "title": "Locked Groove Jam",
            "description": (
                "Both tracks share a strong rhythmic pocket. "
                "Start together on a tight loop, lock the groove early, "
                "and build layers gradually."
            ),
            "how_to_jam": [
                "Agree on a shared tempo",
                "Loop a short groove",
                "Improvise melodically on top",
            ]
        })

    if {energy_a, energy_b} == {"high energy", "medium energy"}:
        strategies.append({
            "title": "Build & Drop Jam",
            "description": (
                "One track naturally leads energy while the other supports the build. "
                "Perfect for dynamic jams with tension and release."
            ),
            "how_to_jam": [
                "Medium-energy track starts the groove",
                "High-energy track enters at chorus or drop",
                "Trade solos near the climax",
            ]
        })

    if "minor" in a["key"] and "minor" in b["key"]:
        strategies.append({
            "title": "Dark Cinematic Jam",
            "description": (
                "Both tracks live in minor tonalities. "
                "Lean into emotion, space, and texture rather than speed."
            ),
            "how_to_jam": [
                "Transpose to a shared minor key",
                "Use long notes and ambience",
                "Let emotion drive phrasing",
            ]
        })

    strategies.append({
        "title": "Experimental Contrast Jam",
        "description": (
            "Instead of forcing similarity, embrace contrast. "
            "One track keeps time while the other explores texture and noise."
        ),
        "how_to_jam": [
            "One musician acts as rhythmic anchor",
            "The other experiments freely",
            "Switch roles halfway through",
        ]
    })

    return strategies