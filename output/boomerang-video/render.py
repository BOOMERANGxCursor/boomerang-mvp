#!/usr/bin/env python3
"""Editable BOOMERANG demo renderer. Requires Pillow and imageio-ffmpeg.
Run: python render.py [--preview] [--silent]
Screenshots belong in captures/. Timeline and copy are editable in timeline.json.
"""
import json, math, os, random, subprocess, sys, time, wave, struct
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parent
W,H=1080,1920
FPS=30
BLUE=(77,163,255); WHITE=(245,247,250); MUTED=(151,169,193)
FONT='/System/Library/Fonts/Avenir Next.ttc'
BOLD='/System/Library/Fonts/Supplemental/Arial Bold.ttf'
REG='/System/Library/Fonts/Supplemental/Arial.ttf'
FONTS={}
def font(n,bold=False):
    key=(n,bold)
    if key not in FONTS: FONTS[key]=ImageFont.truetype(BOLD if bold else FONT,n)
    return FONTS[key]
def clamp(x): return max(0,min(1,x))
def smooth(x): x=clamp(x); return x*x*(3-2*x)
def text(draw,xy,s,size=40,fill=WHITE,bold=False,spacing=10):
    draw.multiline_text(xy,s,font=font(size,bold),fill=fill,spacing=spacing)
def background():
    im=Image.new('RGB',(W,H)); d=ImageDraw.Draw(im)
    for y in range(H):
        f=y/H
        d.line((0,y,W,y),fill=(int(9+4*f),int(15+7*f),int(27+12*f)))
    # Fine grid: low contrast makes the composition feel precise without noise.
    for x in range(80,W,100): d.line((x,0,x,H),fill=(18,29,45),width=1)
    for y in range(80,H,100): d.line((0,y,W,y),fill=(18,29,45),width=1)
    return im
BASE=background()
def boomerang(d,cx,cy,r,t,alpha=1):
    # Open orbit with a luminous leading edge and arrow-like boomerang tip.
    box=(cx-r,cy-r,cx+r,cy+r)
    start=-155+t*23
    for k in range(7):
        col=tuple(int(v*(.2+.8*k/6)*alpha) for v in BLUE)
        d.arc(box,start+12*k,start+12*(k+1)+1,fill=col,width=7)
    a=math.radians(start+84); px=cx+r*math.cos(a); py=cy+r*math.sin(a)
    dx=-math.sin(a);dy=math.cos(a)
    d.line((px-25*dx+15*math.cos(a),py-25*dy+15*math.sin(a),px,py,px-25*dx-15*math.cos(a),py-25*dy-15*math.sin(a)),fill=BLUE,width=7)

def common(im,s,local):
    d=ImageDraw.Draw(im)
    text(d,(80,64),'BOOMERANG',26,WHITE,True)
    d.ellipse((954,68,970,84),fill=BLUE)
    text(d,(80,1770),'KNOWLEDGE, IN MOTION',21,MUTED)
    d.line((80,1844,1000,1844),fill=(43,58,78),width=2)
    d.line((80,1844,80+920*clamp((s['start']+local)/83),1844),fill=BLUE,width=3)
    text(d,(923,1767),f"{int(s['start']+local):02d}",23,MUTED)
    return d

def scene_base(s):
    im=BASE.copy();d=ImageDraw.Draw(im)
    if s.get('kind') in ('intro','network'): return im
    text(d,(80,168),s['eyebrow'],24,BLUE,True)
    text(d,(76,231),s['title'],72,WHITE,True,6)
    text(d,(80,423),s['subtitle'],29,MUTED)
    text(d,(90,1666),'EXAMPLE DATASET  •  ACTUAL APP',21,MUTED)
    return im

def prepare(s):
    p=ROOT/'captures'/s.get('asset','')
    if not s.get('asset'): return None
    if not p.is_file(): raise FileNotFoundError(p)
    img=Image.open(p).convert('RGB')
    # Display the app at a generous readable width, preserving its true proportions.
    width=884
    nh=round(img.height*width/img.width)
    return img.resize((width,nh),Image.Resampling.LANCZOS)

