import json
from openai import OpenAI
from jam.gpt_prompt import SYSTEM_PROMPT

client = OpenAI()

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
