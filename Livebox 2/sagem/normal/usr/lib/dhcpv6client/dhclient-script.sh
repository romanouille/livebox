#!/bin/sh

[ -z "$intf" ] && exit 1

if [ -n "$prefixpath" ]
then
	export PATH=$PATH:$prefixpath/bin
	export LD_LIBRARY_PATH=$prefixpath/lib
	export PCB_PLUGIN_PATH=$prefixpath/usr/lib/pcb
fi

export PCB_CLI_URI=$sysbus

logger -t dhcpv6client "dhclient-script called for $intf, reason=$reason"

if [ "$reason" == "BOUND6" -o "$reason" == "RENEW6" -o "$reason" == "REBIND6" ]
then
	args=`env | sed 's/"/\\\\"/g' | sed -rn 's/^new_([^=]*)=([^=]*)/\1=\"\2\"/p'`
	pcb_cli "NeMo.Intf.$intf.receiveOptions(${args})"
	if [ -n "$new_ip6_address" -a -n "$new_ip6_prefixlen" -a -n "$new_max_life" -a -n "$new_preferred_life" ]
	then
		[ "$new_max_life" == "0" ] && new_max_life=forever
		[ "$new_preferred_life" == "0" ] && new_preferred_life=forever
		logger "ip address replace $new_ip6_address/$new_ip6_prefixlen dev $interface valid_lft $new_max_life preferred_lft $new_preferred_life"
		ip address replace $new_ip6_address/$new_ip6_prefixlen dev $interface valid_lft $new_max_life preferred_lft $new_preferred_life
	fi
elif [ "$reason" == "EXPIRE6" ]
then
	pcb_cli "NeMo.Intf.$intf.flushOptions()"
	if [ -n "$old_ip6_address" -a -n "$old_ip6_prefixlen" ]
	then
		ip address del $old_ip6_address/$old_ip6_prefixlen dev $interface valid_lft $new_max_life preferred_lft $new_preferred_life
	fi
fi	

