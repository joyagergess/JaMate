from typing import Dict
from backing_track.utils import RELATIVE_KEYS, normalize_energy, key_mode
from jam.strategies import generate_jam_strategies


class JamCompatibilityAnalyzer:
    def analyze(self, a: Dict, b: Dict) -> Dict:
        score = 0
        similarity = 0
        reasons = []
        advice = []

        tempo_diff = abs(a["tempo"] - b["tempo"])

        if tempo_diff <= 3:
            score += 30
            similarity += 25
            reasons.append(" Locked tempo pocket")
        elif tempo_diff <= 6:
            score += 22
            similarity += 18
            reasons.append("Tight tempo pocket")
            advice.append("Sync tempo by ±5 BPM")
        elif tempo_diff <= 10:
            score += 14
            similarity += 10
            advice.append("Try half-time or tempo automation")
        else:
            advice.append("Large tempo gap - structure-based jam recommended")

        if a["key"] == b["key"]:
            score += 25
            similarity += 25
            reasons.append(" Same key center")
        elif RELATIVE_KEYS.get(a["key"]) == b["key"]:
            score += 18
            similarity += 18
            reasons.append(" Relative key relationship")
        elif key_mode(a["key"]) == key_mode(b["key"]):
            score += 10
            similarity += 12
            advice.append("Transpose to a shared minor/major key")
        else:
            advice.append("Use modal or riff-based jam")

        if a.get("groove") == b.get("groove"):
            score += 15
            similarity += 10
            reasons.append(" Groove alignment")

        energy_a = normalize_energy(a.get("energy"))
        energy_b = normalize_energy(b.get("energy"))

        if energy_a == energy_b:
            score += 10
            similarity += 10
        elif {energy_a, energy_b} == {"high energy", "medium energy"}:
            score += 8
            similarity += 6
            advice.append("Build-drop energy flow works well")

        if a.get("style") == b.get("style"):
            score += 12
            similarity += 15
            reasons.append("Same musical style")

        if a.get("emotion") == b.get("emotion"):
            score += 12
            similarity += 15
            reasons.append("Emotional alignment")

        return {
            "compatibility_score": min(score, 100),
            "similarity_percent": min(similarity, 100),
            "label": self._label(score),
            "why_it_works": reasons,
            "producer_advice": advice,
            "jam_strategies": generate_jam_strategies(a, b, tempo_diff),
        }

    def _label(self, score: int) -> str:
        if score >= 85:
            return " Perfect Jam"
        if score >= 70:
            return " Strong Match"
        if score >= 55:
            return " High Potential"
        return "Experimental but Interesting"