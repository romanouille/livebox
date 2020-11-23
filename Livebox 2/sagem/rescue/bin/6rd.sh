#!/bin/sh

echo 1 > /proc/sys/net/ipv6/conf/vlan_data/disable_ipv6

RELAYROUTER=$1
V6PREFIX=2001:470:d39b:e000
V6PREFIX2=2001:470:d39b:e001

WANIP=$(ip -4 addr show dev vlan_data | grep 'inet ' | \
sed -e 's/\(.*\) \(.*\) \([:blank:].*[:blank:]\)/\2/' | \
cut -d/ -f1)

if [ -n "$WANIP" ]
then 

PARTS=`echo $WANIP | tr . ' '`
IP6=`printf "$V6PREFIX::%02x%02x:%02x%02x" $PARTS`

# create tunnel
ip tunnel add 6rd mode sit ttl 80 remote any local $WANIP
# bring the tunnel up
ip link set dev 6rd up
# add a address to the tunnel 
ip -6 addr add $IP6/51 dev 6rd
ip -6 route add 2000::/3 via ::$RELAYROUTER dev 6rd metric 1
else
echo "failed to get WANIP"
fi

ip6tables -P FORWARD ACCEPT

ip addr add $V6PREFIX2::1/64 dev bridge
kill $(cat /var/run/radvd.pid)
echo "interface bridge { \
MinRtrAdvInterval 3; MaxRtrAdvInterval 10; AdvLinkMTU 1280; AdvSendAdvert on; \
prefix $V6PREFIX2::/64 { AdvOnLink on; AdvAutonomous on; AdvValidLifetime 86400; \
AdvPreferredLifetime 86400; }; };" \
> /tmp/radvd.conf
radvd -C /tmp/radvd.conf start

