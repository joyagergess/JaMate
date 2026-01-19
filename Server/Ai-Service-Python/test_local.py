# test_local.py

from analyzer import analyze_audio
from prompt_builder import build_musicgen_prompt
from lyria_generate import generate_music

AUDIO_PATH = r"C:\Users\USER\JaMate\Server\storage\app\public\tracks\696b70bf3018c.wav"

analysis = analyze_audio(AUDIO_PATH)
prompt = build_musicgen_prompt(analysis)

print("\n🎵 PROMPT:")
print(prompt)

out_path, duration = generate_music(prompt)

print("\n Generated:")
print(out_path)
