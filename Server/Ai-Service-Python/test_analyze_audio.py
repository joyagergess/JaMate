from backing_track.analyzer import analyze_audio
from backing_track.prompt_builder import build_musicgen_prompt

AUDIO_PATH = r"C:\Users\USER\JaMate\Server\storage\app\public\tracks\696d1978419d2.wav"

print("Analyzing audio...")
analysis = analyze_audio(AUDIO_PATH)

print("\nAnalysis:")
print(analysis)

print("\n Lyria Prompt:")
print(build_musicgen_prompt(analysis))
