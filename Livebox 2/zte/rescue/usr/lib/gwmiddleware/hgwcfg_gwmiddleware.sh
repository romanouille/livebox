#!/bin/sh

# store the settings in /var/lib, this writable file location is accessible by both SYSTEM and RESCUE images

# this file is created by hgwcfg before this script is called with the restore option
HGWCFG_MBUS_IGD_DEF="/tmp/mbus_igd_user.def"
# file used to store gwmiddleware settings
HGWCFG_GWMIDDLEWARE_FILE="/etc/hgwcfg_gwmiddleware.cfg"


# param: requires the output file as input parameter
create_gwmiddleware_def()
{
    if [ -f $1 ]
    then
        rm $1
    fi

    object="DeviceInfo"
    echo -e "OBJECT $object" >> $1

    for param in ProvisioningCode ;
    do
        pcb_path="$object.$param"
        value=`echo "$pcb_path?" | pcb_cli | sed "s/$pcb_path=//"`

        echo -e "\tPARM $param=$value" >> $1
    done
}

case $1 in
    backup)
        # create config file
        create_gwmiddleware_def "$HGWCFG_GWMIDDLEWARE_FILE"

        echo -e "GWMIDDLEWARE: configuration backup finished, settings stored in \"$HGWCFG_GWMIDDLEWARE_FILE\"\n"
        ;;
    restore)
        if [ -f "$HGWCFG_GWMIDDLEWARE_FILE" ]
        then
            cat "$HGWCFG_GWMIDDLEWARE_FILE" >> "$HGWCFG_MBUS_IGD_DEF"
            echo -e "GWMIDDLEWARE: restored backup configuration"
        else
            echo -e "GWMIDDLEWARE: backup configuration not available"
        fi
        ;;
    reset)
        rm -f "$HGWCFG_GWMIDDLEWARE_FILE"
        ;;
    *)
        echo "Usage: $0 [backup|restore|reset]"
        ;;
esac

exit 0
