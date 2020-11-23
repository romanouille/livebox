#! /bin/sh 

DMS_CONFIG="/usr/share/dlna/dms/dms.pri"

if [ -f "$DMS_CONFIG" ] ; then
	DMS_PATH=`cat "$DMS_CONFIG" | grep "path" | cut -d= -f2`
	DMS_USERNAME=`cat "$DMS_CONFIG" | grep "username" | cut -d= -f2`
	DMS_PATH_CONFIG=`cat "$DMS_CONFIG" | grep "path_config" | cut -d= -f2`
fi

dbg_print="$2"

debug()
{
   if [ "$dbg_print" = "-v" ] ; then
      echo "DBG: $1"
   fi   
}

check_path()
{
	if [ -n "$DMS_PATH" ] ; then
		debug "create dms path on \"$DMS_PATH\""
		mkdir -p "$DMS_PATH"
	fi
	if [ -n "$DMS_PATH_CONFIG" ] ; then
		debug "create dms config path on \"$DMS_PATH_CONFIG\""
		mkdir -p "$DMS_PATH_CONFIG"
	fi
}

check_privilege()
{
	if [ -n "$DMS_USERNAME" ] && [ -d "$DMS_PATH" ] ; then
		debug "$DMS_USERNAME privileges enabled on \"$DMS_PATH\""
		chown -R $DMS_USERNAME:$DMS_USERNAME "$DMS_PATH"
	fi
	if [ -n "$DMS_USERNAME" ] && [ -d "$DMS_PATH_CONFIG" ] ; then
		debug "$DMS_USERNAME privileges enabled on \"$DMS_PATH_CONFIG\""
		chown -R $DMS_USERNAME:$DMS_USERNAME "$DMS_PATH_CONFIG"
	fi
}

startDlnaMonitor()
{
	debug "start dms"
	/bin/dlna_monitor -v &
}

stopDlnaMonitor()
{
	debug "stop dms"
	killall -9 dms 
	killall -9 dlna_monitor
}

cleanServerRessources()
{
    if [ -n "$DMS_PATH" ] ; then
        debug "remove \"$DMS_PATH/dms.db\""
        rm -f "$DMS_PATH"/dms.db
    else
        debug "remove dms.db file\""
        rm -f `find / -type f -name "dms.db"`
    fi    
    if [ -n "$DMS_PATH_CONFIG" ] ; then
        debug "remove \"$DMS_PATH_CONFIG/dms.config\""
        rm -f "$DMS_PATH"/dms.config
    fi
}

resetServer()
{
   stopDlnaMonitor
   cleanServerRessources        
   startDlnaMonitor
}

case "$1" in
	start)
		if [ -x /bin/dlna_monitor   ] ; then
			check_path
			check_privilege
			startDlnaMonitor
		fi
		;;
	stop)
		stopDlnaMonitor
		;;
	reset)
		resetServer
		;;
	*)
    echo "Usage: /etc/init.d/dlnaserver {start|stop}"
    exit 1
    ;;
esac

exit 0
