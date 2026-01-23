from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
import tempfile
import os

from backing_track.analyzer import analyze_audio
from backing_track.prompt_builder import build_musicgen_prompt
from backing_track.lyria_generate import generate_music

router = APIRouter()


@router.post("/generate-backing")
async def generate_backing(audio: UploadFile = File(...)):
    input_path = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            tmp.write(await audio.read())
            input_path = tmp.name

        analysis = analyze_audio(input_path)

        prompt = build_musicgen_prompt(analysis)
        output_wav, duration = generate_music(prompt)

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

    finally:
        if input_path and os.path.exists(input_path):
            os.unlink(input_path)
