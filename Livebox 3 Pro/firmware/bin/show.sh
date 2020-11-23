#!/bin/sh
# Retrieve software versions of ipl, bootloader, operational, rescue
# (c) 2011 SAGEMCOM 
#
BCM_MTD=`grep bcmfs /proc/mtd | awk 'FS=":" {print $1}'`
if [ "$BCM_MTD" != "" ]
then 
    CFEROM_OFF=1397
    CFEROM_MTD=`grep nvram /proc/mtd | awk 'FS=":" {print $1}'`
    if [ "$CFEROM_MTD" != "" ]
    then
        CFEROM_PATTERN=`head -c $CFEROM_OFF /dev/$CFEROM_MTD | tail -c 5`
        if [ "$CFEROM_PATTERN" == "cfe-v" ]
        then
            CFEROM_V=`hexdump -n 5 -s $CFEROM_OFF -e '"" 1/1  "%d."' /dev/$CFEROM_MTD `
            IPL_V="$CFEROM_V"
        fi
    fi
    BOOT_MTD=`grep uboot /proc/mtd | awk 'FS=":" {print $1}'`
    for mtd in $BOOT_MTD
    do
	
       BOOT_V1=`strings /dev/$mtd  | grep Version: | head -n 1`
       BOOT_V2=""
    done
fi

IPL_MTD=`grep ipl /proc/mtd | awk 'FS=":" {print $1}'`
if [ "$IPL_MTD" != "" ]
then
    UBI_BOOT=`strings  /dev/$IPL_MTD | grep "ubi support" | head -n 1`
fi

if [ "$UBI_BOOT" != "" ]
then
    if [ "$IPL_MTD" != "" ]
    then  
        IPL_V=`strings  /dev/$IPL_MTD | grep Version: | head -n 1`
    fi
    SPL_MTD=`grep secondaryboot /proc/mtd | awk 'FS=":" {print $1}'`
    if [ "$SPL_MTD" != "" ]
    then  
        SPL_V=`strings  /dev/$SPL_MTD | grep Version: | head -n 1`
    fi
    BOOT_MTD=`grep uboot /proc/mtd | awk 'FS=":" {print $1}'`
    if [ "$BOOT_MTD" != "" ]
    then  
        BOOT_V1=`strings  /dev/$BOOT_MTD | grep Version: | head -n 1`
        BOOT_V2=""
    fi
else
    if [ "$IPL_MTD" != "" ]
    then  
        IPL_V=`strings  /dev/$IPL_MTD | grep Sagemcom | head -n 1`
        BOOT_V1=`strings  /dev/$IPL_MTD | grep U-Boot | head -n 1`
        BOOT_V2=`strings  /dev/$IPL_MTD | grep SAGEMCOM | head -n 1`
    fi
fi

PERM_MTD=`grep permanent_param /proc/mtd | awk 'FS=":" {print $1}'`
if [ "$PERM_MTD" != "" ]
then
    PERM_V=`head -c 8 /dev/$PERM_MTD 2> /dev/null | tail -c 4 `
fi

OPER_MTD=`grep operational /proc/mtd | awk 'FS=":" {print $1}'`
if [ "$OPER_MTD" != "" ]
then
    OPER_OFF=`head -c 152 /dev/$OPER_MTD 2> /dev/null | tail -c 4 | hexdump -e '"" "%d"'`
    OPER_OFF=$(($OPER_OFF+64))
    OPER_V=`head -c $OPER_OFF /dev/$OPER_MTD 2> /dev/null | tail -c 32`
    OPER_GSDF=`head -c 8 /dev/$OPER_MTD 2> /dev/null | grep GSDF`
fi
if [ "$OPER_GSDF" != "" ]
then
    OPER_GSDF="file format is GSDF"
fi

RESC_MTD=`grep rescue /proc/mtd | awk 'FS=":" {print $1}'`
if [ "$RESC_MTD" != "" ]
then
    RESC_OFF=`head -c 152 /dev/$RESC_MTD 2> /dev/null | tail -c 4 | hexdump -e '"" "%d"'`
    RESC_OFF=$(($RESC_OFF+64))
    RESC_V=`head -c $RESC_OFF /dev/$RESC_MTD 2> /dev/null | tail -c 32`
    RESC_GSDF=`head -c 8 /dev/$RESC_MTD 2> /dev/null | grep GSDF`
fi
if [ "$RESC_GSDF" != "" ]
then
    RESC_GSDF="file format is GSDF"
fi

echo "IPL                  : $IPL_V"  
if [ "$SPL_V" != "" ]
then
 echo "SPL                  : $SPL_V"
fi
echo "BOOT                 : $BOOT_V1"
if [ "$BOOT_V2" != "" ]
then
 echo "                       $BOOT_V2"
fi
echo "PERMANENT Parameters : $PERM_V"
echo "OPERATIONAL software : $OPER_V  $OPER_GSDF"
echo "RESCUE software      : $RESC_V  $RESC_GSDF"

# In case of gui partition
GUI_MTD=`grep \"gui\" /proc/mtd | awk 'FS=":" {print $1}'`
if [ "$GUI_MTD" != "" ]
then
    GUI_OFF=64
    GUI_V=`head -c $GUI_OFF /dev/$GUI_MTD 2> /dev/null | tail -c 32`
    echo "GUI                  : $GUI_V"
fi

# In case of factory test software
if [ -e /bin/mcpu_utils ]
then
    # Get Board Type
    source /bin/get_board_type.sh
    
    # Configuration for Fast3965 in LBPROV3
    if [ "$BOARD_TYPE_FAST" = "Fast3965" ] && [ "$BOARD_TYPE_SHORT" = "LBPROV3" ]
    then
        echo ""
        # Get MCPU FW Version
        GET_VERSION=`mcpu_utils -v`
        MCPU_FW_VERSION=`cat /tmp/mcpu_fw_ver.txt`
        echo "MCPU Fw Version      : $MCPU_FW_VERSION"
    
        # Test if SIM Card Present
        TEST_CONNECT=`mcpu_utils -s`
        if [ "$?" != 0 ]
        then
            echo "SIM Card             : PRESENT"
        else
            echo "SIM Card             : ABSENT"
        fi
    fi
fi

