#!/bin/sh
PIDWFC_PLUGIN="/var/run/wificom.pid"
WFC_PLUGIN="/bin/pcb_plugin -vv -n wificom -c /usr/lib/wificom/wificom.odl"

start() {

    if [ -e ${PIDWFC_PLUGIN} ]; then
        echo "Wifi Community plugin already started"
    else
        ${WFC_PLUGIN};
    fi
}

stop() {
    if [ -e ${PIDWFC_PLUGIN} ]; then
        echo "Stopping Wifi Community plug-in"
	echo "[EXTERN;NONE;EXIT]" > /var/run/wacd.updates
        kill $(cat ${PIDWFC_PLUGIN});
    else
        echo "Wifi Community plugin already stopped"
    fi
}

restart() {
    stop
    while test -e ${PIDWFC_PLUGIN}; do
        sleep 1
    done
    start
}

case $1 in
    start)
        start
	;;
    stop)
        stop
	;;
    restart)
        restart
        ;;
    backup)
	if [ -e $PIDWFC_PLUGIN ] ; then
	    pcb_cli "wificommunity.export($2)"
	else
	    echo "Wifi Community plugin is not running, impossible to make a backup"
	fi
	;;
    restore)
	    touch /tmp/wfc_hgwcfg_restore
	;;
    reset)
	    rm -f /etc/config/wificom.cfg
	;;
    *)
    ;;
esac

