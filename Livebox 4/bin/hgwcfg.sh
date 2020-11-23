#!/bin/sh



export_hgwcfg=
reset_state=
reset_hgwcfg=
webui=
exec_backup=
exec_restore=

HGWCFGTMP=/tmp/hgwcfg.tmp
HGWCFGUSR=/etc/config/hgwcfg.usr
HGWCFGISP=/etc/config/hgwcfg.isp
HGWCFGSCRUB=/etc/config/hgwcfg.scrubbed
HGWCFGCRYPT=/tmp/hgwcfg.crypt
HGWCFGTEMPLATE=/etc/defaults/hgwcfg.template
HGWCFGISPTEMPLATE=/etc/defaults/hgwcfg-isp.template
HGWBACKUPSCRIPTSDIR=/usr/lib/hgwcfg/backup
HGWRESTORESCRIPTSDIR=/usr/lib/hgwcfg/restore
HGWCFG_KEY=/security/hgwcfg/hgwcfg.key

BOOTMODE=$(/usr/bin/bootmode get)

for arg in $*; do
    if [ "$arg" == "backup" ]; then
        if [ "rescue" == $BOOTMODE  ]; then
            logger -t hgwcfg.sh "backup requested, but this is not an operational image, skipping backup"
        else
            export_hgwcfg=y
            exec_backup=y
        fi
    elif [ "$arg" == "restore" ]; then
        reset_state=y
    elif [ "$arg" == "exec_restore_scripts" ]; then
        exec_restore=y
    elif [ "$arg" == "webui" ]; then
        webui=y
    elif [ "$arg" == "reset" ]; then
        reset_state=y
        reset_hgwcfg=y
    fi
done

mkdir -p /tmp/dont_reboot
touch /tmp/dont_reboot/$$
trap "rm /tmp/dont_reboot/$$" EXIT

if [ -n "$reset_state" ]; then
    success=1
    if [ -n "$webui" ]; then
        if [ -e "$HGWCFG_KEY" ]; then
		  success=0
          j=`cat $HGWCFG_KEY | wc -l`
          i=1
          while [ $i -le $j ]
              do
              HGWCFG_KEY_DEC=/tmp/hgwcfg_$i.key
              sed -n -e ''$i',1p' $HGWCFG_KEY > $HGWCFG_KEY_DEC
              usrcrypt dec "$HGWCFG_KEY_DEC" "$HGWCFGCRYPT" > "$HGWCFGTMP"
              if [ "$?" == 0 ]; then
                hgwcfg_scrub "$HGWCFGTMP" "$HGWCFGSCRUB"
                hgwcfg_check "$HGWCFGSCRUB"
                if [ "$?" != 0 ]; then
                    logger -t hgwcfg.sh "Decrypted file is not a valid user config file"
                    exit 2
                else
                    mv $HGWCFGSCRUB $HGWCFGUSR
                    chmod 600 $HGWCFGUSR
                    logger -t hgwcfg.sh "File decrypted to $HGWCFGUSR"
					success=1
                    break
                fi
              else
                 rm -f $HGWCFG_KEY_DEC
                 i=$(( $i + 1 ))
              fi
          done
        else
            hgwcfg_scrub $HGWCFGCRYPT $HGWCFGSCRUB
            hgwcfg_check "$HGWCFGSCRUB"
            if [ "$?" != 0 ]; then
                logger -t hgwcfg.sh "File is not a valid user config file"
                exit 2
            else
                mv $HGWCFGSCRUB $HGWCFGUSR
                chmod 600 $HGWCFGUSR
                break;
            fi
        fi
    fi
    # This will reset /etc /dl /home /root at next reboot

    rm -f /cfg/$BOOTMODE/version



    # Remove current configuration database
    rm -f /etc/config/db_ready

	if [ "$success" == "1" ]; then
    	exit 0
	else
		exit 1
	fi
fi

if [ -n "$reset_hgwcfg" ]; then
    rm -f $HGWCFGUSR
    logger -t hgwcfg.sh "Deleted $HGWCFGUSR"
fi

exec_scripts()
{
    logger -t hgwcfg.sh "Executing scripts in \"$1\""
    for script in `find $1 | sort` ;
    do
        if test \( -x $script -a \( -f $script -o -L $script \) \)
        then
            logger -t hgwcfg.sh "    Executing script \"$script\""
            "$script" $2
            if [ "$?" -ne 0 ];
            then
                logger -t hgwcfg.sh "    Error while executing script \"$1\""
            fi
        fi
    done
}

if [ -n "$exec_restore" ]; then
    exec_scripts $HGWRESTORESCRIPTSDIR restore
fi

if [ -n "$export_hgwcfg" ]; then
    
    if [ -n "$exec_backup" ]; then
	# do a backup of all plugins (to /tmp/mmap)
        exec_scripts $HGWBACKUPSCRIPTSDIR backup
	# do the export to xml
	hgwcfg_save
	rm -f /tmp/mmap_file
	if [ "$?" -ne 0 ];
	then
	    echo "hgwcfg.sh: Unable to save User Settings!!!"
	fi
        # strip unnecessary info
	if [ -e "$HGWCFGISPTEMPLATE" ]; then
	    hgwcfg_strip "$HGWCFGUSR" "$HGWCFGISPTEMPLATE" "$HGWCFGISP" > /dev/null 
	fi
        hgwcfg_strip "$HGWCFGUSR" "$HGWCFGTEMPLATE" "$HGWCFGUSR" > /dev/null
        chmod 600 $HGWCFGUSR
        chmod 600 $HGWCFGISP 2>/dev/null
        sync
        # At this point, $HGWCFGUSR has the correct settings
    fi
    
    if [ "$?" != 0 ]; then
        logger -t hgwcfg.sh "Exporting user settings failed"
        exit 1
    elif [ -n "$webui" ]; then
        if [ -e "$HGWCFG_KEY" ]; then
            # encrypt $HGWCFGUSR (note that it is already stripped and moved.
            HGWCFG_KEY_ENC=/tmp/hgwcfg_enc.key
            sed -n -e '1,1p' $HGWCFG_KEY > $HGWCFG_KEY_ENC
            usrcrypt enc "$HGWCFG_KEY_ENC" "$HGWCFGUSR" > "$HGWCFGCRYPT"
            if [ "$?" != 0 ]; then
                logger -t hgwcfg.sh "Encryption of the file failed"
                exit 2
            fi
            rm -f $HGWCFG_KEY_ENC
        else
            logger -t hgwcfg.sh  "hgwcfg encrytion file missing, store the user settings without encryption"
            cp "$HGWCFGUSR" "$HGWCFGCRYPT"
        fi
        chmod 644 "$HGWCFGCRYPT"
        logger -t hgwcfg.sh "Backup & restore webui file exported to $HGWCFGCRYPT"
    else
        logger -t hgwcfg.sh "User settings exported to $HGWCFGUSR"
    fi
fi

exit 0

