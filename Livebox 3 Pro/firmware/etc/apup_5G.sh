#!/bin/sh

#=============================================================================
# Copyright : (c) 2010 SAGEMCOM - Site Rueil-Malmaison - ATR-URD2
# The information and source code contained herein is the exclusive
# property of SAGEMCOM and may not be disclosed, examined, or
# reproduced in whole or in part without explicit written authorization
# of the company.
#=============================================================================



# ============================================================================
# Print on syslog
# ============================================================================
log()
{
    logger -t '[MESH-SCRIPT] apup_5G.sh' $1
}



# ============================================================================
# Include
# ============================================================================
. /etc/config_init_mesh.txt
. /etc/config_pairing.txt



# ============================================================================
# Main script
# ============================================================================
mesh_role=$1

if [ "$WIFI_5GHZ" = "1"  ] ; then
    # 5G configuration
    export SW_INTF_ADHOC=${MESH_ADHOC_IFACE}
    export HW_INTF_ADHOC=${MESH_RADIO}

    log "Applying configuration on 5GHz"
    iwpriv ${HW_INTF_ADHOC} setHwaddr ` get_pp 19C | awk -F ""  ' BEGIN { OFS = ":" }    {print $1$2,  $3$4, $5$6, $7$8, $9$10, $11$12}' `
    wlanconfig ${SW_INTF_ADHOC} create wlandev ${HW_INTF_ADHOC} wlanmode adhoc
    iwpriv ${HW_INTF_ADHOC} HALDbg 0
    iwpriv ${HW_INTF_ADHOC} ATHDebug 0x00
    iwpriv ${SW_INTF_ADHOC} dbgLVL 0x00000000
    ifconfig ${SW_INTF_ADHOC} txqueuelen 1000
    ifconfig ${HW_INTF_ADHOC} txqueuelen 1000
    iwpriv ${SW_INTF_ADHOC} shortgi 1
    iwpriv ${HW_INTF_ADHOC} AMPDU 1
    iwpriv ${HW_INTF_ADHOC} AMPDUFrames 32
    iwpriv ${HW_INTF_ADHOC} AMPDULim 50000
    # TxBF and LDPC activated by default, we reactivate them
    iwpriv ${HW_INTF_ADHOC} TxBFCTL 1
    iwpriv ${HW_INTF_ADHOC} LDPC 1
    # desactivate STBC
    iwpriv ${HW_INTF_ADHOC} txstbc 0
    iwpriv ${HW_INTF_ADHOC} rxstbc 0
    # Desactivate UAPSD
    iwpriv ${SW_INTF_ADHOC} uapsd 0
    iwpriv ${SW_INTF_ADHOC} pureg 0
    iwpriv ${SW_INTF_ADHOC} puren 0
    iwpriv ${HW_INTF_ADHOC} setCountry FR
    iwpriv ${SW_INTF_ADHOC} no_wradar 1
    iwconfig ${SW_INTF_ADHOC} freq 0

    # HT40PLUS or HT40MINUS or HT20...
    mode=`xmo-search Device/Mesh/Pairing/wifi5GhzMode | cut -f 2 -d "'"`
    iwpriv ${SW_INTF_ADHOC} mode $mode
    # To enable HT40 on 5GHz (test this)
    iwpriv ${SW_INTF_ADHOC} disablecoext 1
    # Enable hidden SSID
    iwpriv ${SW_INTF_ADHOC} hide_ssid 1
    # Aggregation
    iwpriv ${SW_INTF_ADHOC} ampdu 1

    if [ "x$mesh_role" == "xAP"   ] ; then
        log "Disable adhoc CREATE operation for mesh AP"
        iwpriv ${SW_INTF_ADHOC} noIBSSCreate 1
    fi

    # Security
    security_mode=`xmo-search Device/Mesh/Pairing/wifi5GhzSecurityMode | cut -f 2 -d "'"`
    case "$security_mode" in
        "wpa2" )
            log "5GHz security is wpa2"
            # Generate wpa_supplicant configuration file from ap-configuration
            /etc/scripts/generate_wpa-supplicant.sh
            wpa_supplicant -ddt -Dathr -i ${SW_INTF_ADHOC} -c /tmp/etc/wpa2/wpa_supplicant_adhoc-wpa2.conf > /dev/null &
        ;;

        # Else, default is open mode
        * )
            log "5GHz security is open"
            # Set ssid
            ssid=`xmo-search Device/Mesh/Pairing/wifi5GhzSsid | cut -f 2 -d "'"`
            iwconfig ${SW_INTF_ADHOC} essid $ssid
    esac

    ifconfig ${SW_INTF_ADHOC} up

    # Modify MTU here for GW -> GWC use case
    ifconfig ${SW_INTF_ADHOC} mtu 1540

    # RSSI monitoring default values
    iwpriv ${SW_INTF_ADHOC} setibssrssiclass 70 80 85 95 95 95 95
    iwpriv ${SW_INTF_ADHOC} setibssrssihyst 2
    iwpriv ${SW_INTF_ADHOC} startibssrssimon 1

fi
sleep 3



