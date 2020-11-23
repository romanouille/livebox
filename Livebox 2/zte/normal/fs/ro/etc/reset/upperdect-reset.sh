#!/bin/sh

if [ -e /var/run/upperdect.pid ]; then
	echo "Unpairing dect"
	kill -USR2 `cat /var/run/upperdect.pid`
else
	echo "Upperdect plugin PID not available"
fi
