#!/bin/sh

BUS_NAME=sysbus

running_pid()
{
    local pid=$1
    local name=$2
    local index=$3
    [ -z "$pid" ] && return 1
    [ ! -d /proc/$pid ] &&  return 1
    cmd=$(cat /proc/$pid/cmdline | tr "\000" " " | tr -s " " | cut -d ' ' -f $index)
    [ "$cmd" != "$name" ] &&  return 1
    return 0
}

show_cmd()
{
    echo "[$(date)]: $@"
    eval "$@"
}

#usage: pcb_is_running <app_name>
app_is_running()
{
    local name=$1
    shift 1

    pidfile=/var/run/$name.pid
    [ ! -f "$pidfile" ] && return 1
    pid=$(cat $pidfile)
    running_pid $pid $name 1 || return 1
    return 0
}

#usage: pcb_is_running <app_name>
pcb_is_running()
{
    local name=$1
    shift 1

    pidfile=/var/run/$name.pid
    [ ! -f "$pidfile" ] && return 1
    pid=$(cat $pidfile)
    [ ! -d /proc/$pid ] &&  return 1
    cmd=$(cat /proc/$pid/cmdline | tr "\000" " " | tr -s " ")
    index=1;
    pos=0;
    for i in $cmd; do
        if [ "$i" == "-n" ]; then
            pos=$((index+1))
        fi
        index=$((index+1))
    done;
    [ "$pos" == "0" ] && return 1
    running_pid $pid $name $pos || return 1
    return 0
}

#usage: pcb_start <app_name> [<other arguments>]
pcb_start()
{
    local name=$1
    shift 1

    if pcb_is_running $name; then
        #already running
        echo "$name already started"
    else
        #start pcb_app here
        $pcb_app_preload pcb_app -vv -n $name "$@"
    fi
}

#usage: pcb_stop <app_name>
pcb_stop()
{
    local name=$1
    shift 1
    if pcb_is_running $name; then
        #stop pcb_app here
        pidfile=/var/run/$name.pid
        pid=$(cat $pidfile)

        kill $pid
    else
        #not running
        echo "$name not running"
    fi
}

#usage: pcb_restart <app_name> [<other arguments>]
pcb_restart()
{
    pcb_stop "$@"
    pcb_start "$@"
}

#usage: pcb_debug_info <app_name> <component_name> [<root obj 1> <root obj 2> ....]
pcb_debug_info()
{
    local name=$1
    local component=$2
    shift 2
    datamodel="$@"

    echo "$name version:"
    echo "=============================================="
    head -n 12 /web/version.txt
    grep "$component=" /web/version.txt
    echo "=============================================="
    echo

    echo "$name process object"
    echo "=============================================="
    if [ "$name" == "$BUS_NAME" ]; then
        pcb_cli "Process."$name"?"
    else
        pcb_cli -q "Process."$BUS_NAME"_"$name".EnableSync=1"
        pcb_cli "Process."$BUS_NAME"_"$name"?"
    fi
    echo "=============================================="
    echo

    if pcb_is_running $name; then
        pidfile=/var/run/$name.pid
        pid=$(cat $pidfile)

        echo "$name status:"
        echo "=============================================="
        cat /proc/$pid/cmdline | tr "\000" " " | tr -s " "
        echo
        show_cmd cat /proc/$pid/status
        echo "=============================================="
        echo
        if [ -n "$datamodel" ]; then
            echo "$name data model"
            echo "=============================================="
            for i in $(echo $datamodel); do
                pcb_cli "$i?"
            done
            echo "=============================================="
        fi
    else
        echo "$name status: not running"
    fi
}

#usage: pcb_log <app_name> <enable|disable|reset> <zone1> [<zone2> <zone3> ... <zoneN>]
pcb_log()
{
    local name=$1
    local action=$2
    shift 2

    case $action in
        enable)
            pcb_cli -q "Process."$BUS_NAME"_"$name".Tracing.Enabled=1"
            pcb_cli -q "Process."$BUS_NAME"_"$name".Tracing.TraceLevel=500"
            for zone in "$@"; do
                pcb_cli -q "Process."$BUS_NAME"_"$name".addTraceZone(\"$zone\", 500)"
            done
            ;;
        disable)
            pcb_cli -q "Process."$BUS_NAME"_"$name".Tracing.Enabled=0"
            ;;
        reset)
            pcb_cli -q "Process."$BUS_NAME"_"$name".Tracing.Enabled=1"
            pcb_cli -q "Process."$BUS_NAME"_"$name".Tracing.TraceLevel=200"
            for zone in "$@"; do
                pcb_cli -q "Process."$BUS_NAME"_"$name".Tracing."$zone"=0"
            done
            ;;
    esac
}

#usage: pcb_is_available <object> <timeout>
pcb_is_available()
{
    local object=$1
    local timeout=$2
    shift 2

    if [ -n "$timeout" ]; then
        data=$(pcb_cli -w $timeout "$object?0")
    else
        data=$(pcb_cli -w -1 "$object?0")
    fi
    [ -n "$data" ] && return 0

    return 1
}

#usage: mtk_load <app_name> <so_file>
mtk_load()
{
    local name=$1
    local shared_object=$2
    shift 2

    options=$(echo "$@" | tr ' ' ',')
    if pcb_is_running $name; then
        if [ -z $options ]; then
            pcb_cli -q "Process."$BUS_NAME"_"$name".loadSharedObject(\""$shared_object"\")"
        else
            pcb_cli -q "Process."$BUS_NAME"_"$name".loadSharedObject(\""$shared_object"\",$options)"
        fi
    fi
}

#usage: mtk_unload <app_name> <so name>
mtk_unload()
{
    local name=$1
    local shared_object=$2
    shift 2

    if pcb_is_running $name; then
        pcb_cli -q "Process."$BUS_NAME"_"$name".unloadSharedObject(\""$shared_object"\")"
    fi
}

#usage: mtk_start <app_name> <so name> <module>
mtk_start()
{
    local name=$1
    local shared_object=$2
    local module=$3
    shift 3

    options=$(echo "$@" | tr ' ' ',')
    if pcb_is_running $name; then
        pcb_cli -q "Process."$BUS_NAME"_"$name".EnableSync=1"
        pcb_cli -q "Process."$BUS_NAME"_"$name".SharedObject."$shared_object".Module."$module".start($options)"
    fi
}

#usage: mtk_stop <app_name> <so name> <module>
mtk_stop()
{
    local name=$1
    local shared_object=$2
    local module=$3
    shift 3

    if pcb_is_running $name; then
        pcb_cli -q "Process."$BUS_NAME"_"$name".EnableSync=1"
        pcb_cli -q "Process."$BUS_NAME"_"$name".SharedObject."$shared_object".Module."$module".stop()"
    fi
}
