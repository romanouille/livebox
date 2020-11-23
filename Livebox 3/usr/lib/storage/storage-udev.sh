#!/bin/sh
. /usr/lib/storage/preprocess/preprocess.sh

postprocess(){
    POSTPROCESSLOCATION="/usr/lib/storage/postprocess/"
    POSTPROCESS="$POSTPROCESSLOCATION/*.sh"
    if [ -d $POSTPROCESSLOCATION ]; then
        for each in $POSTPROCESS; do $each $1 $2 $3 $4; done;
    fi
}

if [ $# -ne 1 ] ; then
    echo "Provide of device name as the first argument."
    exit 1
fi

# script is started with 1 argument, the device name
DEVNAME=$1

if [[ "${ACTION}" == "add" ]]; then
    ACTION=Plugged
elif [[ "${ACTION}" == "remove" ]]; then
    ACTION=Unplugged
else
    logger -t storage -p daemon.error "unknown action ${ACTION}"
    exit 1
fi

# All USB devices, determining their interfaces to select PTP/MTP devices among them
if [ "$SUBSYSTEM" = "usb" ]; then
    if [[ -z "${INTERFACE}" ]]; then
        DEV=$(basename $DEVPATH)
        if [[ -z "$PHYSDEVPATH" ]] ; then
            TYPEPATH=$DEVPATH
        else
            TYPEPATH=$PHYSDEVPATH
        fi

        SYSFSDEVICEPATH="/sys/$TYPEPATH"
        INTERFACECLASS="$(cat $SYSFSDEVICEPATH/*/bInterfaceClass 2>/dev/null)"
        if [[ -z "$INTERFACECLASS" ]]; then
            #location changed on newer kernels
            SYSFSDEVICEPATH="/sys/$TYPEPATH/device"
            INTERFACECLASS="$(cat $SYSFSDEVICEPATH/*/bInterfaceClass 2>/dev/null)"
        fi
        INTERFACESUBCLASS="$(cat $SYSFSDEVICEPATH/*/bInterfaceSubClass 2>/dev/null)"
        INTERFACEPROTOCOL="$(cat $SYSFSDEVICEPATH/*/bInterfaceProtocol 2>/dev/null)"
        INTERFACE="$(printf "$INTERFACECLASS/$INTERFACESUBCLASS/$INTERFACEPROTOCOL" 2>/dev/null)"
    fi

    FILE=${DEVPATH##*/}

    if [[ ${ACTION} = Plugged -a "$INTERFACE" = "06/01/01" ]] ||
       [[ ${ACTION} = Plugged -a "$INTERFACE" = "6/1/1" ]] ||
       [[ ${ACTION} = Plugged -a "$INTERFACE" = "ff/ff/00" ]] ||
       [[ ${ACTION} = Plugged -a "$INTERFACE" = "255/255/0" ]]; then
            touch /var/usbmount/${FILE}
            SCHEME="ptp"
    fi

    if [[ ${ACTION} = Unplugged && -f /var/usbmount/${FILE} ]]; then
            rm -f /var/usbmount/${FILE}
            SCHEME="ptp"
    fi
else
# All /dev messages
    if ! echo "${DEVPATH}" | grep -q ^/block; then
        DEVPATH=""
    fi

    if [[ -z "${DEVPATH}" ]]; then
        if [[ ${#DEVNAME} == 3 ]]; then
            DEVPATH=/block/${DEVNAME}
        else
            DEVPATH=/block/${DEVNAME:0:3}/${DEVNAME}
        fi
    fi

    if [[ -z "${PHYSDEVPATH}" ]]; then
        PHYSDEVPATH=/block/${DEVNAME:0:3}
    fi
    SCHEME="kernel"
fi

if [[ -z "${SCHEME}" ]]; then
    logger -t storage -p daemon.error "empty scheme"
    exit 1
fi

URI="${SCHEME}:///dev/${DEVNAME}?name=${DEVNAME}&sysblockpath=/sys${DEVPATH}&sysdevpath=/sys${PHYSDEVPATH}"
preprocess $URI "${SCHEME}" "${DEVNAME}" "${ACTION}" "${PHYSDEVPATH}"

if [ -e /var/run/pcb_sys ]; then
    ACTIONRESULT=$(pcb_cli "StorageService.device${ACTION}(\"${URI}\")")
    if [[ "${ACTIONRESULT}" == "StorageService.device${ACTION}() returns 1" ]]; then
        postprocess "${SCHEME}" "${DEVNAME}" "${ACTION}" "${PHYSDEVPATH}"
    fi
fi
