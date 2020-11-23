#!/bin/sh

MDEV=$1
ACTION=$2
DEVPATH=$3
SUBSYSTEM=$4
MODALIAS=$5
FIRMWARE=$6

if [ "$ACTION" = "add" ] ; then
	if [ $MODALIAS  ] ; then
		if  ! [ -f /var/run/usb_modeswitch.pid ] ; then
			echo $$ >>//var/run/usb_modeswitch.pid
			VENDOR=`echo $MODALIAS | sed 's/.*v\([0-9A-F]\{4\}\).*/\1/' | sed 'y/ABCDEF/abcdef/'`
			PRODUCT=`echo $MODALIAS | sed 's/.*p\([0-9A-F]\{4\}\).*/\1/' | sed 'y/ABCDEF/abcdef/'`
			USB_MODESWITCHDIR=/etc/usb_modeswitch.d
			FILENAME=${VENDOR}:${PRODUCT}
			FILE=$USB_MODESWITCHDIR/$FILENAME

			if [ -f $FILE ] ; then
				usb_modeswitch -I -W -c $FILE
			fi
			rm -f /var/run/usb_modeswitch.pid
		fi
	fi
fi