TIMELINE=json.loads((ROOT/'timeline.json').read_text())
STATIC=[scene_base(s) for s in TIMELINE]
SHOTS=[]

def render_scene(i,t):
    s=TIMELINE[i];duration=s['end']-s['start'];p=clamp(t/duration)
    im=STATIC[i].copy();d=common(im,s,t)
    kind=s.get('kind')
    if kind in ('intro','network'):
        if kind=='intro':
            text(d,(80,230),s['eyebrow'],27,BLUE,True)
            rise=round(24*(1-smooth(t/1.2)))
            text(d,(74,324+rise),s['title'],105,WHITE,True,10)
            text(d,(80,622),s['subtitle'],37,MUTED,False,13)
            cx,cy=540,1210
            for n in range(3):
                d.ellipse((cx-220-n*70,cy-220-n*70,cx+220+n*70,cy+220+n*70),outline=(24,43,65),width=2)
            boomerang(d,cx,cy,260,t)
            text(d,(355,1172),'RETURN',55,WHITE,True)
            text(d,(335,1250),'WITH KNOWLEDGE',23,BLUE,True)
            text(d,(80,1576),'Experience becomes a living resource.',31,MUTED)
        else:
            text(d,(80,173),s['eyebrow'],24,BLUE,True)
            text(d,(76,253),s['title'],82,WHITE,True,9)
            text(d,(80,478),s['subtitle'],31,MUTED)
            cx,cy=540,1060
            nodes=[(cx,cy),(220,810),(856,810),(180,1270),(895,1270),(540,1450)]
            for j,(x,y) in enumerate(nodes[1:]):
                a=smooth((t-.3-j*.25)/1.6)
                d.line((cx,cy,cx+(x-cx)*a,cy+(y-cy)*a),fill=(46,93,142),width=3)
                pulse=(t*.28+j*.19)%1
                xx=cx+(x-cx)*pulse; yy=cy+(y-cy)*pulse
                d.ellipse((xx-6,yy-6,xx+6,yy+6),fill=BLUE)
            for j,(x,y) in enumerate(nodes):
                r=78 if j==0 else 55
                d.ellipse((x-r,y-r,x+r,y+r),fill=(14,32,53),outline=BLUE,width=3)
                d.ellipse((x-13,y-24,x+13,y+2),fill=WHITE)
                d.rounded_rectangle((x-24,y+10,x+24,y+34),radius=16,fill=WHITE)
            text(d,(460,1180),'EXPERT',24,BLUE,True)
            text(d,(80,1620),'Conceptual team knowledge network',25,MUTED)
    else:
        shot=SHOTS[i]
        x,y,fw,fh=98,548,884,1084
        # A subtle vertical pan reveals longer app screens without shrinking text.
        maxoff=max(0,shot.height-fh)
        ranges={'01-profile.png':(320,550),'02-sources.png':(510,800),'03-review.png':(440,650),'04-approved.png':(440,650),'05-test.png':(530,625),'06-correct.png':(850,1040),'07-gap.png':(590,760),'08-answer.png':(620,1050),'09-answer-approved.png':(640,1050),'10-ready.png':(350,750),'11-gap-retest-correct.png':(1000,1200)}
        lo,hi=ranges.get(s.get('asset'),(300,800))
        scale=884/520
        off=round(min(maxoff,lo*scale)+(min(maxoff,hi*scale)-min(maxoff,lo*scale))*smooth(p))
        crop=shot.crop((0,off,fw,min(shot.height,off+fh)))
        panel=Image.new('RGB',(fw,fh),(247,247,247));panel.paste(crop,(0,0))
        mask=Image.new('L',(fw,fh),0);ImageDraw.Draw(mask).rounded_rectangle((0,0,fw-1,fh-1),radius=26,fill=255)
        # Float by just a few pixels; keeps UI steady enough to inspect.
        dy=round(6*math.sin(p*math.pi))
        d.rounded_rectangle((x-10,y-10+dy,x+fw+10,y+fh+10+dy),radius=35,fill=(30,43,61),outline=(64,85,110),width=2)
        im.paste(panel,(x,y+dy),mask)
        if kind=='outro' and t>1.8:
            a=smooth((t-1.8)/1.1)
            overlay=Image.new('RGB',(W,H),(8,16,29))
            od=ImageDraw.Draw(overlay)
            text(od,(80,185),'BOOMERANG',27,BLUE,True)
            text(od,(74,355),'PEOPLE LEAVE.\nKNOWLEDGE\nCOMES BACK.',80,WHITE,True,10)
            boomerang(od,540,1115,245,t)
            text(od,(294,1076),'BOOMERANG',46,WHITE,True)
            text(od,(80,1510),'Capture. Verify. Test. Improve.',37,MUTED)
            text(od,(80,1620),'Built around human expertise.',31,WHITE)
            common(overlay,s,t)
            im=Image.blend(im,overlay,a)
    return im

