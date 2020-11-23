#!/bin/sh

PID_PLUGIN="/var/run/voipaad_plugin.pid"

start() {
    if [ -e ${PID_PLUGIN} ]; then
        logger -t voipaad_plugin "voipaad already started"
    else
        logger -t voipaad_plugin "Starting voipaad"
        sahenv -f /etc/environment pcb_plugin -n voipaad_plugin -c /usr/lib/voipaad/voipaad.odl -vv
    fi
}

stop() {
    logger -t voipaad_plugin "Stopping voipaad"
    if [ -e $PID_PLUGIN ] ; then 
        kill $(cat $PID_PLUGIN)
    else 
        logger -t voipaad_plugin "voipaad not running"
    fi
}

restart() {
    stop
    logger -t voipaad_plugin "Restarting voipaad"
    while test -e ${PID_PLUGIN}; do
        sleep 1
            done

    start
}

status() {
    if [ -e $PID_PLUGIN ] ; then 
        echo "voipaad status: RUNNING"
    else 
        echo "voipaad status: NOT RUNNING"
    fi 
}

reset() {
    rm -f /etc/config/voip.conf
    rm -f /etc/config/local_config.xml
    pcb_cli "VoiceActivation.CONFVERSION=0"
    pcb_cli "VoiceActivation.CPE_PROFIL_ID=00:00:00:00:00:00"
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
status)
status
;;
reset)
reset
;;
*)
echo "Usage : $0 [start|stop|restart|status]"
;;
esac
