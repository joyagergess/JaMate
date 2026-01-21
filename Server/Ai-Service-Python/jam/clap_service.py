from clap_analyzer import ClapAnalyzer

_clap = None


def get_clap_analyzer() -> ClapAnalyzer:
    global _clap
    if _clap is None:
        _clap = ClapAnalyzer()
    return _clap


def analyze_with_clap(audio_path: str) -> dict:
    clap = get_clap_analyzer()
    return clap.analyze(audio_path)
