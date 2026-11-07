"""Namluví komentář místním českým hlasem (Piper „jirka“ přes sherpa-onnx), bez internetu.
Převzato z Vixenu (vixen/video/komentar/tts.py). Model: C:\\Projekty TBDB\\_tts\\vits-piper-cs_CZ-jirka-medium
Spuštění:  py -I video/tts.py video/komentar.json video/wav
"""
import json, os, sys, wave
import numpy as np, sherpa_onnx

M = r"C:\Projekty TBDB\_tts\vits-piper-cs_CZ-jirka-medium" + os.sep
cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(
    vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=M + "cs_CZ-jirka-medium.onnx", tokens=M + "tokens.txt", data_dir=M + "espeak-ng-data"),
    num_threads=4), max_num_sentences=2)
tts = sherpa_onnx.OfflineTts(cfg)
items = json.load(open(sys.argv[1], encoding="utf-8")); out = sys.argv[2]
os.makedirs(out, exist_ok=True); delky = {}
for k, text in items.items():
    a = tts.generate(text, sid=0, speed=float(os.environ.get("SPEED", "0.95")))
    s = np.clip(np.array(a.samples), -1, 1)
    with wave.open(os.path.join(out, k + ".wav"), "wb") as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(a.sample_rate); w.writeframes((s * 32767).astype("<i2").tobytes())
    delky[k] = len(s) / a.sample_rate
json.dump(delky, open(os.path.join(out, "delky.json"), "w"), indent=1)
print({k: round(v, 1) for k, v in delky.items()})
