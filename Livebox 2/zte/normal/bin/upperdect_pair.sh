#!/bin/sh

if [ -e /var/run/upperdect.pid ]; then
	echo "Start pairing dect"
	kill -USR1 `cat /var/run/upperdect.pid`
else
	echo "Upperdect plugin PID not available"
fi

