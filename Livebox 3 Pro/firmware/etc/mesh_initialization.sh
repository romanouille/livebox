#!/bin/sh
#=============================================================================
# Copyright : (c) 2010 SAGEMCOM - Site Rueil-Malmaison - ATR-URD2
# The information and source code contained herein is the exclusive
# property of SAGEMCOM and may not be disclosed, examined, or
# reproduced in whole or in part without explicit written authorization
# of the company.
#=============================================================================



VETH_LAN_SIDE="veth"
VETH_MESH_SIDE="veth_meshside"
BR_MESH="br_mesh"
BR_LAN="BR_LAN"
GRENAMEPREF="lgre"



# ============================================================================
# Print on syslog
# ============================================================================
log()
{
    logger -t '[MESH-SCRIPT] mesh_initalization.sh' $1
}



# ============================================================================
# Subfunctions
# ============================================================================
create_mesh_architecture()
{
    # create veth link
    ifconfig $VETH_LAN_SIDE 2> /dev/null
    if [ $? -ne 0  ]
    then
        log "create veth link"
        ip link add name $VETH_LAN_SIDE type veth peer name $VETH_MESH_SIDE

        if [ $? -ne 0 ]; then
            log "Problem during veth link creation... aborting"
            exit
        fi

        log "change mac address of veth"
        ifconfig $VETH_LAN_SIDE hw ether $1

        log "veth Lan side up"
        ifconfig $VETH_LAN_SIDE up

        log "veth mesh side up"
        ifconfig $VETH_MESH_SIDE up

    else
        # veth already created
        # do nothing
        log "veth link already present... continuing"

    fi

    # create mesh Bridge
    ifconfig $BR_MESH 2> /dev/null
    if [ $? -ne 0  ]
    then
        log "create mesh bridge"
        brctl addbr $BR_MESH

        if [ $? -eq 0  ]
        then
            # set bridge up
            log "mesh bridge up"
            ifconfig $BR_MESH up

            # stop stp on mesh bridge
            log "mesh bridge: stp disable"
            brctl stp $BR_MESH 0

            # Disable ARP on mesh bridge
            log "mesh bridge: ARP disable"
            ifconfig $BR_MESH -arp

        else
            # something went wrong....
            log "problem in Mesh Bridge creation"
        fi

    else
        # br_mesh already created
        #do nothing
        log "mesh Bridge already created... continuing"

    fi

    # Add veth link in mesh bridge
    brctl addif $BR_MESH $VETH_MESH_SIDE
    if [ $? -ne 0 ]; then
        log "Problem in brctl addif $BR_MESH $VETH_MESH_SIDE"
    else
        log "adding $VETH_MESH_SIDE in $BR_MESH"
    fi

    # Add veth link in LAN bridge
    brctl addif $BR_LAN $VETH_LAN_SIDE
    if [ $? -ne 0 ]; then
        log "Problem in brctl addif $BR_LAN $VETH_LAN_SIDE"
    else
        log "Adding $VETH_LAN_SIDE in $BR_LAN"
        ebtables -A FORWARD -i $VETH_LAN_SIDE -o $VETH_LAN_SIDE -j DROP
    fi

    # Setup ebtables non-forwarding rules
    ebtables -t filter -A FORWARD -i $GRENAMEPREF"+" -o $GRENAMEPREF"+" -j DROP
    if [ $? -ne 0 ]; then
        log "Problem when setting up ebtables non-forwarding rules"
    else
        log "Setting up ebtables non-forwarding rules"
    fi

    # Allow UPnP to mesh network
    sysutil igmpsnoop $BR_LAN enable
    if [ $? -ne 0 ]; then
        log "Enable igmsnoop on $BR_LAN failed"
    else
        sysutil igmpsnoop $BR_LAN addgrp 239.255.255.250 $VETH_LAN_SIDE
        if [ $? -ne 0 ]; then
            log "Allow UPnP to mesh network failed"
        fi
    fi
}



# ============================================================================
# Includes
# ============================================================================
. /etc/config_init_mesh.txt
. /etc/config_pairing.txt



