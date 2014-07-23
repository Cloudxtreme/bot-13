#!/bin/bash
git pull
npm install
kill $(ps aux | grep 'hubot' | grep -v "grep" | awk '{print $2}')
nohup ./start.sh &
