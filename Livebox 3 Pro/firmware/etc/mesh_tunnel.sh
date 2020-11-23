#!/bin/sh
# =============================================================================
# Copyright : (c) 2012 SAGEMCOM - Site Rueil-Malmaison - ATR-URD2
# The information and source code contained herein is the exclusive
# property of SAGEMCOM and may not be disclosed, examined, or
# reproduced in whole or in part without explicit written authorization
# of the company.
# =============================================================================



# ============================================================================
# Print on syslog
# ============================================================================
log()
{
    logger -t '[MESH-SCRIPT] mesh_tunnel.sh' $1
}



# ============================================================================
# Main script
# ============================================================================
localIP=$1
remoteIP=$2
cmd=$3
tunnel_name=$4
bridge_name="br_mesh"
greTTL=64


# ADD COMMAND 
if [ "$cmd" = "add" ]; then
    log "Add tunnel_name($tunnel_name) localIP($localIP) remoteIP($remoteIP)"

    # Let's create the tunnel
    ip link add $tunnel_name type gretap ttl $greTTL local $localIP remote $remoteIP tos inherit
    exitcode=$?
    if [ "$exitcode" != "0" ]; then
        len=$(eval echo $remoteIP | wc -c)
        log "Err($exitcode): Can not create the tunnel $tunnel_name: $*"
        exit 1
    fi

    # Let's activate it
    ifconfig $tunnel_name mtu 1500
    ifconfig $tunnel_name up
    exitcode=$?
    if [ "$exitcode" != "0" ]; then
        # let's delete the tunnel itsetf
        ip link del $tunnel_name
        len=$(eval echo $remoteIP | wc -c)
        log "Err($exitcode): Can not activate tunnel $tunnel_name: $*"
        exit 1
    fi

    # Let's insert it into the mesh-bridge
    brctl addif $bridge_name $tunnel_name
    exitcode=$?
    if [ "$exitcode" != "0" ]; then
    # let's delete the tunnel itsetf
        ip link del $tunnel_name
        len=$(eval echo $remoteIP | wc -c)
        log "Err($exitcode): Can not add tunnel $tunnel_name into $bridge_name: $*"
        exit 1
    fi

    len=$(eval echo $remoteIP | wc -c)
    log "Tunnel $tunnel_name created: $*"



# REMOVE COMMAND 
elif [ "$cmd" = "remove" ]; then
    log "Delete tunnel_name($tunnel_name) localIP($localIP) remoteIP($remoteIP)"
    # Let's remove the tunnel from the mesh-bridge
    brctl delif $bridge_name $tunnel_name
    exitcode=$?
    if [ "$exitcode" != "0" ]; then
    # let's delete the tunnel itsetf
        log "Err($exitcode): Can not remove tunnel $tunnel_name from $bridge_name: $*"
    fi

    # let's delete the tunnel itsetf
    ip link del $tunnel_name
    exitcode=$?
    if [ "$exitcode" != "0" ]; then
    # let's delete the tunnel itsetf
        log "Err($exitcode): Can not delete tunnel $tunnel_name: $*"
        exit 1
    fi
    log "Tunnel $tunnel_name deleted: $*"



else
    log "Bad command for tunnel management: $*"
    exit 1
fi
exit 0