# ============================================================================
# Main script
# ============================================================================
sleep 13



mesh_state=$1
echo mesh_state = $mesh_state
mac_address=$2
echo mac_address = $mac_address

if [ "$mesh_state" = "GWC" ]
then
    log "enabling STP on BR_LAN"
    brctl stp $BR_LAN 1


    log "box is GWC !"

#echo 0 > /proc/sys/net/bridge/bridge-nf-call-iptables

    #log "configuring ethernet switch for mesh ethernet"
    #/usr/sbin/ath8327_mesh_enable.sh

    # Static configuration on mesh  interfaces
    #ip addr add 169.254.1.2/32 dev $MESH_ETH_IFACE
    ip addr add 10.10.1.2/32 dev $MESH_ETH_IFACE
    log "static configuration on mesh ethernet interface"
    #ip link set eth0.10 up
    #ifconfig eth0.10 169.254.1.1/16
    #log static configuration on mesh ethernet interface
    #ip route add 169.254.0.0/16 dev eth0.10

    #setup MTU (this fails in the GW > GWC use case but is done in apup_5G)
    ifconfig $MESH_ADHOC_IFACE mtu 1540
    
    #ip addr add 169.254.1.1/32 dev $MESH_ADHOC_IFACE
    ip addr add 10.10.1.1/32 dev $MESH_ADHOC_IFACE
    #ifconfig wlan0 169.254.2.1/16
    log "static configuration on 5GHz wifi mesh interface"
    #ip route add 169.254.0.0/16 dev wlan0

    # set up multicast route so that multicast packets
    # stay in the LAN / MESH Network.
    #route add -net 224.0.0.0 netmask 240.0.0.0 dev br0


    # Create double-bridge-and-veth architecture
    echo create_mesh_architecture\(\)
    create_mesh_architecture $mac_address

    #log "starting mesh-wlan"
    #/etc/init.d/mesh-wlan/mesh-wlan start $2

    

    /etc/mesh_firewall.sh GWC

else if [ "$mesh_state" = "AP" ]
then
    log "enabling STP on BR_LAN"
    brctl stp $BR_LAN 1

    # box is AP
    log "box is AP !"

    #log "configuring ethernet switch for mesh ethernet"
    #/usr/sbin/ath8327_mesh_enable.sh

    ip_mesh_wlan=`xmo-search Device/Mesh/Pairing/apMeshWlanIp | cut -f 2 -d "'"`
    ip_mesh_eth=`xmo-search Device/Mesh/Pairing/apMeshEthIp | cut -f 2 -d "'"`

    # ZeroConf configuration of mesh interface
    #log "ZeroConf launched on eth0.10"
    #zcip $MESH_ETH_IFACE /usr/sbin/zcip.script
    log "setting static IP on $MESH_ETH_IFACE"
    ip addr add $ip_mesh_eth/32 dev $MESH_ETH_IFACE
    #ip addr add 169.254.$1.$1/32 dev eth0.10
    #log ZeroConf launched on eth0.10

    # 5GHz MESH Interface initialization
    #setup MTU
    ifconfig $MESH_ADHOC_IFACE mtu 1540
    #log "ZeroConf launched on $MESH_ADHOC_IFACE" 
    #zcip $MESH_ADHOC_IFACE /usr/sbin/zcip.script
    # ip addr add 169.254.$1$1.$1$1/32 dev wlan1
    #log "ZeroConf launched on $MESH_ADHOC_IFACE"
    log "setting static IP on $MESH_ADHOC_IFACE"
    ip addr add $ip_mesh_wlan/32 dev $MESH_ADHOC_IFACE



    # Create double-bridge-and-veth architecture
    log  "creating mesh-wlan architecture with double bridge"
    create_mesh_architecture $mac_address

    #log "starting mesh-wlan"
    #/etc/init.d/mesh-wlan/mesh-wlan start $2


    /etc/mesh_firewall.sh AP


else
# mode GW specific here
    log "box is GW !"
    #echo box is GW !

  /etc/mesh_firewall.sh GW
fi
fi

