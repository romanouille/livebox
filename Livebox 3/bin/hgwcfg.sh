#!/bin/sh




export_hgwcfg=
reset_state=
reset_hgwcfg=
webui=
exec_backup=
exec_restore=

HGWCFGTMPDIR=/var/run/hgwcfg/hgwcfg
HGWCFGUSR=/etc/config/hgwcfg.usr
HGWCFGISP=/etc/config/hgwcfg.isp
HGWCFGRESTORE=/etc/config/hgwcfg.restore
HGWCFGSCRUB=/etc/config/hgwcfg.scrubbed
HGWCFGCRYPT=/var/run/hgwcfg/hgwcfg.crypt
HGWCFGNET=/etc/config/hgwcfg.usr.tmp
HGWCFGTEMPLATE=/etc/defaults/hgwcfg.template
HGWCFGISPTEMPLATE=/etc/defaults/hgwcfg-isp.template
HGWBACKUPSCRIPTSDIR=/usr/lib/hgwcfg/backup
HGWRESTORESCRIPTSDIR=/usr/lib/hgwcfg/restore
HGWCFG_KEY=/security/hgwcfg/hgwcfg.key

# Filenames for use with safe temporary files.
HGWCFGTMP=hgwcfg.tmp

if [ -e /tmp/httpd ]; then
    # If this folder exists, this script must access hgwcfg.crypt in this
    # folder instead of the /tmp folder.
    #
    # This folder exists if httpd runs in a chroot jail. Then httpd can not
    # access /tmp. The start script of httpd then creates the symlink
    # /tmp/httpd pointing to the tmp folder of the jail. httpd and the process
    # calling this script (namely netmodeconfig) then exchange this file via
    # the /tmp folder of the jail of httpd.
    #
    # hgwcfg.crypt is only used in case of a save/restore via the webui: this
    # script only accesses hgwcfg.crypt if the variable 'webui' is not empty.
    HGWCFGCRYPT=/tmp/httpd/hgwcfg.crypt
fi

#
# The following functions try to create safe to use temporary files, readable by the current user only.
# - create_safe_tmp() - Creates a safe temporary directory. Called at script startup.
# - check_safe_tmp() - Checks if the temporary directory passes a security audit. Called by the other functions.
# - destroy_safe_tmp() - Cleans up and destroys the temporary directory. Called by EXIT trap.
# - create_safe_tmpfile(filename) - Creates the file <filename> in the temporary directory.
# - destroy_safe_tmpfile(filename) - Cleans up and destroys the file <filename> in the temporary directory.
#
# Usually, only create_safe_tmpfile() and destroy_safe_tmpfile() are to be called by the developer.
#

check_safe_tmp()
{
    if [ ! -d "$HGWCFGTMPDIR" ]
    then
        logger -t hgwcfg.sh "Failed to check temporary directory - directory doesn't exist"
        exit 2
    fi

    # no stat command on gateway
    if [ "x$(ls -ld "$HGWCFGTMPDIR" | cut -d ' ' -f 1)" != "xdrwx------" ]
    then
        logger -t hgwcfg.sh "Failed to check temporary directory - wrong mode"
        exit 2
    fi

    return 0
}

create_safe_tmp()
{
    test -e "$HGWCFGTMPDIR" && rm -rf "$HGWCFGTMPDIR"

    if [ -e "$HGWCFGTMPDIR" ]
    then
        logger -t hgwcfg.sh "Failed to create temporary directory - directory exists"
        exit 2
    fi

    omask=$(umask)
    umask 0077
    mkdir -p "$HGWCFGTMPDIR"
    umask $omask
    if [ ! -d "$HGWCFGTMPDIR" ]
    then
        logger -t hgwcfg.sh "Failed to create temporary directory - creation failed"
        exit 2
    fi

    chmod 0700 "$HGWCFGTMPDIR"

    check_safe_tmp

    return 0
}

destroy_safe_tmp()
{
    # Don't use 'exit' in this function
    # All code must be run!

    if [ -d "$HGWCFGTMPDIR" ]
    then
        for x in $(ls "$HGWCFGTMPDIR")
        do
            echo -en > "$HGWCFGTMPDIR/$x"
            sync
            rm -rf "$HGWCFGTMPDIR/$x"
            sync

            if [ -e "$HGWCFGTMPDIR/$x" ]
            then
                logger -t hgwcfg.sh "Failed to remove temporary file"
            fi
        done
    fi

    rm -rf "$HGWCFGTMPDIR"
    sync

    if [ -e "$HGWCFGTMPDIR" ]
    then
        logger -t hgwcfg.sh "Failed to remove temporary directory"
    fi

    return 0
}

