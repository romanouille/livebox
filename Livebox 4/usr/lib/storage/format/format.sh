#!/bin/sh

# global variables
TRACES=/dev/null
SCHEME=kernel
LABEL=Orange
ACTION=Plugged

# getting needed variables from input
LINKDEV="${1}1"
DEVNAME=${LINKDEV:5}
DEVNAME=${DEVNAME%?}
FULLDEVNAME="/dev/${DEVNAME}"
PHYSDEVPATH="/block/${DEVNAME}"

# checking if we come from a obfuscated device or not
# if LINKDEV is a symlink, then we are on obfuscated
OBFUSCATED="yes"
if [ -z $(readlink ${LINKDEV}) ] ; then
    OBFUSCATED="no"
fi

# devloop takes time to be considered unmounted
sleep 1

if [ "${OBFUSCATED}" != "yes" ] ; then
   echo "not an obfuscated device" > $TRACES

# get the first available dev loop
   AVAILABLELOOP="$(losetup -f)"
   if [ "$?" != "/dev/loop"* ]; then
      echo "no available loop device" > $TRACES
        exit 1
    fi

# suppress beginning of the disk
    dd if=/dev/zero of=$FULLDEVNAME bs=3048576 count=1
    if [ "$?" != "0" ] ; then
        echo "dd failed" > $TRACES
        exit 1
    fi

# create new partition table
fdisk -u -b 2048 -C 512 $FULLDEVNAME << EOF
o
c
n
p
1
2048

w
EOF

   sleep 2

# create new partition
   yes 2>/dev/null | mkfs.ext4 -L Orange $LINKDEV
   if [ "$?" != "0" ] ; then
      echo "mkfs.ext4 failed" > $TRACES
      exit 1
   fi

# clear partition table
   dd if=/dev/zero of=$FULLDEVNAME bs=1048576 count=1
   if [ "$?" != "0" ] ; then
      echo "dd failed" > $TRACES
      exit 1
   fi

# attach available dev loop
   losetup -o 1048576 $AVAILABLELOOP $FULLDEVNAME
   if [ "$?" != "0" ] ; then
      echo "couldn't bind with loop device : ${AVAILABLELOOP}" > $TRACES
      exit 1
   fi

# remove all partitions mknodes
   find /dev/ ! -name "${DEVNAME}" -name "${DEVNAME}"* | xargs rm

else

   echo "${LINKDEV} is on an obfuscated device" > $TRACES

# get existing dev loop
   AVAILABLELOOP=$(readlink ${LINKDEV})
   if [ -z "$AVAILABLELOOP" ] ; then
      exit 1
   fi

# sometimes loopback is still flagged in use
   sleep 2

# create new partition
   yes 2>/dev/null | mkfs.ext4 -L Orange $AVAILABLELOOP
   if [ "$?" != "0" ] ; then
      echo "mkfs.ext4 failed" > $TRACES
      exit 1
   fi

# clear partition table
   dd if=/dev/zero of=$FULLDEVNAME bs=1048576 count=1
   if [ "$?" != "0" ] ; then
      echo "dd failed" > $TRACES
      exit 1
   fi

# remove all partitions mknodes
   find /dev/ ! -name "${DEVNAME}" -name "${DEVNAME}"* | xargs rm

fi

# build DevicePlugged command and trigger it
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
                    echo "[${ACTION}] generated plugin uri $URI" > $TRACES
                    pcb_cli --daemon "StorageService.device${ACTION}(\"${URI}\")"
                    exit 0
                fi
            done
        fi
    done

exit 0

