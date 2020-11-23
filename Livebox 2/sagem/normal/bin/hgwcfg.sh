#!/bin/sh

export_hgwcfg=
reset_state=
reset_hgwcfg=
delay=
webui=
exec_backup=
exec_restore=

CLIOUT=/tmp/cli.out
HGWCFGTMP=/etc/config/hgwcfg.tmp
HGWCFGUSR=/etc/config/hgwcfg.usr
HGWCFGISP=/etc/config/hgwcfg.isp
HGWCFGCRYPT=
HGWCFGUSRTEMPLATE=/etc/defaults/hgwcfg.template
HGWCFGISPTEMPLATE=/etc/defaults/hgwcfg-isp.template
HGWBACKUPSCRIPTSDIR=/usr/lib/hgwcfg/backup
HGWRESTORESCRIPTSDIR=/usr/lib/hgwcfg/restore
HGWCFG_KEY=/security/hgwcfg/hgwcfg.key
HGWCFG_ARG=

CLI2USR_PARAMS=

. /fs/ro/etc/autoconf.conf

source /etc/prefix.nonstandard

if [ -n "$CONFIG_GENERATION_RESC" ]; then
    bootmode=rescue
else
    bootmode=system
fi

for arg in $*; do
    if [ "$arg" == "backup" ]; then
        if [ "$CONFIG_GENERATION_RESC" ]; then
            logger -t hgwcfg.sh "backup requested, but this is not an operational image, skipping backup"
        else
            export_hgwcfg=y
            exec_backup=y
        fi
    elif [ "$arg" == "restore" ]; then
        reset_state=y
    elif [ "$arg" == "exec_restore_scripts" ]; then
        exec_restore=y
    elif [ "$arg" == "delayed" ]; then
        delay=y
    elif [ "$arg" == "webui" ]; then
        webui=y
        HGWCFGCRYPT=/tmp/hgwcfg.crypt
        HGWCFG_ARG="$HGWCFGTMP"
        CLI2USR_PARAMS=-webui
    elif [ "$arg" == "reset" ]; then
        reset_state=y
        reset_hgwcfg=y
    elif [ "$arg" == "removelock" ]; then
        echo "Removing lock from hgwcfg"
        rm /tmp/hgwcfg.lock 2>/dev/null
        exit 1
    elif [ "$arg" == "lock" ]; then
        echo $$ > /tmp/hgwcfg.lock
    else
        HGWCFG_ARG="$arg"
    fi
done

mkdir -p /tmp/dont_reboot
touch /tmp/dont_reboot/$$
trap "rm /tmp/dont_reboot/$$" EXIT

if [ -n "$delay" ]; then
    counter=`cat /var/run/hgwcfg-trigger-counter 2>/dev/null || echo 0`
    counter=`expr $counter + 1`
    echo $counter > /var/run/hgwcfg-trigger-counter
    sleep 10
    [ "$counter" -ne "`cat /var/run/hgwcfg-trigger-counter 2>/dev/null || echo 0`" ] && exit
fi

PID=$(cat /tmp/hgwcfg.lock 2>/dev/null || echo $$)

if [ "$$" != "$PID" ] ; then
    logger -t hgwcfg.sh "backup has been locked by PID $PID, skipping request from PID $$!"
    exit 0
fi

if [ -n "$reset_state" ]; then
logger -t hgwcfg.sh "reset_state"
    if [ -n "$webui" ]; then
        if [ -e "$HGWCFG_KEY" ]; then
          j=`cat $HGWCFG_KEY | wc -l`
          i=1
          while [ $i -le $j ]
              do
              HGWCFG_KEY_DEC=/tmp/hgwcfg_$i.key
              sed -n -e ''$i',1p' $HGWCFG_KEY > $HGWCFG_KEY_DEC
              usrcrypt dec "$HGWCFG_KEY_DEC" "$HGWCFGCRYPT" > "$HGWCFGTMP"
              if [ "$?" == 0 ]; then
                hgwcfg_scrub "$HGWCFGTMP" "/etc/config/hgwcfg.scrubbed"
                hgwcfg_check "/etc/config/hgwcfg.scrubbed"
                if [ "$?" != 0 ]; then
                    logger -t hgwcfg.sh "Decrypted file is not a valid user config file"
                    exit 2
                else
                    mv /etc/config/hgwcfg.scrubbed /etc/config/hgwcfg.usr
                    chmod 600 "$HGWCFGUSR"
                    logger -t hgwcfg.sh "File decrypted to /etc/config/hgwcfg.usr"
                    break
                fi
        else
		  rm -f $HGWCFG_KEY_DEC
                  i=$(( $i + 1 ))
            fi
          done
        fi
    fi
    # This will reset /etc /dl /home /root at next reboot
    rm -f /mnt/jffs2/jffs2_3/$bootmode/version

    # Remove current configuration database
    rm -f /etc/config/db_ready
    rm -f /etc/config/mbus_sah.dat*
    touch /etc/do_import

    # Remove rescue configuration files
    rm -f /etc/ppp.cfg
    rm -f /etc/cwmp.cfg
    rm -f /etc/cwmp_server.cfg

    exit 0
