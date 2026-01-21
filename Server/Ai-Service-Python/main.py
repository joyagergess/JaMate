import warnings
import logging
from dotenv import load_dotenv

load_dotenv()

warnings.filterwarnings("ignore")
logging.getLogger("transformers").setLevel(logging.ERROR)
logging.getLogger("torch").setLevel(logging.ERROR)
logging.getLogger("laion_clap").setLevel(logging.ERROR)

from fastapi import FastAPI

app = FastAPI()

@app.on_event("startup")
def warmup_models():
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


from routers.backing import router as backing_router
from routers.jam import router as jam_router

app.include_router(backing_router)
app.include_router(jam_router)