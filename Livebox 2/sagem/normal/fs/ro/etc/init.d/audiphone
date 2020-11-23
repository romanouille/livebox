#!/bin/sh

PCB_PLUGIN="pcb_plugin"
PCB_CLIENT="pcb_client"
AUDIPHONE_PLUGIN_NAME=audiphone_plugin
AUDIPHONE_CLIENT_NAME=audiphone_client
AUDIPHONE_PLUGIN_ODL="/usr/lib/audiphone/audiphone.odl"
AUDIPHONE_CLIENT_LIB="/usr/lib/audiphone/audiphone_client.so"
PID_PLUGIN="/var/run/audiphone_plugin.pid"
PID_CLIENT="/var/run/audiphone_client.pid"

start() {
    if [ -e ${PID_CLIENT} ]; then
        logger -t audiphone "audiphone_client already started"
    else
        logger -t audiphone "Starting audiphone_client"
        $PCB_CLIENT -n $AUDIPHONE_CLIENT_NAME -s $AUDIPHONE_CLIENT_LIB -vv
    fi

    if [ -e ${PID_PLUGIN} ]; then
        logger -t audiphone "audiphone_plugin already started"
    else
        logger -t audiphone "Starting audiphone_plugin"
        $PCB_PLUGIN  -n $AUDIPHONE_PLUGIN_NAME -c $AUDIPHONE_PLUGIN_ODL -vv
    fi
}

stop() {
    logger -t audiphone "Stopping audiphone"
    activate=`pcb_cli -l "Audiphone.Activate?"`
    if [ $activate -gt 0 ]; then
        mode=`pcb_cli -l "Audiphone.SendingMode?"`
        if [ $mode -eq 0 ]; then
            interval=`pcb_cli -l "Audiphone.PeriodicAsynchronousInterval?"`
            if [ $interval -gt 0 ]; then
                logger -t audiphone "Audiphone SendLogs"
                pcb_cli "Audiphone.SendLogs=1"
            fi
        fi
    fi
}

reset() {
    logger -t audiphone "Removing audiphone backup file"
    rm -f /etc/config/audiphone.cfg
}

case "$1" in
    start)
    start
    ;;
    stop)
    stop
    ;;
    reset)
    reset
    ;;
    *)
    echo "Usage: /etc/init.d/audiphone {start|stop|reset}"
    ;;
esac
