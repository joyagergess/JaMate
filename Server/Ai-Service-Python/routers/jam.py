from fastapi import APIRouter, UploadFile, File
import tempfile
import os

from analyzer import analyze_audio
from jam.compatibility import JamCompatibilityAnalyzer
from jam.arranger import JamArranger

router = APIRouter(prefix="/jam", tags=["jam"])


@router.post("/analyze")
async def analyze_jam(
    track_a: UploadFile = File(...),
    track_b: UploadFile = File(...)
):
    path_a = path_b = None

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as f:
            f.write(await track_a.read())
            path_a = f.name

        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as f:
            f.write(await track_b.read())
            path_b = f.name

        analysis_a = analyze_audio(path_a)
        analysis_b = analyze_audio(path_b)

        compat = JamCompatibilityAnalyzer().analyze(
            analysis_a,
            analysis_b
        )

        arrangement = JamArranger().arrange(
            analysis_a,
            analysis_b,
            compat["jam_strategies"]
        )

        return {
            "track_a": analysis_a,
            "track_b": analysis_b,
            "compatibility": compat,
            "arrangement": arrangement,
        }

    finally:
        if path_a and os.path.exists(path_a):
            os.unlink(path_a)
        if path_b and os.path.exists(path_b):
            os.unlink(path_b)
