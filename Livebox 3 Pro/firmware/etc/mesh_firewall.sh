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
    logger -t '[MESH-SCRIPT] mesh_firewall.sh' $1
}



log "adding mesh-specific firewall rules"

. /etc/config_init_mesh.txt

MESH_SUBNETWORK="10.10.0.0/16"
PAIRING_SUBNETWORK="192.168.234.0/8"
MESH_BROADCAST="255.255.255.255"

mesh_state=$1

log "initializing firewall for mesh traffic \in $mesh_state mode"


# declaration of Mesh Interfaces
firewall-cli add interface -i $MESH_ADHOC_IFACE  -x MESH_5G
#firewall-cli add interface -i $MESH_ETH_IFACE  -x MESH_ETH
firewall-cli add interface -i $MESH_PAIRING_IFACE -x MESH_PAIRING

if [ "$mesh_state" != "GW" ]
then
    # OUTPUT
    firewall-cli add outgoing -x MESH_5G --protocol gre --to $MESH_SUBNETWORK
    #firewall-cli add outgoing -x MESH_ETH --protocol gre --to $MESH_SUBNETWORK

    # FORWARDING 
    firewall-cli add forwarding -f MESH_5G -t MESH_5G  --protocol gre --from $MESH_SUBNETWORK --to $MESH_SUBNETWORK
    #firewall-cli add forwarding -f MESH_ETH -t MESH_ETH --protocol gre --from $MESH_SUBNETWORK --to $MESH_SUBNETWORK
    #firewall-cli add forwarding -f MESH_5G -t MESH_ETH  --protocol gre --from $MESH_SUBNETWORK --to $MESH_SUBNETWORK
    #firewall-cli add forwarding -f MESH_ETH -t MESH_5G  --protocol gre --from $MESH_SUBNETWORK --to $MESH_SUBNETWORK

    # INPUT
    firewall-cli add ingoing -x MESH_5G --protocol gre --from $MESH_SUBNETWORK
    #firewall-cli add ingoing -x MESH_ETH --protocol gre --from $MESH_SUBNETWORK 

    ## OLSR Rules
    firewall-cli add outgoing -x MESH_5G -p olsr 
    #firewall-cli add outgoing -x MESH_ETH -p olsr
    firewall-cli add ingoing -x MESH_5G -p olsr 
    #firewall-cli add ingoing -x MESH_ETH -p olsr
fi

if [ "$mesh_state" == "AP" ]
then
    firewall-cli add outgoing -x IP_BR_LAN -p ntp
    firewall-cli add outgoing -x IP_BR_LAN -p dns
    firewall-cli add outgoing -x IP_BR_LAN -p http
    firewall-cli add outgoing -x IP_BR_LAN -p https
    firewall-cli add outgoing -x IP_BR_LAN -p traceroute

    firewall-cli add ingoing -x IP_BR_LAN -p ntp
    firewall-cli add ingoing -x IP_BR_LAN -p https
    firewall-cli add ingoing -x IP_BR_LAN -p http
    firewall-cli add ingoing -x IP_BR_LAN -p dns
    firewall-cli add ingoing -x IP_BR_LAN -p traceroute
fi 