create_safe_tmpfile()
{
    if [ -z "$1" ]
    then
        logger -t hgwcfg.sh "Failed to create temporary file - wrong argument"
        exit 2
    fi

    check_safe_tmp

    TMPFILE="$HGWCFGTMPDIR/$1"

    if [ -e "$TMPFILE" ]
    then
        logger -t hgwcfg.sh "Failed to create temporary file - file exists"
        exit 2
    fi

    omask=$(umask)
    umask 0077
    touch "$TMPFILE"
    umask $omask
    if [ ! -f "$TMPFILE" ]
    then
        logger -t hgwcfg.sh "Failed to create temporary file - creation failed"
        exit 2
    fi

    chmod 0600 "$TMPFILE"
    # no stat command on gateway
    if [ "x$(ls -l "$TMPFILE" | cut -d ' ' -f 1)" != "x-rw-------" ]
    then
        logger -t hgwcfg.sh "Failed to create temporary file - mode change failed"
        exit 2
    fi

    echo "$TMPFILE"
}

destroy_safe_tmpfile()
{
    if [ -z "$1" ]
    then
        logger -t hgwcfg.sh "Failed to destroy temporary file - wrong argument"
        exit 2
    fi

    check_safe_tmp

    TMPFILE="$HGWCFGTMPDIR/$1"

    if [ ! -f "$TMPFILE" ]
    then
        logger -t hgwcfg.sh "Failed to destroy temporary file - file doesn't exist"
        exit 2
    fi

    echo -en > "$TMPFILE"
    sync
    rm -rf "$TMPFILE"
    sync

    if [ -e "$TMPFILE" ]
    then
        logger -t hgwcfg.sh "Failed to destroy temporary file"
        exit 2
    fi

    echo ""
}

for arg in $*; do
    if [ "$arg" == "backup" ]; then
        export_hgwcfg=y
        exec_backup=y
    elif [ "$arg" == "restore" ]; then
        export_hgwcfg=y
        exec_backup=y
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
trap "rm -f /tmp/dont_reboot/$$ && destroy_safe_tmp" EXIT

create_safe_tmp

if [ -n "$reset_hgwcfg" ]; then
    rm -f $HGWCFGUSR
    logger -t hgwcfg.sh "Deleted $HGWCFGUSR"
fi

prepare_restore()
{
    hgwcfg_scrub $1 $HGWCFGSCRUB
    hgwcfg_check "$HGWCFGSCRUB"
    if [ "$?" != 0 ]; then
        echo "$1 is not a valid user config file"
    else
        mv $HGWCFGSCRUB $HGWCFGRESTORE
        chmod 600 $HGWCFGRESTORE
        echo ""
    fi
}

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
        # do a backup of all plugins (to CONFIG_SAH_LIB_HGWCFG_TMPFS_PATH/mmap)
        exec_scripts $HGWBACKUPSCRIPTSDIR backup
        # do the export to xml
        hgwcfg_save
        if [ "$?" -ne 0 ];
        then
            echo "hgwcfg.sh: Unable to save User Settings!!!"
        fi
        rm -f /var/run/hgwcfg/mmap_file
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
        if [ -n "$reset_state" ]; then
            logger -t hgwcfg.sh "Skipping hgwcfg.usr during backup with restore"
        else
            if [ -e "$HGWCFG_KEY" ]; then
                # encrypt $HGWCFGUSR (note that it is already stripped and moved.)
                usrcrypt enc "$HGWCFG_KEY" "$HGWCFGUSR" > "$HGWCFGCRYPT"
                if [ "$?" != 0 ]; then
                    logger -t hgwcfg.sh "Encryption of the file failed"
                    exit 2
                fi
            else
                logger -t hgwcfg.sh  "hgwcfg encrytion file missing, store the user settings without encryption"
                cp "$HGWCFGUSR" "$HGWCFGCRYPT"
            fi
        fi
        chmod 644 "$HGWCFGCRYPT"
        logger -t hgwcfg.sh "Backup & restore webui file exported to $HGWCFGCRYPT"
    else
        logger -t hgwcfg.sh "User settings exported to $HGWCFGUSR"
    fi
fi

if [ -n "$reset_state" ]; then
    if [ -n "$webui" ]; then
        if [ -e "$HGWCFG_KEY" ]; then
            TMP=$(create_safe_tmpfile "$HGWCFGTMP")
            usrcrypt dec "$HGWCFG_KEY" "$HGWCFGCRYPT" > "$TMP"
            if [ "$?" == 0 ]; then
                logger -t hgwcfg.sh "File decrypted to $TMP"
                error="$(prepare_restore $TMP)"
                TMP=$(destroy_safe_tmpfile "$HGWCFGTMP")
                if [ -n "$error" ]; then
                    logger -t hgwcfg.sh "$error"
                    exit 2
                fi
            else
                TMP=$(destroy_safe_tmpfile "$HGWCFGTMP")
                logger -t hgwcfg.sh "Could not decrypt user config file"
                exit 1
            fi
        else
            error="$(prepare_restore $HGWCFGCRYPT)"
            if [ -n "$error" ]; then
                logger -t hgwcfg.sh "$error"
                exit 2
            fi
        fi
    else
        # Network Restore case
        if [ -e "$HGWCFGNET" ]; then
            error="$(prepare_restore $HGWCFGNET)"
            if [ -n "$error" ]; then
                logger -t hgwcfg.sh "$error"
                exit 2
            fi
        fi
    fi
    # This will reset /etc /dl /home /root at next reboot
rm -f /cfg/system/version


    # Remove current configuration database
    rm -f /etc/config/db_ready
fi

exit 0

