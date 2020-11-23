#!/bin/sh
# ============================================================================
# Copyright : (c) 2012 SAGEMCOM - Site Rueil-Malmaison - ATR-URD2
# The information and source code contained herein is the exclusive
# property of SAGEMCOM and may not be disclosed, examined, or
# reproduced in whole or in part without explicit written authorization
# of the company.
# ============================================================================



# ============================================================================
# Include
# ============================================================================
. /etc/config_init_mesh.txt
. /etc/config_pairing.txt



# ============================================================================
# Print on syslog
# ============================================================================
log()
{
    logger -t '[MESH-SCRIPT] mesh_pairing_generate_conf_file.sh' $1
}



# ============================================================================
# Main script
# ============================================================================
lsConfFile="GENERATE_CONF_FILE"



# ============================================================================
# Generate the configuration file: WiFi 5GHz
# ============================================================================
wifi5Ghz_ssid=`xmo-search Device/Mesh/Pairing/wifi5GhzSsid | cut -f 2 -d "'"`
if [ "x$wifi5Ghz_ssid" == "x" ]
then
    end_ssid_5GHz=`ifconfig $MESH_PAIRING_IFACE | grep HWaddr | awk '{print $5}' | cut -d":" -f5-6`
    wifi5Ghz_ssid=mesh_$end_ssid_5GHz
fi
wifi5Ghz_mode=$MODE_5GHZ
if [ $WIFI_SEC_5GHZ -eq 2  ]
then
    wifi5Ghz_sec="wpa2"
    # Get the 5GHz PSK
    if [ "x$PSK_5GHZ" == "x"  ]
    then
        # Get the PSK from ap-config, or if ap-config is not present (first pairing) generate is randomly
        wifi5Ghz_psk=`xmo-search Device/Mesh/Pairing/wifi5GhzSecurityKey | cut -f 2 -d "'"`
        if [ "x$wifi5Ghz_psk" == "x" ]
        then
            wifi5Ghz_psk=""
            length=0
            while [ $length -lt 32 ]
            do
                # Generate a random string (only number, upper and lower case characters) -> lenght = 32
                charhex=`cat /proc/sys/kernel/random/uuid | cut -c 1-2`
                charint=`printf "%d\n" 0x$charhex`
                charstr=`echo 0x$charhex | awk '{printf "%c\n", $1}'`
                if [ $charint -ge 48 ] && [ $charint -le 57 ] ; then
                    wifi5Ghz_psk=$wifi5Ghz_psk$charstr                      
                    length=$((length + 1))
                elif [ $charint -ge 65 ] && [ $charint -le 90 ] ; then
                    wifi5Ghz_psk=$wifi5Ghz_psk$charstr                        
                    length=$((length + 1))
                elif [ $charint -ge 97 ] && [ $charint -le 122 ] ; then
                    wifi5Ghz_psk=$wifi5Ghz_psk$charstr                         
                    length=$((length + 1))
                fi                            
            done      
        fi
    else
        # Get PSK from config_init_mesh.txt
        wifi5Ghz_psk=$PSK_5GHZ
    fi
else
    wifi5Ghz_sec="open"
    wifi5Ghz_psk="-"
fi
lsConfFile=$lsConfFile"#"$wifi5Ghz_sec"#"$wifi5Ghz_psk"#"$wifi5Ghz_mode"#"$wifi5Ghz_ssid



# ============================================================================
# Generate the configuration file: WiFi 2,4GHz
# ============================================================================
# 2.4GHz wlan configuretion isn't necessary during pairing process... You can delete that!
wifi24Ghz_sec=`xmo-search Device/WiFi/AccessPoints/AccessPoint[@uid='1']/Security/ModeEnabled | cut -f 2 -d "'"`
wifi24Ghz_psk=`xmo-search Device/WiFi/AccessPoints/AccessPoint[@uid='1']/Security/KeyPassphrase | cut -f 2 -d "'"`
wifi24Ghz_freq=`xmo-search Device/WiFi/Radios/Radio[@uid='1']/Channel | cut -f 2 -d "'"`
wifi24Ghz_ssid=`xmo-search Device/WiFi/SSIDs/SSID[@uid='1']/SSID | cut -f 2 -d "'"`
lsConfFile=$lsConfFile"#"$wifi24Ghz_sec"#"$wifi24Ghz_psk"#"$wifi24Ghz_freq"#"$wifi24Ghz_ssid



# ============================================================================
# Generate the configuration file: MAC and IP addresses
# ============================================================================
GWC_mesh_wifi_mac=`ifconfig $MESH_PAIRING_IFACE | grep HWaddr | awk '{print $5}'`
if [ "x$GWC_mesh_wifi_mac" == "x" ]
then
    GWC_mesh_wifi_mac="00:00:00:00:00:00"
fi
GWC_mesh_eth_mac=`ifconfig $ETH_IFACE | grep HWaddr | awk '{print $5}' `
if [ "x$GWC_mesh_eth_mac" == "x" ]
then
    GWC_mesh_eth_mac="00:00:00:00:00:00"
fi
GWC_lan_mac=`ifconfig BR_LAN | grep HWaddr | awk '{print $5}'`
if [ "x$GWC_lan_mac" == "x" ]
then
    GWC_lan_mac="00:00:00:00:00:00"
fi
lsConfFile=$lsConfFile"#"$GWC_mesh_wifi_mac"#"$GWC_mesh_eth_mac"#"$GWC_lan_mac



# ============================================================================
# Callback to the mesh-pairing-osm
# ============================================================================
log "Generate configuration file - Callback to the mesh-pairing-osm"
extevt SET Device/Mesh/Pairing/Dummy "$lsConfFile" &



