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
    logger -t '[MESH-SCRIPT] mesh_pairing_GW_GWC.sh' $1
}



# ============================================================================
# Main script
# ============================================================================
sleep 5
log "Setting Mesh Role to GWC"
extevt SET Device/Mesh/MeshManager/Role 1
sleep 5
/etc/apup_5G.sh
ip addr add 10.10.1.1/32 dev $MESH_ADHOC_IFACE
return 0



