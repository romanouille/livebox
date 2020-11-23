#!/bin/sh
. /usr/bin/pcb_common.sh

name="topologydiagnostics"
datamodel="TopologyDiagnostics"
trace_zones="orange topo_dm hosts topo_result state topo_upload topo_xml"
component="sah_services_topologydiagnostics"

backup() {
    if pcb_is_running topologydiagnostics; then
        pcb_cli "TopologyDiagnostics.export()"
    else
        echo "TopologyDiagnostics is not running, impossible to make a backup"
    fi  
}

restore() {
    mkdir -p /var/lib/topologydiagnostics
    touch /var/lib/topologydiagnostics/restore
}

reset() {
    rm -f /etc/config/topology.cfg
}

case $1 in
    start)
        pcb_start $name
        pcb_start gmap_orange "/usr/lib/gmap/modules/gmap_mod_orange.so"
        ;;
    stop)
        pcb_stop gmap_orange
        pcb_stop $name
        ;;
    debuginfo)
        pcb_debug_info $name $component $datamodel
        pcb_debug_info gmap_orange $component
        ;;
    log)
        action=$2
        if [ -n "$action" ]; then
            pcb_log $name $action $trace_zones
        else
            pcb_log $name enable $trace_zones
        fi
        ;;
    backup)
        backup
        ;;
    restore)
        restore
        ;;
    reset)
        reset
        ;;
    *)
        echo "Usage : $0 [start|stop|debuginfo|log|backup|restore|reset]"
        ;;
esac
