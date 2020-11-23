#!/bin/sh

FUN_echo() {
if [ "$SILENT" != "y" ] ; then
	echo "$1"
fi
}

FUN_cancel() {
  echo "Reset FUN_canceled."
  exit $1
}

FUN_eval_arg() {
  if [ "$1" = "-y" ] ; then
    CONFIRM=n
  elif [ "$1" = "-silent" ] ; then
    SILENT=y
  fi
}

# start of script
CONFIRM=y
SILENT=n

while [ ! -z "$1" ]
do
  FUN_eval_arg "$1"
  shift
done

FUN_echo "----------------------------------------------"
FUN_echo "! You requested a reset to factory defaults. !"
FUN_echo "----------------------------------------------"


ID=`id -u`
if [ $ID -ne 0 ] ; then
  echo "You must be root to make this work !"
  FUN_cancel 1
fi

if [ "$CONFIRM" = "y" ] ; then
  echo -n "Are you sure about this ? [y/N] "
  read REPLY BIN
  if [ "$REPLY" != "y" ] ; then
    FUN_cancel 0
  fi
fi

BOOTMODE=`/usr/bin/bootmode get`
if [ -z "$BOOTMODE" ] ; then
  FUN_echo "Error: bootmode could not be detected."
  FUN_cancel 1
fi

FUN_echo -n "Executing reset ($BOOTMODE) .. "
# This will reset /etc /dl /home /root at next reboot
[ -e /cfg/system/version ] && rm -f /cfg/system/version

# Remove current configuration database
rm -f /etc/config/db_ready

# Remove rescue configuration files
rm -f /cfg/system/ppp.cfg
rm -f /cfg/system/cwmp.cfg
rm -f /cfg/system/cwmp_server.cfg
rm -f /cfg/system/nmc.cfg
rm -f /etc/config/admin-wm_settings.cfg

# Remove hgwcfg.usr
rm -f /etc/config/hgwcfg.usr
rm -f /etc/config/hgwcfg.isp

# Remove old data from the 7.2 middleware
rm -f /etc/config/updated.conf
rm -f /etc/config/cwmpd_upgrade_persistent.upd

# Remove BME crash counter file
rm -f /ext/BMEcrash.count

# Run external reset scripts
echo "Run reset scripts"
find /etc/reset/ -perm -100 | sed "1ds/$/ reset/" | sort | sh
sync

FUN_echo "Please reboot the device to complete."

