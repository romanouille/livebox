#!/bin/sh
#=============================================================================
# Copyright : (c) 2010 SAGEMCOM - Site Rueil-Malmaison - ATR-URD2
# The information and source code contained herein is the exclusive
# property of SAGEMCOM and may not be disclosed, examined, or
# reproduced in whole or in part without explicit written authorization
# of the company.
#=============================================================================

# Print on syslog
log()
{
    logger -t '[MESH-SCRIPT] generate_wpa-supplicant.sh' $1
}



. /etc/config_pairing.txt

MESH_ADHOC_WPA2_CONF_FILE=/tmp/etc/wpa2/wpa_supplicant_adhoc-wpa2.conf

log "generating wpa-supplicant configuration file for mesh adhoc network in $MESH_ADHOC_WPA2_CONF_FILE"

conf_ssid_5GHz=`xmo-search Device/Mesh/Pairing/wifi5GhzSsid | cut -f 2 -d "'"`
conf_psk_5GHz=`xmo-search Device/Mesh/Pairing/wifi5GhzSecurityKey | cut -f 2 -d "'"`

generate_file(){
cat <<EOF
ap_scan=1
network={
        ssid="$conf_ssid_5GHz"
        scan_ssid=1
        mode=1
        proto=RSN
        key_mgmt=WPA-PSK
        pairwise=CCMP
        group=CCMP
        psk="$conf_psk_5GHz"
}
EOF
}

mkdir /tmp/etc/wpa2
generate_file > $MESH_ADHOC_WPA2_CONF_FILE
