#!/bin/bash
while (true) do
	if ps aux | grep "node" | grep "hubot" | grep -v grep > /dev/null
	then
		echo -n ""
	else
		date
		echo "process not exists , rerun "
		git pull
		npm install
		nohup ./start.sh &
	fi
	sleep 3
done
