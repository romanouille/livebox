#!/bin/sh
SCHEME=$1
DEVNAME=$2
ACTION=$3
PHYSDEVPATH=$4
LABEL=Orange
LINKDEV="/dev/${DEVNAME}1"
OFFSET=1048576

has_partitions() {
    RET=1
    BLOCK=$(ls /sys/block/$1/ | grep $1)
    if [[ -z "$BLOCK" ]]; then
        RET=0
    fi
    return "$RET"
}

if [[ "${SCHEME}" != "kernel" ]]; then
    logger -t storage -p daemon.error "not a kernel notification"
    exit 1
fi

if [[ ${#DEVNAME} != 3 ]]; then
    logger -t storage -p daemon.error "not a device notification"
    exit 1
fi

if [[ "${ACTION}" == "Plugged" ]]; then

    has_partitions $DEVNAME
    RET=$?
    if [ "$RET" == 1 ]; then
        logger -t storage -p daemon.info "not an orange obfuscated"
        exit 1
    fi

    if [[ -f $LINKDEV ]]; then
        logger -t storage -p daemon.info "obfuscated device or already handled"
        exit 1
    fi

    AVAILABLELOOP="$(losetup -f)"
    if [ "$?" != "/dev/loop"* ]; then
        logger -t storage -p daemon.error "couldn't get an available loop device"
        exit 1
    fi

    losetup -o $OFFSET $AVAILABLELOOP /dev/$DEVNAME
    if [ "$?" != "0" ] ; then
        logger -t storage -p daemon.error "couldn't bind with loop device : ${AVAILABLELOOP}"
        exit 1
    fi

    blkid | while read LINE
    do
        FOUND="$(echo "${LINE}" | grep $AVAILABLELOOP)"
        if [[ "${FOUND}" != "" ]]; then
            ARRAY=$(echo $LINE | tr " " "\n")
            for MEMBER in $ARRAY;
            do
                if [[ "${MEMBER}" == "LABEL=\"${LABEL}\"" ]]; then

                    ln -s "${AVAILABLELOOP}" "${LINKDEV}"
                    SYSBLOCKPATH="/sys/block/${AVAILABLELOOP:5}"

                    URI="${SCHEME}://${LINKDEV}?name=${DEVNAME}1&sysblockpath=${SYSBLOCKPATH}&sysdevpath=/sys${PHYSDEVPATH}&tag=obfuscated&flag=datahub"
                    logger -t storage -p daemon.info "[${ACTION}] generated plugin uri $URI"
                    pcb_cli "StorageService.device${ACTION}(\"${URI}\")"
                    exit 0
                fi
            done
        fi
    done
fi

if [[ "${ACTION}" == "Unplugged" ]]; then

    USEDLOOP=$(readlink $LINKDEV)
    if [[ -z "$USEDLOOP" ]]; then
        logger -t storage -p daemon.info "[${ACTION}] ${LINKDEV} is not a link"
        exit 1
    fi
    SYSBLOCKPATH="/sys/block/${USEDLOOP:5}"

    URI="${SCHEME}://${LINKDEV}?name=${DEVNAME}1&sysblockpath=${SYSBLOCKPATH}&sysdevpath=/sys${PHYSDEVPATH}&tag=obfuscated&flag=datahub"
    logger -t storage -p daemon.info "generated plugin uri $URI"
    pcb_cli "StorageService.device${ACTION}(\"${URI}\")"

    sleep 2 #loop device takes a bit of time before losetup -d can be done
    rm -f $LINKDEV
    losetup -d "${USEDLOOP}" > /dev/console 2>&1
fi

