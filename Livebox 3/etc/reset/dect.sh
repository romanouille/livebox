#!/bin/sh

name="Dspgroup SPI dect plugin"
export SAH_VOICE_PLUGIN_NAME="DSPGDECT"
export PCB_SYS_BUS=pcb://ipc:[/var/run/pcb_sys]
export PCB_MIB_DIR=/usr/lib/endpointplugin/mibs
export SAH_TRACE_ZONES=all:200,HAN:200,las:200
pid_file=/var/run/dect.pid

case $1 in
    start)
        if [ ! -e $pid_file ]; then
            sahenv -f /etc/environment pcb_plugin --priority=-20 -o syslog -n dect -c /usr/lib/endpointplugin/dect.odl -vv --args dummy --bus=spi3 --port=0
        fi
        ;;

    gdb)
        if [ ! -e $pid_file ]; then
            ./gdb --args ./pcb_plugin -f -n dect -c ./dect.odl
        fi
        ;;

    stop)
        if [ -e $pid_file ]; then
            kill $(cat $pid_file)
        fi
        rm $pid_file
        ;;

    reset)
        if [ -e $pid_file ]; then
            pcb_cli "DECT.reset()"
        else
            mkdir -p /var/lib/dspgplugin
            touch /var/lib/dspgplugin/reset
        fi
        ;;

    backup)
        if [ -e $pid_file ]; then
            pcb_cli "$SAH_VOICE_PLUGIN_NAME.export($2)"
        fi
        ;;

    restore)
        mkdir -p /var/lib/dspgplugin
        touch /var/lib/dspgplugin/restore
        ;;
    debuginfo)
        if [ -e $pid_file ]; then
            pcb_cli "DSPGDECT.LAS.Cache.getLineSettings()"
            pcb_cli "DSPGDECT.LAS.Cache.getHandsets()"
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop}"
        ;;
esac

