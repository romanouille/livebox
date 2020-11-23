#!/bin/sh

logger -t wmbus -p daemon.error "wmbus ${ACTION} dongle - dongle id = $3_$4 (subsystem = ${SUBSYSTEM}, DEVPATH = ${DEVPATH})"
if [[ "${ACTION}" == "add" ]]; then
    DONGLE_ID=$3_$4
    logger -t wmbus -p daemon.error "wmbus add dongle serial tty = /dev/$1 - dongle id = $DONGLE_ID (subsystem = ${SUBSYSTEM}, DEVPATH = ${DEVPATH})"
    pcb_cli --daemon -w 300 "Wmbus.addDongle(\"/dev/$1\", \"$DONGLE_ID\")"
elif [[ "${ACTION}" == "remove" ]]; then
    DONGLE_ID=$3_$4
    logger -t wmbus -p daemon.error "wmbus delete dongle = $DONGLE_ID  (subsystem = ${SUBSYSTEM}, DEVPATH = ${DEVPATH})"
    pcb_cli --daemon -w 300 "Wmbus.deleteDongle(\"$DONGLE_ID\")"
else
    logger -t wmbus -p daemon.error "unknown action ${ACTION}"
    exit 1
fi
