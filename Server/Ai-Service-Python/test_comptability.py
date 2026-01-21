from analyzer import analyze_audio
from jam.compatibility import JamCompatibilityAnalyzer
from jam.arranger import JamArranger

track_a = analyze_audio(r"C:\Users\USER\JaMate\Server\storage\app\public\tracks\696bcdf711eab.wav")
track_b = analyze_audio(r"C:\Users\USER\JaMate\Server\storage\app\public\tracks\696d1978419d2.wav")

# ---------------- COMPATIBILITY ----------------
compat = JamCompatibilityAnalyzer().analyze(track_a, track_b)

print("\n🎧 JAM COMPATIBILITY")
print("Compatibility Score:", compat["compatibility_score"])
print("Similarity:", f'{compat["similarity_percent"]}%')
print("Label:", compat["label"])

print("\nWhy it works:")
for r in compat["why_it_works"]:
    print(" ", r)

if compat["producer_advice"]:
    print("\nProducer advice:")
    for a in compat["producer_advice"]:
        print(" •", a)

# ---------------- ARRANGEMENT ----------------
arrangement = JamArranger().arrange(
    track_a,
    track_b,
    compat["jam_strategies"]
)

print("\n🎼 AUTO-PICKED JAM STRATEGY")
print("Best strategy:", arrangement["best_strategy"])
print("Why this works:", arrangement["why_this_strategy"])

print("\n🎹 Chord progression:")
print(arrangement["chord_progression"])
