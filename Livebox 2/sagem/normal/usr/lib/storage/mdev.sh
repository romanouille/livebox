#!/bin/sh

if [[ "${ACTION}" == "add" ]]; then
    ACTION=Plugged
elif [[ "${ACTION}" == "remove" ]]; then
    ACTION=Unplugged
else
    logger -t storage -p daemon.Error "unknown action ${ACTION}"
    exit 1
fi

if [[ -z "${DEVPATH}" ]]; then
    if [[ ${#MDEV} == 3 ]]; then
        DEVPATH=/block/${MDEV}
    else
        DEVPATH=/block/${MDEV:0:3}/${MDEV}
    fi
fi

if [[ -z "${PHYSDEVPATH}" ]]; then
    PHYSDEVPATH=/block/${MDEV:0:3}
fi

URI="kernel:///dev/${MDEV}?name=${MDEV}&sysblockpath=/sys${DEVPATH}&sysdevpath=/sys${PHYSDEVPATH}"
pcb_cli --daemon -w 30 "StorageService.device${ACTION}(\"${URI}\")"
