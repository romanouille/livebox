#!/bin/sh

WWAN_PID_FILE="/var/run/ppp-wwan.pid"

logger -t wwan "connect.sh called with ACTION=$ACTION"
		
if [ ! -e /var/run/wwan_connect.pid ] ; then
	echo $$ > /var/run/wwan_connect.pid

	case $ACTION in 
		add)
			[ -e $WWAN_PID_FILE ] && kill `head -n 1 $WWAN_PID_FILE`
			[ -e /var/lib/nemo/wwan/options.3g ] && pon wwan
			pcb_cli "NeMo.Intf.wwan.KeyStatus=Running"
			;;
		remove)
			[ -e $WWAN_PID_FILE ] && kill `head -n 1 $WWAN_PID_FILE`
			pcb_cli "NeMo.Intf.wwan.KeyStatus=None"
			;;
		reload)
			if [ "`pcb_cli -l NeMo.Intf.wwan.KeyStatus?`" == "Running" ]
			then
				[ -e $WWAN_PID_FILE ] && kill `head -n 1 $WWAN_PID_FILE`
				[ -e /var/lib/nemo/wwan/options.3g ] && pon wwan
			fi
			;;
	esac
			
	rm -f /var/run/wwan_connect.pid
fi
