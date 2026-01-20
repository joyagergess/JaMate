import warnings
import logging

warnings.filterwarnings("ignore")

logging.getLogger("transformers").setLevel(logging.ERROR)
logging.getLogger("torch").setLevel(logging.ERROR)
logging.getLogger("laion_clap").setLevel(logging.ERROR)

from fastapi import FastAPI, UploadFile, File
from fastapi.responses import FileResponse
import tempfile
import os
import json

app = FastAPI()


@app.on_event("startup")
def warmup_models():
    """
    Force-load heavy ML components (CLAP, librosa, torch)
    so first user request is fast.
    """
    try:
        from analyzer import analyze_audio
        from prompt_builder import build_musicgen_prompt

        fake_analysis = {
            "tempo": 120,
            "key": "C major",
            "energy": "medium energy",
            "brightness": "balanced",
            "groove": "straight groove",
            "style": "rock",
            "emotion": "calm",
            "feel": "steady",
        }

        build_musicgen_prompt(fake_analysis)

        print(" AI models warmed up")

    except Exception as e:
        print(" Warmup failed:", e)


from analyzer import analyze_audio
from prompt_builder import build_musicgen_prompt
from lyria_generate import generate_music


@app.post("/generate-backing")
async def generate_backing(audio: UploadFile = File(...)):
    input_path = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            tmp.write(await audio.read())
            input_path = tmp.name

        analysis = analyze_audio(input_path)
        print("ANALYSIS OK:", analysis)

        prompt = build_musicgen_prompt(analysis)
        print("PROMPT OK:", prompt)

        output_wav, duration = generate_music(prompt)
        print("GENERATED:", output_wav)

        if not os.path.exists(output_wav) or os.path.getsize(output_wav) < 10_000:
            raise RuntimeError("Generated audio file is empty or invalid")

        return FileResponse(
            path=output_wav,
            media_type="audio/wav",
            filename="ai_backing_track.wav",
            headers={
                "X-BPM": str(int(analysis.get("tempo", 0))),
                "X-KEY": analysis.get("key", ""),
                "X-DURATION": str(duration),
                "X-GENRE": "rock",
            },
        )

    except Exception as e:
        print(" ACTUAL ERROR:", repr(e))
        raise e

    finally:
        if input_path and os.path.exists(input_path):
            os.unlink(input_path)