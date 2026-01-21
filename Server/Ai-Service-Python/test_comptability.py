import json
import os
from dotenv import load_dotenv
from openai import OpenAI

from analyzer import analyze_audio
from jam.compatibility import JamCompatibilityAnalyzer
from jam.arranger import JamArranger

# Load env vars (safe even if not using .env)
load_dotenv()

# OpenAI client
client = OpenAI()


SYSTEM_PROMPT = """
You are a music producer assistant.

You are given the result of an automated jam analysis system.
All musical decisions, scores, and strategies are FINAL.
You must not change numbers, scores, or invent musical facts.

Your job:
- Explain the compatibility in clear human language
- Explain why the chosen jam strategy fits
- Give 2–3 practical jam suggestions musicians can follow

Return JSON ONLY in this format:
{
  "summary": string,
  "strategy_explanation": string,
  "jam_suggestions": string[]
}
"""


def interpret_with_gpt(result: dict) -> dict:
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": json.dumps(result, indent=2)},
        ],
        temperature=0.4,
    )

    content = response.choices[0].message.content

    try:
        return json.loads(content)
    except json.JSONDecodeError:
        raise RuntimeError("GPT returned invalid JSON:\n" + content)


# ---------------- ANALYSIS ----------------

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

print("\n📦 BASE RESPONSE")
print(json.dumps(base_response, indent=2))


# ---------------- GPT INTERPRETATION ----------------

print("\n🤖 GPT INTERPRETATION")

gpt_result = interpret_with_gpt(base_response)

print(json.dumps(gpt_result, indent=2))
