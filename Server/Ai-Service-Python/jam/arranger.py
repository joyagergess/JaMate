from typing import Dict, List
from utils import key_mode


class JamArranger:

    def arrange(self, a: Dict, b: Dict, strategies: List[Dict]) -> Dict:
        best = self._pick_best_strategy(a, b, strategies)

        return {
            "track_a_key": a["key"],
            "track_b_key": b["key"],

            "best_strategy": best["title"],
            "why_this_strategy": best["description"],

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

