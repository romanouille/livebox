#!/bin/sh

help()
{
  echo "Usage: $0 [enable|disable]"
  exit 1
}

if [ -z "$1" ]
then
	help;
fi

if [ "$1" != "enable" -a "$1" != "disable" -a "$1" != "get" ]
then
	help;
fi

if [ "$1" = "get" ]
then
  if [ -f /mnt/jffs2/jffs2_3/fonske ]
  then
    echo "enabled"
  else
    echo "disabled"
  fi
  return
fi

echo "----------------------------------------------"
echo "! You requested to $1 telnet !    "
echo "----------------------------------------------"

if [ "$1" = "enable" ]
then
touch /mnt/jffs2/jffs2_3/fonske
else
/bin/rm -f /mnt/jffs2/jffs2_3/fonske
fi

/etc/init.d/telnetd stop >/dev/null 2>/dev/null
/etc/init.d/telnetd start >/dev/null 2>/dev/null

echo "The linux-telnetdaemon (23) has been ${1}d"
echo "The gatewayd-telnet (2323) will be ${1}d at the next reboot"
echo
echo "Please reboot the device to complete."

