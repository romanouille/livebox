#!/bin/sh

FUN_cancel() {
  echo "Reset FUN_canceled."
  exit $1 
}

FUN_eval_arg() {
  if [ "$1" = "-y" ] ; then
    CONFIRM=n
  elif [ "$1" = "-prepop" ] ; then
    COPY_PREPOP_DB=y
  fi  
}

# start of script
CONFIRM=y
COPY_PREPOP_DB=n

while [ ! -z "$1" ]
do
  FUN_eval_arg "$1"
  shift
done

echo "----------------------------------------------"
echo "! You requested a reset to factory defaults. !"
echo "----------------------------------------------"

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
  echo "Error: bootmode could not be detected."
  FUN_cancel 1
fi

echo -n "Executing reset ($BOOTMODE) .. "
# This will reset /etc /dl /home /root at next reboot
[ -e /mnt/jffs2/jffs2_3/$BOOTMODE/version ] && rm -f /mnt/jffs2/jffs2_3/$BOOTMODE/version

# Remove current configuration database
USERDB=/etc/config/mbus.dat
[ -f /fs/common/config/dbpath.cfg ] && USERDB=`cat /fs/common/config/dbpath.cfg | cut -d ' ' -f 1`
[ -f "$USERDB" ] && rm -f "$USERDB"
rm -f /etc/config/db_ready
[ -e /etc/defaults/wifi-community/wfc-persistent.conf ] && cp /etc/defaults/wifi-community/wfc-persistent.conf /etc/wifi-community/
if [ "$COPY_PREPOP_DB" = "y" ] ; then
  # Copy prepopulated database when available
  [ -e /fs/common/config/mbus_sah.dat ] && cp -fa /fs/common/config/mbus_sah.dat "$USERDB"
else
  touch /etc/do_import
fi

# Remove rescue configuration files
rm -f /etc/ppp.cfg
rm -f /etc/cwmp.cfg
rm -f /etc/cwmp_server.cfg
rm -f /etc/nmc.cfg

# Remove persistent voice configuration
#rm -f /etc/config/voip.conf
#rm -f /etc/config/local_config.xml

# Remove hgwcfg.usr
rm -f /etc/config/hgwcfg.usr
rm -f /etc/config/hgwcfg.isp

# Remove old data from the 7.2 middleware
rm -f /etc/mbus_ng.dat
rm -f /etc/config/updated.conf
rm -f /etc/config/cwmpd_upgrade_persistent.upd

# Remove BME crash counter file
rm -f /ext/BMEcrash.count

# Run external reset scripts
find /etc/reset/ -perm -100 | sed "1ds/$/ reset/" | sh

### disable telnet
###/usr/sbin/starttelnet disable
###echo "done."

echo "Please reboot the device to complete."