def audio(path):
    # Original restrained electronic sound bed, generated from oscillators.
    rate=24000;duration=83;frames=bytearray();rng=random.Random(19)
    transitions=[s['start'] for s in TIMELINE]
    for n in range(rate*duration):
        t=n/rate;fade=min(1,t/2,(duration-t)/3)
        val=.018*math.sin(2*math.pi*110*t)+.010*math.sin(2*math.pi*164.81*t)+.008*math.sin(2*math.pi*220*t)
        val*=.7+.3*math.sin(t*.45)
        for start in transitions:
            dt=t-start
            if 0<dt<.65:
                val+=(rng.random()*2-1)*.035*math.sin(math.pi*dt/.65)
        if t>78:
            dt=t-78
            val+=.035*math.exp(-dt*.9)*(math.sin(2*math.pi*440*dt)+.5*math.sin(2*math.pi*659.25*dt))
        frames.extend(struct.pack('<h',int(max(-1,min(1,val*fade))*32767)))
    with wave.open(str(path),'wb') as f:
        f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate);f.writeframes(frames)

def main():
    global SHOTS
    SHOTS=[prepare(s) for s in TIMELINE]
    if '--preview' in sys.argv:
        for i,s in enumerate(TIMELINE): render_scene(i,min(2,s['end']-s['start']-.2)).resize((540,960)).save(ROOT/f'preview-{i:02}.jpg')
        render_scene(0,3).save(ROOT/'BOOMERANG_thumbnail.png');return
    ff=imageio_ffmpeg.get_ffmpeg_exe();temp=ROOT/'video-silent.mp4'
    cmd=[ff,'-y','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','veryfast','-crf','19','-pix_fmt','yuv420p','-movflags','+faststart',str(temp)]
    proc=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=open(ROOT/'render.log','w'))
    begin=time.time()
    for i,s in enumerate(TIMELINE):
        print(f"Rendering scene {i+1}/{len(TIMELINE)}: {s['eyebrow']}",flush=True)
        total=round((s['end']-s['start'])*FPS)
        for frame in range(total):
            im=render_scene(i,frame/FPS)
            # A brief dark dip makes all chapter cuts deliberate.
            fade=min(1,frame/7,(total-1-frame)/7)
            if fade<1: im=Image.blend(BASE,im,.6+.4*fade)
            proc.stdin.write(im.tobytes())
    proc.stdin.close();rc=proc.wait()
    if rc: raise RuntimeError(f'ffmpeg failed: {rc}; see render.log')
    audio(ROOT/'original-sound.wav')
    out=ROOT/'BOOMERANG_Product_Demo_90s.mp4'
    subprocess.run([ff,'-y','-i',str(temp),'-i',str(ROOT/'original-sound.wav'),'-c:v','copy','-c:a','aac','-b:a','160k','-shortest','-movflags','+faststart',str(out)],check=True,stderr=open(ROOT/'mux.log','w'))
    render_scene(0,3).save(ROOT/'BOOMERANG_thumbnail.png')
    print(f'DONE {out} in {time.time()-begin:.1f}s',flush=True)
if __name__=='__main__':main()
