#!/bin/sh

INIT_SCRIPT_PATH="/etc/init.d"

export TRACKER_BUS_TYPE=system

_start()
{
    $INIT_SCRIPT_PATH/tracker start
    sleep 1
    $INIT_SCRIPT_PATH/tracker_plugin start
    $INIT_SCRIPT_PATH/datamanager start
    $INIT_SCRIPT_PATH/datasynchronizer start
    $INIT_SCRIPT_PATH/dataexplorer start
    $INIT_SCRIPT_PATH/enricher start
    $INIT_SCRIPT_PATH/dataexport start
    $INIT_SCRIPT_PATH/dataindexer start
    $INIT_SCRIPT_PATH/cloudtransfer start
    $INIT_SCRIPT_PATH/magicfolder start
    $INIT_SCRIPT_PATH/opentracker start
    $INIT_SCRIPT_PATH/transmission start
    $INIT_SCRIPT_PATH/torrent start
}

_stop()
{
    $INIT_SCRIPT_PATH/torrent stop
    $INIT_SCRIPT_PATH/transmission stop
    $INIT_SCRIPT_PATH/opentracker stop
    $INIT_SCRIPT_PATH/magicfolder stop
    $INIT_SCRIPT_PATH/cloudtransfer stop
    $INIT_SCRIPT_PATH/dataindexer stop
    $INIT_SCRIPT_PATH/dataexport stop
    $INIT_SCRIPT_PATH/enricher stop
    $INIT_SCRIPT_PATH/dataexplorer stop
    $INIT_SCRIPT_PATH/datasynchronizer stop
    $INIT_SCRIPT_PATH/datamanager stop
    $INIT_SCRIPT_PATH/tracker_plugin stop
    $INIT_SCRIPT_PATH/tracker stop
    sleep 1
}

case $1 in
    start)
        _start
        ;;
    stop)
        _stop
        ;;
    restart)
        _stop
        sleep 1
        _start
        ;;
    *)
        echo "Usage : $0 [start|stop|restart]"
        ;;
esac
