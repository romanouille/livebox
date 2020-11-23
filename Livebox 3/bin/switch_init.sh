#!/bin/sh

SCRIPTS_DIR="/usr/lib/switch/init.d"


if [ -d $SCRIPTS_DIR ] ; then
	for script in $(find $SCRIPTS_DIR -type f -maxdepth 1 | sort) ; do
		[ -x $script ] && $script
	done
fi
