#!/bin/sh

plugboot() {
	for PHYSDEV in $(find /sys/block -name 'sd*' | grep -v '/sys/block/.*/.*'); do
		logger -t storage "PHYSDEV='${PHYSDEV}'"
		PHYSDEV="$(basename ${PHYSDEV})"
		ACTION=add MDEV="${PHYSDEV}" /usr/lib/storage/mdev.sh
		for LOGDEV in $(find "/sys/block/${PHYSDEV}/" -type d -name "${PHYSDEV}*" | grep -v '/sys/block/${PHYSDEV}/.*/.*' | tail -n +2); do
			logger -t storage "LOGDEV='${LOGDEV}'"
			ACTION=add MDEV="$(basename ${LOGDEV})" /usr/lib/storage/mdev.sh
		done
	done
}

pcb_cli --pidfile /tmp/storage-coldplug -l 'StorageService?0{Enable}&' 2>&1 | while read line;
do
	if [ $line = "1" ]; then
		if [ -e /sbin/mdev ]; then
			plugboot;
		else
			udevadm trigger --action=add --subsystem-match=block;
		fi;
		kill $(cat /tmp/storage-coldplug); 
	fi;
done


