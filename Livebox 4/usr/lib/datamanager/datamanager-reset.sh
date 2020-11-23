
#!/bin/sh


export TRACKER_BUS_TYPE=system

INIT_SCRIPT_PATH="/etc/init.d"

# disk path
DISK_PATH=/var/usbmount/hubmmdisk

# read only
export XDG_CONFIG_HOME="$TRACKER_SHARE/config"

# need r/w rights and sufficient memory size
export XDG_DATA_HOME="$DISK_PATH/tracker"
export XDG_CACHE_HOME="$XDG_DATA_HOME/cache"

_start()
{
    $INIT_SCRIPT_PATH/tracker start
    sleep 1
    $INIT_SCRIPT_PATH/dataindexer start
}

_stop()
{
    $INIT_SCRIPT_PATH/dataindexer stop
    $INIT_SCRIPT_PATH/tracker stop
}

case $1 in
    hard)
	# Remove full database and backups and journal
	_stop
	sleep 1
	tracker reset --hard
	sleep 1
        _start
        ;;
    soft)
	# Remove full database except backups and journal
        _stop
	sleep 1
	tracker reset --soft
	sleep 1
	_start
        ;;
    *)
        echo "Usage : $0 [hard|soft]"
        ;;
esac

