#!/bin/sh

mkdir -p /var/lib/nemo/wwan

logger -t wwan "config.sh called with USER=$USER PASS=$PASS PIN=$PIN APN=$APN"

if [ -z "$USER" -o -z "$APN" -o -z "$PASS" -o -z "$PIN" ];
then
	rm -f /var/lib/nemo/wwan/options.3g
else
	sed \
		-e "s/%USER%/$USER/" \
		-e "s/%PASS%/$PASS/" \
		< /usr/lib/wwan/options.3g.template \
		> /var/lib/nemo/wwan/options.3g
	sed \
		-e "s/%PIN%/$PIN/" \
		-e "s/%APN%/$APN/" \
		< /usr/lib/wwan/chatscript.template \
		> /var/lib/nemo/wwan/chatscript
fi


