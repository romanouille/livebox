#!/bin/sh
# =============================================================================
# Copyright : (c) 2012 SAGEMCOM - Site Rueil-Malmaison - ATR-URD2
# The information and source code contained herein is the exclusive
# property of SAGEMCOM and may not be disclosed, examined, or
# reproduced in whole or in part without explicit written authorization
# of the company.
# =============================================================================



# ============================================================================
# Include
# ============================================================================
. /etc/config_pairing.txt
. /etc/config_init_mesh.txt



# ============================================================================
# Print on syslog
# ============================================================================
log()
{
    logger -t '[MESH-SCRIPT] mesh_pairing_failure.sh' $1
}



# ============================================================================
# Main script
# ============================================================================
mesh_state=$1
log "Role is $mesh_state"

ifconfig $MESH_PAIRING_IFACE 0.0.0.0
ifconfig $MESH_PAIRING_IFACE down
wlanconfig $MESH_PAIRING_IFACE destroy

if [ "$mesh_state" == "AP" ]; then
    killall wpa_supplicant
    killall dhclient
    rm /tmp/etc/dhclient_wlan_meshp3.lease
    sleep 5
    /etc/apup_5G.sh AP
    ifconfig $MESH_ADHOC_IFACE mtu 1540
    ip_mesh_wlan=`xmo-search Device/Mesh/Pairing/apMeshWlanIp | cut -f 2 -d "'"`
    ip_mesh_eth=`xmo-search Device/Mesh/Pairing/apMeshEthIp | cut -f 2 -d "'"`
    ip addr add $ip_mesh_wlan/32 dev $MESH_ADHOC_IFACE
    ip addr add $ip_mesh_eth/32 dev $MESH_ETH_IFACE
fi

if [ "$mesh_state" == "GWC" ]; then
    killall hostapd_cli
    kill `cat /tmp/etc/wpa2/hpd_pairing.pid`
    kill `cat /tmp/etc/dhcpd.mesh.pid`
    rm /tmp/etc/wpa2/hostapd_wps_pairing.conf
    rm /tmp/etc/dhcpd.mesh.conf
    rm /tmp/etc/dhcpd.mesh.lease
    rm /tmp/etc/dhcpd.mesh.pid
    sleep 5
    /etc/apup_5G.sh GWC
    ifconfig $MESH_ADHOC_IFACE mtu 1540
    ip addr add 10.10.1.1/32 dev $MESH_ADHOC_IFACE
    ip addr add 10.10.1.2/32 dev $MESH_ETH_IFACE
fi

if [ "$mesh_state" == "GW" ]; then
    killall hostapd_cli
    killall wpa_supplicant
    killall dhclient
    kill `cat /tmp/etc/wpa2/hpd_pairing.pid`
    kill `cat /tmp/etc/dhcpd.mesh.pid`
    rm /tmp/etc/wpa2/hostapd_wps_pairing.conf
    rm /tmp/etc/dhcpd.mesh.conf
    rm /tmp/etc/dhcpd.mesh.lease
    rm /tmp/etc/dhcpd.mesh.pid
    rm /tmp/etc/dhclient_wlan_meshp3.lease
fi



