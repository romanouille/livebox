#!/bin/sh

# $1 = PPPvRemoteIP
# $2 = mPPPvIfcName
# $3 = ROUTING_TABLE_NUMBER

ip route add default via $1 dev $2 table $3
# ip route add $1 dev $2 scope link table $3
ip route show table main | grep $2 | while read rule; do ip route del $rule; done




