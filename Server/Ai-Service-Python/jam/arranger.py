from typing import Dict, List
from utils import key_mode, roman_to_chord


class JamArranger:

    def arrange(self, a: Dict, b: Dict, strategies: List[Dict]) -> Dict:
        best = self._pick_best_strategy(a, b, strategies)

        return {
            "track_a_key": a["key"],
            "track_b_key": b["key"],

            "best_strategy": best["title"],
            "why_this_strategy": best["description"],

            "chord_progression": self._generate_chords(
                key=a["key"],
                strategy=best["title"],
            ),
        }


    def _pick_best_strategy(
        self,
        a: Dict,
        b: Dict,
        strategies: List[Dict],
    ) -> Dict:

        for s in strategies:
            if s["title"] == "Locked Groove Jam" and a.get("groove") == b.get("groove"):
                return s

            if s["title"] == "Build & Drop Jam":
                return s

            if s["title"] == "Dark Cinematic Jam" and (
                "minor" in a["key"] and "minor" in b["key"]
            ):
                return s

        return strategies[0]


    def _generate_chords(self, key: str, strategy: str) -> Dict:
        """
        Generates real chord names (Cm, Ab, Bb...)
        based on strategy and key.
        """

        mode = key_mode(key)

        if strategy == "Locked Groove Jam":
            roman_prog = (
                ["i", "♭VII", "♭VI", "♭VII"]
                if mode == "minor"
                else ["I", "V", "vi", "IV"]
            )
            feel = "loop-driven, hypnotic"

        elif strategy == "Build & Drop Jam":
            roman_prog = (
                ["i", "i", "♭VI", "♭VII"]
                if mode == "minor"
                else ["vi", "IV", "I", "V"]
            )
            feel = "tension → release"

        elif strategy == "Dark Cinematic Jam":
            roman_prog = ["i", "iv", "v", "i"]
            feel = "emotional, slow-evolving"

        else:
            roman_prog = ["i", "♭VI", "♭VII"]
            feel = "experimental"

        return {
            "key": key,
            "progression": [roman_to_chord(key, d) for d in roman_prog],
            "feel": feel,
        }
