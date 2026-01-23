import json
from dotenv import load_dotenv

from backing_track.analyzer import analyze_audio
from jam.compatibility import JamCompatibilityAnalyzer
from jam.arranger import JamArranger
from jam.gpt_interpreter import interpret_with_gpt

load_dotenv()


track_a = analyze_audio(
    r"C:\Users\USER\JaMate\Server\storage\app\public\tracks\696bcdf711eab.wav"
)
track_b = analyze_audio(
    r"C:\Users\USER\JaMate\Server\storage\app\public\tracks\696d1978419d2.wav"
)

compat = JamCompatibilityAnalyzer().analyze(track_a, track_b)

arrangement = JamArranger().arrange(
    track_a,
    track_b,
    compat["jam_strategies"]
)

base_response = {
    "track_a": track_a,
    "track_b": track_b,
    "compatibility": compat,
    "arrangement": arrangement,
}

print("\nBASE RESPONSE")
print(json.dumps(base_response, indent=2))

print("\nGPT INTERPRETATION")

gpt_result = interpret_with_gpt(base_response)

print(json.dumps(gpt_result, indent=2))
