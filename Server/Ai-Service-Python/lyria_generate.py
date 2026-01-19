import replicate
import tempfile
import uuid
import os
import requests


def generate_music(prompt: str, duration: int = 15) -> tuple[str, int]:
    output = replicate.run(
        "google/lyria-2",
        input={
            "prompt": prompt,
        }
    )

    audio_bytes = None

    if hasattr(output, "read"):
        audio_bytes = output.read()
    elif isinstance(output, str):
        audio_bytes = requests.get(output, timeout=60).content
    elif isinstance(output, list) and output:
        first = output[0]
        if hasattr(first, "read"):
            audio_bytes = first.read()
        elif isinstance(first, str):
            audio_bytes = requests.get(first, timeout=60).content

    if not audio_bytes or len(audio_bytes) < 10_000:
        raise RuntimeError("Invalid or empty audio returned from Lyria")

    out_path = os.path.join(
        tempfile.gettempdir(),
        f"lyria_{uuid.uuid4()}.wav"
    )

    with open(out_path, "wb") as f:
        f.write(audio_bytes)

    return out_path, duration
