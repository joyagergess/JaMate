import torch
import librosa
import laion_clap


class ClapAnalyzer:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"

        self.model = laion_clap.CLAP_Module(enable_fusion=False)
        self.model.load_ckpt()
        self.model.to(self.device)
        self.model.eval()

        self.labels = [
            "rock", "alternative rock", "metal", "pop", "electronic",
            "ambient", "cinematic", "lo-fi", "blues", "funk",

            "dark", "emotional", "aggressive", "uplifting",
            "melancholic", "energetic", "calm", "powerful",
            "raw", "atmospheric",
        ]

    def analyze(self, audio_path: str) -> dict:
        audio, sr = librosa.load(audio_path, sr=48000, mono=True)

        audio = audio[: sr * 30]

        with torch.no_grad():
            audio_tensor = torch.tensor(audio).unsqueeze(0).to(self.device)

            # Get audio embedding from CLAP
            audio_emb = self.model.get_audio_embedding_from_data(
                audio_tensor, use_tensor=True
            )

            # Get embeddings for text labels
            text_emb = torch.tensor(
                self.model.get_text_embedding(self.labels),
                device=self.device
            )

            # similarity 
            similarity = torch.matmul(audio_emb, text_emb.T)[0]

            # Take top matching labels
            top = torch.topk(similarity, k=5)

        tags = [self.labels[i] for i in top.indices.tolist()]

        return {
            "style": tags[0],
            "emotion": tags[1],
            "feel": tags[2],
            "tags": tags,
        }
