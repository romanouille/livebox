#!/bin/sh

# default values, without confuscator
PID_FILE=/var/run/linuxigd2.pid                                      # pid of the current running upnpd
SOURCE_DIR=/etc/linuxigd                                             # template directory
SED_FILE=/tmp/linux-igd_subst                                        # set of sed commands to transfer the template xml to an actual xml
UPNP_START_CMD="upnpd bridge"                                        # command to start the upnpd
WORKING_DIR=/var/lib/linuxigd                                        # upnpd working directory
ACTUAL_WORKING_DIR=$WORKING_DIR                                      # upnpd dir containing the xml files that are actually used
TEMPLATE_GATEDESC_XML=$ACTUAL_WORKING_DIR/gatedesc_template.xml      # template file used as imput for sed
GATEDESC_XML=$ACTUAL_WORKING_DIR/gatedesc.xml                        # actually used gatedesc file
TEMPLATE_GATEDESC_XML_1=$ACTUAL_WORKING_DIR/gatedesc_template1.xml   # template file used as imput for sed, for devices not supporting igd:2
GATEDESC_XML_1=$ACTUAL_WORKING_DIR/gatedesc1.xml                     # actually used gatedesc file, for devices not supporting igd:2

obfuscate_url() {
    if [ "$1" != "" ] ; then
        ACTUAL_WORKING_DIR="$WORKING_DIR/$1"
        TEMPLATE_GATEDESC_XML="$ACTUAL_WORKING_DIR/gatedesc_template.xml"
        GATEDESC_XML="$ACTUAL_WORKING_DIR/gatedesc.xml"
        TEMPLATE_GATEDESC_XML_1="$ACTUAL_WORKING_DIR/gatedesc_template1.xml"
        GATEDESC_XML_1="$ACTUAL_WORKING_DIR/gatedesc1.xml"
    fi
}

prepare_working_dir () {
    rm -rf "$WORKING_DIR"
    while ! mkdir -p -m 777 "$ACTUAL_WORKING_DIR"
    do
        rm -rf "$WORKING_DIR"
    done

    cp $SOURCE_DIR/* "$ACTUAL_WORKING_DIR"

    # prepare the gatedesc.xml file
    if [ -f $SED_FILE ] ; then
        sed -f $SED_FILE $TEMPLATE_GATEDESC_XML > $GATEDESC_XML
        sed -f $SED_FILE $TEMPLATE_GATEDESC_XML_1 > $GATEDESC_XML_1
    else
        cp $TEMPLATE_GATEDESC_XML $GATEDESC_XML
        cp $TEMPLATE_GATEDESC_XML_1 $GATEDESC_XML_1
    fi

    find "$ACTUAL_WORKING_DIR" -type f | xargs  chmod 744
}

is_running () {
    thread_count=`ps | grep "$UPNP_START_CMD" | grep -v grep | wc -l`
    if [ $thread_count -gt 0 ] ; then
        return 1
    else
        return 0
    fi
}

case $1 in
    start)
        obfuscation_dir="$2"
        is_running
        if [ $? -eq 0 ] ; then
            obfuscate_url "$obfuscation_dir"
            prepare_working_dir
            upnpd bridge $obfuscation_dir
        else
            echo "linuxigd2 is already running"
        fi

    ;;

    stop)
        i=0
        while [ $i -lt 15 ]
        do
            is_running
            if [ $? -eq 1 ] ; then
                if [ -e $PID_FILE ] ; then
                    kill -USR2 `cat $PID_FILE`
                    rm -rf "$PID_FILE"
                fi
            else
                return 0
            fi
            sleep 1
            i=`expr $i + 1`
        done

        echo "upnpd force termination"
        killall upnpd
        sleep 1

    ;;
    status)
        is_running
        if [ $? -eq 1 ] ; then
            echo "linuxigd2 is running."
        else
            echo "linuxigd2 is not running."
        fi
    ;;

    *)
        echo "Usage : $0 [start [<url_obfuscation_dir>]|stop|status]"
    ;;
esac

return 0
