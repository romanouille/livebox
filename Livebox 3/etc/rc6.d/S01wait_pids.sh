#!/bin/sh

# Verifies if there are processes that must not be interrupted and waits for them to finish. 
# Each process that wants to run uniterrupted must create a file with the name equal to its PID in the 
# directory /tmp/dont_reboot

WAIT_DIR=/tmp/dont_reboot

[ -d $WAIT_DIR ] || exit

# Grace period. When this expiresi we stop waiting, no matter who is still running.
COUNTER=20

cd $WAIT_DIR
ls | while read WAIT_PID ; do 	
	# get list of PIDS of all running processes
	echo 
	echo -n Waiting for PID $WAIT_PID ...
	ps | sed 's/^ *// ; s/ .*//' | grep $WAIT_PID 2>&1 >/dev/null
	while [ $? -eq 0 ] ; do 		
		echo -n .
		[ $COUNTER -gt 0 ] || exit
		sleep 1
		COUNTER=$(expr $COUNTER - 1)
		ps | sed 's/^ *// ; s/ .*//' | grep $WAIT_PID 2>&1 >/dev/null
	done
done