fi

if [ -n "$reset_hgwcfg" ]; then
    rm -f /etc/config/hgwcfg.usr
    logger -t hgwcfg.sh "Deleted /etc/config/hgwcfg.usr"
fi

exec_scripts()
{
    logger -t hgwcfg.sh "Executing scripts in \"$1\""
    for script in `find $1 | sort` ;
    do
        if test \( -x $script -a \( -f $script -o -L $script \) \)
        then
            if [ $script == "/usr/lib/hgwcfg/backup/voicehgwcfg.sh" ]
            then
                # voice script is not happy with extra parameters,
                # this solves it for now
                logger -t hgwcfg.sh "    Executing script \"$script\""
                "$script" $2 >/dev/null 2>/dev/null
                if [ "$?" -ne 0 ];
                then
                    logger -t hgwcfg.sh "    Error while executing script \"$1\""
                fi
            else
                logger -t hgwcfg.sh "    Executing script \"$script\""
                "$script" $2 "$HGWCFGTMP" >/dev/null 2>/dev/null
                if [ "$?" -ne 0 ];
                then
                    logger -t hgwcfg.sh "    Error while executing script \"$1\""
                fi
            fi
        fi
    done
}

if [ -n "$exec_restore" ]; then
    if [ -n "$webui" ]; then
        if [ -e "$HGWCFG_KEY" ]; then
            usrcrypt dec "$HGWCFG_KEY" "$HGWCFGCRYPT" > "$HGWCFGTMP"
            if [ "$?" -ne 0 ];
            then
                logger -t hgwcfg.sh "    Error while decrypting file $HGWCFGCRYPT\n"
            else
                logger -t hgwcfg.sh "    File decrypted to $HGWCFGTMP"
            fi
            cp "$HGWCFGTMP" "/etc/config/hgwcfg.usr"
        fi
    fi
    exec_scripts $HGWRESTORESCRIPTSDIR restore
fi

if [ -n "$export_hgwcfg" ]; then
    
    rm -f $CLIOUT
        
    if [ -n "$exec_backup" ]; then

        # copy .usr to .tmp and use the .tmp 
        cp "$HGWCFGUSR" "$HGWCFGTMP" 

        # backup all plugins into $HGWCFGTMP
        exec_scripts $HGWBACKUPSCRIPTSDIR backup

        # Restrict the contents to the one specified by the template
        hgwcfg_strip "$HGWCFGTMP" "$HGWCFGUSRTEMPLATE" "$HGWCFGUSR"
        chmod 600 "$HGWCFGUSR"
        # sync buffered filesystem blocks
        sync
        # At this point, /etc/config/hgwcfg.usr has the correct settings

        if [ -e "$HGWCFGISPTEMPLATE" ]; then
          hgwcfg_strip "$HGWCFGTMP" "$HGWCFGISPTEMPLATE" "$HGWCFGISP"
          chmod 600 "$HGWCFGISP"
          sync
        fi

    fi
    
    if [ "$?" != 0 ]; then
        logger -t hgwcfg.sh "Exporting user settings failed"
        exit 1
    elif [ -n "$webui" ]; then
        if [ -e "$HGWCFG_KEY" ]; then
            
            # encrypt /etc/config/hgwcfg.usr (note that it is already stripped and moved.
            HGWCFG_KEY_ENC=/tmp/hgwcfg_enc.key
            sed -n -e '1,1p' $HGWCFG_KEY > $HGWCFG_KEY_ENC
            usrcrypt enc "$HGWCFG_KEY_ENC" "$HGWCFGUSR" > "$HGWCFGCRYPT"
            if [ "$?" != 0 ]; then
                logger -t hgwcfg.sh "Encryption of the file failed"
                exit 2
            else
                logger -t hgwcfg.sh "Backup & restore webui file exported to $HGWCFGCRYPT"
            fi
            rm -f $HGWCFG_KEY_ENC
        else
            logger -t hgwcfg.sh  "hgwcfg encrytion file missing, store the user settings without encryption"
            # the webui is looking for a file named $HGWCFGCRYPT
            cp "$HGWCFGUSR" "$HGWCFGCRYPT"
            chmod 644 "$HGWCFGCRYPT"
            logger -t hgwcfg.sh "Backup & restore webui file exported to $HGWCFGCRYPT"
        fi
    else
        logger -t hgwcfg.sh "User settings exported to $HGWCFGUSR"
    fi
fi

exit 0

