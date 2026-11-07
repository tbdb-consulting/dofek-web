"""Složí instruktážní video: karty + natočené scény + namluvený komentář (ffmpeg).
Spuštění:  py video/slozit.py "<cílový .mp4>"
Předtím:   py video/tts.py video/komentar.json video/wav  a  node video/natocit.cjs <adresa náhledu>
"""
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

V = os.path.dirname(os.path.abspath(__file__)); W = os.path.join(V, "wav"); Z = os.path.join(V, "zaznam"); S = os.path.join(V, "seg")
os.makedirs(S, exist_ok=True)
D = json.load(open(os.path.join(W, "delky.json"))); C = json.load(open(os.path.join(Z, "casy.json")))
F = r"C:\Windows\Fonts"
def font(b, s): return ImageFont.truetype(os.path.join(F, "segoeuib.ttf" if b else "segoeui.ttf"), s)
TMAVA, SVETLA, ZLATA = (43, 26, 12), (243, 232, 220), (217, 166, 107)

def zalom(d, text, f, sirka):
    radky, r = [], ""
    for slovo in text.split():
        t = (r + " " + slovo).strip()
        if d.textlength(t, font=f) > sirka and r: radky.append(r); r = slovo
        else: r = t
    return radky + [r]

def karta(jmeno, nadpis, texty):
    im = Image.new("RGB", (1280, 720), TMAVA); d = ImageDraw.Draw(im)
    d.text((640, 200), "STOLAŘSTVÍ DOFEK", font=font(1, 30), fill=ZLATA, anchor="mm")
    y = 290
    for r in zalom(d, nadpis, font(1, 54), 1100): d.text((640, y), r, font=font(1, 54), fill=(255, 255, 255), anchor="mm"); y += 66
    y += 20
    for t in texty:
        for r in zalom(d, t, font(0, 28), 1000): d.text((640, y), r, font=font(0, 28), fill=SVETLA, anchor="mm"); y += 40
    d.text((640, 670), "Ukázka TBDB Consulting · vymyšlená jména a čísla · T26-08-1", font=font(0, 20), fill=(170, 150, 130), anchor="mm")
    p = os.path.join(S, jmeno + ".png"); im.save(p); return p

def pozadi_telefon():
    im = Image.new("RGB", (1280, 720), TMAVA); d = ImageDraw.Draw(im)
    d.rounded_rectangle((112, 300, 162, 390), radius=9, outline=ZLATA, width=5)  # jednoduchý obrys telefonu
    d.line((130, 378, 144, 378), fill=ZLATA, width=4)
    d.text((110, 420), "Zákazník", font=font(1, 56), fill=(255, 255, 255))
    d.text((110, 495), "poptávka z mobilu", font=font(0, 30), fill=SVETLA)
    d.text((110, 545), "web stolařství v telefonu", font=font(0, 26), fill=(170, 150, 130))
    d.rounded_rectangle((760, 14, 760 + 362, 14 + 692), radius=28, fill=(15, 10, 6))
    p = os.path.join(S, "pozadi_telefon.png"); im.save(p); return p

def run(a): subprocess.run(a, check=True)
ENC = ["-c:v", "libx264", "-preset", "medium", "-crf", "20", "-r", "30", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "128k", "-ar", "48000", "-ac", "2"]
segs = []

def seg_karta(png, klic):
    d = D[klic] + 1.4; out = os.path.join(S, f"{len(segs):02d}_{klic}.mp4")
    run(["ffmpeg", "-loglevel", "error", "-y", "-loop", "1", "-framerate", "30", "-t", f"{d:.2f}", "-i", png, "-i", os.path.join(W, klic + ".wav"),
         "-filter_complex", f"[0:v]fade=t=in:st=0:d=0.5,fade=t=out:st={d-0.5:.2f}:d=0.5[v];[1:a]adelay=500|500,apad,atrim=0:{d:.2f}[a]",
         "-map", "[v]", "-map", "[a]", *ENC, "-t", f"{d:.2f}", out]); segs.append(out)

def seg_scena(jmeno, telefon=False):
    casy = C[jmeno]; src = os.path.join(Z, jmeno + ".webm"); out = os.path.join(S, f"{len(segs):02d}_{jmeno}.mp4")
    vstupy = ["-i", src]; filtr = []
    if telefon:
        vstupy = ["-loop", "1", "-framerate", "30", "-i", pozadi_telefon()] + vstupy
        filtr.append("[1:v]fps=30,scale=342:684:flags=lanczos[t];[0:v][t]overlay=770:18:shortest=1,format=yuv420p[v]"); vi = 2
    else:
        filtr.append("[0:v]fps=30,scale=1280:720:flags=lanczos,format=yuv420p[v]"); vi = 1
    a = []
    for i, (k, t) in enumerate(casy.items()):
        vstupy += ["-i", os.path.join(W, k + ".wav")]; ms = int(t * 1000) + 300
        filtr.append(f"[{vi + i}:a]adelay={ms}|{ms}[a{i}]"); a.append(f"[a{i}]")
    filtr.append("".join(a) + f"amix=inputs={len(a)}:normalize=0:dropout_transition=0[a]")
    run(["ffmpeg", "-loglevel", "error", "-y", *vstupy, "-filter_complex", ";".join(filtr), "-map", "[v]", "-map", "[a]", *ENC, "-shortest", out])
    segs.append(out)

seg_karta(karta("uvod", "Nový web, poptávka z mobilu a kancelář", ["Jak s webem pracuje zákazník, jak stolař a jaké další moduly může firma mít."]), "uvod")
seg_scena("zakaznik", telefon=True)
seg_scena("stolar")
seg_karta(karta("moduly", "Kancelář pro celou firmu", ["Zakázky · kalendář · materiál a sklad · náklady · cesty a auta · docházka · mzdy"]), "moduly")
seg_scena("kancelar")
seg_karta(karta("zaver", "Co dál", ["Schůzka se stolařem: ceník, fotky a souhlas s jejich použitím.", "Potom ostré napojení poptávek a skutečná vizualizace z AI."]), "zaver")

seznam = os.path.join(S, "seznam.txt")
open(seznam, "w", encoding="utf-8").write("".join(f"file '{s.replace(os.sep, '/')}'\n" for s in segs))
cil = sys.argv[1]
run(["ffmpeg", "-loglevel", "error", "-y", "-f", "concat", "-safe", "0", "-i", seznam, "-c", "copy", "-movflags", "+faststart", cil])
print("HOTOVO", cil, subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", cil]).decode().strip(), "s")
