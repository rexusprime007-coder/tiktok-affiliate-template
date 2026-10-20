#!/usr/bin/env bash
# Generates the built-in sound effects (synthesized with ffmpeg, so they're
# royalty-free). Re-run to regenerate: bash scripts/make-sfx.sh
set -euo pipefail
cd "$(dirname "$0")/../public/sfx"
q="-y -loglevel error"
o="-ar 44100 -ac 2"

# whoosh: noise swept through a band-pass, fading in and out
ffmpeg $q -f lavfi -i "anoisesrc=d=0.45:c=pink:a=0.9" \
  -af "bandpass=f=1800:w=1600,afade=t=in:d=0.25:curve=exp,afade=t=out:st=0.25:d=0.2,volume=2.2" $o whoosh.wav
# boom: deep sine drop with a long tail (hook impact)
ffmpeg $q -f lavfi -i "aevalsrc='0.9*sin(2*PI*(55+90*exp(-8*t))*t)*exp(-3.2*t)':d=1.2" $o boom.wav
# pop: quick pitched blip (stickers / emoji)
ffmpeg $q -f lavfi -i "aevalsrc='0.8*sin(2*PI*(900-600*t*10)*t)*exp(-28*t)':d=0.15" $o pop.wav
# ding: bell-like two-partial chime (callouts)
ffmpeg $q -f lavfi -i "aevalsrc='0.5*sin(2*PI*1320*t)*exp(-5*t)+0.3*sin(2*PI*2640*t)*exp(-7*t)':d=0.9" $o ding.wav
# cash: two bright blips (price reveals)
ffmpeg $q -f lavfi -i "aevalsrc='0.5*sin(2*PI*1760*t)*exp(-30*t)+0.5*between(t,0.09,0.4)*sin(2*PI*2349*(t-0.09))*exp(-12*(t-0.09))':d=0.5" $o cash.wav
# tick: tiny click (countdown)
ffmpeg $q -f lavfi -i "aevalsrc='0.6*sin(2*PI*2500*t)*exp(-90*t)':d=0.06" $o tick.wav
# riser: rising tone into the CTA
ffmpeg $q -f lavfi -i "aevalsrc='0.35*sin(2*PI*(200+900*t*t)*t)*min(1,t*2)':d=0.9" -af "afade=t=out:st=0.8:d=0.1" $o riser.wav
echo "SFX written to public/sfx/"
