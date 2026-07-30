#!/bin/bash

H="$HOME/Library/Application Support/Code/User/History"

mkdir -p frontend/app/login
cp "$H/-153e1a98/G4ha.tsx" frontend/app/login/page.tsx

mkdir -p frontend/app/signup
cp "$H/1063ca89/aS5Q.tsx" frontend/app/signup/page.tsx

mkdir -p frontend/app/quiz/[id]
cp "$H/9c2bd10/QHoC.tsx" frontend/app/quiz/[id]/page.tsx

mkdir -p frontend/app/generate
cp "$H/5e6140cc/TTJU.tsx" frontend/app/generate/page.tsx

mkdir -p frontend/app/revise
cp "$H/59551ea9/4HSU.tsx" frontend/app/revise/page.tsx

mkdir -p frontend/app/practice
cp "$H/-73ba4c3a/AHL2.tsx" frontend/app/practice/page.tsx

mkdir -p frontend/app/practice/random
cp "$H/47bbf27a/dEue.tsx" frontend/app/practice/random/page.tsx

mkdir -p frontend/app/flashcards
cp "$H/-54ef772/YyyT.tsx" frontend/app/flashcards/page.tsx

mkdir -p frontend/app/flashcards/[topicId]
cp "$H/-12890b7f/9NHh.tsx" frontend/app/flashcards/[topicId]/page.tsx

mkdir -p frontend/app/team
cp "$H/-1d386b1c/GNKM.tsx" frontend/app/team/page.tsx

mkdir -p frontend/app/team/create
cp "$H/6b492783/jSx4.tsx" frontend/app/team/create/page.tsx

mkdir -p frontend/app/team/join
cp "$H/-71e3c36b/lvMJ.tsx" frontend/app/team/join/page.tsx

mkdir -p frontend/app/team/start
cp "$H/-9ab578f/2t2S.tsx" frontend/app/team/start/page.tsx

mkdir -p frontend/app/team/host/[code]
cp "$H/50542417/Bcne.tsx" frontend/app/team/host/[code]/page.tsx

mkdir -p frontend/app/team/play/[code]
cp "$H/1b617ba3/aArF.tsx" frontend/app/team/play/[code]/page.tsx

mkdir -p frontend/app/team/play/[roomId]
cp "$H/2b5af34c/3wrN.tsx" frontend/app/team/play/[roomId]/page.tsx

mkdir -p frontend/app/team/leaderboard/[code]
cp "$H/28b87858/zvBy.tsx" frontend/app/team/leaderboard/[code]/page.tsx

mkdir -p frontend/app/team/room/[code]
cp "$H/-49e1e836/LpA7.tsx" frontend/app/team/room/[code]/page.tsx

mkdir -p frontend/app/team/room/[code]/[roomId]
cp "$H/7cc38bad/WbI9.tsx" frontend/app/team/room/[code]/[roomId]/page.tsx

mkdir -p frontend/app/team/room/[roomId]
cp "$H/96121b3/a2eo.tsx" frontend/app/team/room/[roomId]/page.tsx

mkdir -p frontend/app/team/score/[roomId]
cp "$H/-604cc76a/vZSO.tsx" frontend/app/team/score/[roomId]/page.tsx

echo "Recovery complete!"
