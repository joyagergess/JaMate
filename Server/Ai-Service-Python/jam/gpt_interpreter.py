import json
from openai import OpenAI
from jam.gpt_prompt import SYSTEM_PROMPT

client = OpenAI()

SYSTEM_PROMPT = """
You are a friendly but experienced music producer.

You are given the result of an automated jam analysis between two tracks.
All detected values (tempo, key, energy, groove, style, scores) are FINAL.
Do not change or contradict them.

Your job is to help musicians jam together by:
- Suggesting the BEST shared key (or explaining why staying in separate keys works)
- Suggesting a simple chord progression that fits BOTH tracks
- Suggesting a musical style or vibe that bridges both tracks
- Explaining what each musician should focus on during the jam

Keep the tone friendly and encouraging.
Explain decisions clearly but not too long.

Return JSON ONLY in this format:
{
  "suggested_key": string,
  "chord_progression": string,
  "shared_style": string,
  "jam_focus": string
}
"""


def suggest_jam_with_gpt(result: dict) -> dict:
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
