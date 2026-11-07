# BOOMERANG product demo

- **Final:** `BOOMERANG_Product_Demo_90s.mp4` (83 seconds; filename retained from the requested deliverable)
- **Format:** vertical 9:16, 1080 × 1920, H.264, 30 fps, AAC audio, fast-start MP4
- **Thumbnail:** `BOOMERANG_thumbnail.png`
- **Editable source:** `render.py`, `timeline.json`, and `captures/`
- **Sound:** original synthesized electronic ambience, transitions and closing chime; no licensed music or voiceover

The app scenes use actual screenshots of the fictional Keller Elektro example dataset. The network scene is explicitly labeled **Product vision**. The demo shows manual scenario tests, human approval, an uncovered scenario, an expert answer, approval, and a successful retest of the same scenario. No live AI interview or shared account deployment is depicted.

## Re-render

Python 3.9+ with Pillow and imageio-ffmpeg is sufficient. No application dependency was added.

```sh
python3 -m venv /private/tmp/boomerang-video-venv
/private/tmp/boomerang-video-venv/bin/pip install pillow imageio-ffmpeg
cd /Users/star/Workspace/boomerang-mvp/output/boomerang-video
PYTHONPYCACHEPREFIX=/private/tmp/boomerang-pycache /private/tmp/boomerang-video-venv/bin/python render.py
```

Adjust timing and captions in `timeline.json`. Per-screen pan ranges are in `render.py`. The renderer uses macOS Avenir Next and Arial fonts; substitute installed font paths on another platform.

## Verification

The completed MP4 was decoded in full with FFmpeg. `verification.log` records the stream metadata and decode result. Output: 2,490 video frames, 83 seconds, 1080 × 1920 at 30 fps, H.264 High, yuv420p, AAC audio. Representative rendered frames were visually inspected.
