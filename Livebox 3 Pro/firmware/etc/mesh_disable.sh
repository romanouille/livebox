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
    logger -t '[MESH-SCRIPT] mesh_disable.sh' $1
}



# ============================================================================
# Includes
# ============================================================================
. /etc/config_init_mesh.txt
. /etc/config_pairing.txt
VETH_LAN_SIDE="veth"
VETH_MESH_SIDE="veth_meshside"
BR_MESH="br_mesh"
BR_LAN="BR_LAN"
GRENAMEPREF="lgre"



# ============================================================================
# Main script
# ============================================================================
sleep 10

log "Destroying wlan adhoc interface on $MESH_ADHOC_IFACE"
killall wpa_supplicant
ifconfig $MESH_ADHOC_IFACE down
wlanconfig $MESH_ADHOC_IFACE destroy

log "Down all interface"
ifconfig $VETH_LAN_SIDE down
ifconfig $VETH_MESH_SIDE down
ifconfig $BR_MESH down

log "Delete interface $VETH_LAN_SIDE from $BR_LAN"
brctl delif $BR_LAN $VETH_LAN_SIDE

log "Delete bridge $BR_MESH"
brctl delbr $BR_MESH

log "Delete link $VETH_LAN_SIDE"
ip link del $VETH_LAN_SIDE



