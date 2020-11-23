#!/bin/sh

LAN_IF=BR_LAN
WAN_IF=$(ifconfig | grep ^ppp | grep -v grep | cut -d' ' -f1)
SITE_PREFIX=$new_ip6_prefix
SITE_NETWORK=$(echo "$new_ip6_prefix" | cut -d'/' -f1)
PREFIX_LEN=$(echo "$new_ip6_prefix" | cut -d'/' -f2)
CPE_ADDRESS=${SITE_NETWORK}1

killall radvd

/sbin/sysctl -w net.ipv6.conf.all.forwarding=1
ip -6 addr add $CPE_ADDRESS/64 dev $LAN_IF
[ "$PREFIX_LEN" != "64" ] && ip -6 route add unreachable $SITE_PREFIX dev lo
ip -6 route add default dev $WAN_IF

cat << EOF > /etc/radvd.conf
interface $LAN_IF {
    AdvSendAdvert on;
    
    prefix ${SITE_NETWORK}/64 {
        AdvOnLink on;
        AdvAutonomous on;
    };
};
EOF
                            
/usr/sbin/radvd

