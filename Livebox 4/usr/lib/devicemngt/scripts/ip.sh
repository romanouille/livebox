#!/bin/sh

# this script sends an email each time the data interface goes up
# the email contains the public IP addresses
# it can be used to connect to the board via SSH

MAIL_BODY="/tmp/ip.mail."`date +%s`

# retrieve the IPv4 and IPv6 addresses
IPV4_ADDR=`pcb_cli -l 'NeMo.Intf.data.luckyAddrAddress("ipv4 && global", "down")'`
IPV6_ADDR=`pcb_cli -l 'NeMo.Intf.data.luckyAddrAddress("ipv6 && global", "down")'`

if [ -n "$IPV4_ADDR" ]
then
    echo "IPv4 address = $IPV4_ADDR" >> $MAIL_BODY
fi
if [ -n "$IPV6_ADDR" ]
then
    echo "IPv6 address = $IPV6_ADDR" >> $MAIL_BODY
fi

if [ -f $MAIL_BODY ]
then
    # report system uptime
    echo "" >> $MAIL_BODY
    echo "Status:`uptime`" >> $MAIL_BODY

    # sleep for a short duration
    # the sending can fail if done
    # immediately after the WAN goes up
    sleep 10
    pcb_cli -q "DeviceManagement.Email.send(\"WAN IP addresses report\", \"$MAIL_BODY\")"
fi
