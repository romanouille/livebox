#!/bin/sh
export climodel=atomic
export clipathtype=index

#global $StaticIPLeasesList
StaticIPLeasesList=""


mark_static_lease() #$1=atomic lease path [index]
{
        dhcp_static_ip_path=
        dhcp_lease_mac=`echo "$1.MACAddress?" | cli --less --synchronize`
        dhcp_lease_ip=`echo "$1.IPAddress?" | cli --less --synchronize`
        #find the pool refs and then key name of the pool, key name of the IP Interface
        dhcp_pool_ref=`echo "$1.PoolReference?1" | cli --less --synchronize`
        dhcp_pool_keyname=`echo "$dhcp_pool_ref.Name?" | cli --less --synchronize`
        dhcp_pool_ipintf=`echo "$dhcp_pool_ref.IPIntf?" | cli --less --synchronize`
        dhcp_pool_ipintfname=`echo "$dhcp_pool_ipintf.Name?" | cli --less --synchronize`

        echo dhcp_lease_mac = $dhcp_lease_mac dhcp_lease_mac = $dhcp_lease_ip dhcp_pool_ipintfname = $dhcp_pool_ipintfname dhcp_pool_keyname = $dhcp_pool_keyname
        #the pool name suffixed with "_default"?
        suffix="_default"
        count=`expr ${#dhcp_pool_keyname} - ${#suffix}`
        if [ ${dhcp_pool_keyname:$count} == "$suffix" ]; then
                #Yes use default dhcp pool of this IP interfaces pool
                dhcp_static_ip_path="InternetGatewayDevice.LANDevice.$dhcp_pool_ipintfname.LANHostConfigManagement.DHCPStaticAddress.$dhcp_lease_mac"
        else
                #else use the conditonal pool[i] of this ip intreface's DHCP pool
                dhcp_static_ip_path="InternetGatewayDevice.LANDevice.$dhcp_pool_ipintfname.LANHostConfigManagement.DHCPConditionalServingPool.$dhcp_pool_keyname.DHCPStaticAddress.$dhcp_lease_mac"
        fi

        #write the command to create static IP entry in the found pool path (IGD model and using Keystring path)
        echo ":$dhcp_static_ip_path+{Yiaddr=$dhcp_lease_ip Chaddr=$dhcp_lease_mac}" | cli --model igd

}


process_static_leases() #parameters global $StaticIPLeasesList
{
        echo StaticIPLeasesList:"$StaticIPLeasesList"
        echo Processing "DHCP.Server.Lease"...
        dhcp_leases=`echo "DHCP.Server.Lease?1" | cli --synchronize`
        first_object=1
        for i in $dhcp_leases; do
                if [ $first_object -eq 1 ]; then
                        first_object=0
                        continue
                fi
                found=0
                for j in $StaticIPLeasesList; do
                    if [ "$j" = "$i" ]; then
                        found=1;
                    fi
                done;
                if [ $found -eq 1 ]; then
                    echo $i will be made static and persistent
                    mark_static_lease $i
                fi
        done;
        #if the command file is created
        echo "DeviceConfig.ConfigSave=1" | cli
        echo Processing "DHCP.Server.Lease" done!
}

process_ip_range() # parameters : $1 = IPAddress, $2 = IPAddressRange
{
        byte0_min="$(echo $1 | cut -d. -f4)"
        byte0_max="$(echo $2 | cut -d. -f4)"
        dhcp_leases=`echo "DHCP.Server.Lease?1" | cli --synchronize`
        first_object=1
        for i in $dhcp_leases; do
                if [ $first_object -eq 1 ]; then
                        first_object=0
                        continue
                fi
                dhcp_lease_ip=`echo "$i.IPAddress?1" | cli --less --synchronize`
                byte0_lease="$(echo $dhcp_lease_ip | cut -d. -f4)"
                if [ $byte0_lease -eq $byte0_min ] || [ $byte0_lease -gt $byte0_min ]; then
                if [ $byte0_lease -eq $byte0_max ] || [ $byte0_lease -lt $byte0_max ]; then
                        found=0
                        for j in $StaticIPLeasesList; do
                            if [ "$j" = "$i" ]; then
                                found=1;
                            fi
                        done;
                        if [ $found -eq 0 ]; then
                            if [ "$StaticIPLeasesList" = "" ]; then
                                StaticIPLeasesList="$i";
                            else
                                StaticIPLeasesList="$StaticIPLeasesList $i"
                            fi
                        fi
                fi
                fi
        done;
}

#may be useful to handle delete, currently not used
process_expr_change_all()
{
        echo Scanning Expr.IPADDR obejct...
        objects=`echo "Expr.IPADDR?1" | cli --synchronize`
        first_object=1
        for i in $objects; do
                if [ $first_object -eq 1 ]; then
                        first_object=0
                        continue
                fi
                subobjects=`echo "$i.Expr?1" | cli --synchronize`
                first_subobject=1
                for j in $subobjects; do
                    if [ $first_subobject -eq 1 ]; then
                        first_subobject=0
                        continue
                    fi
                    IPAddress=`echo "$j.IPAddress?1" | cli --less --synchronize`
                    IPAddressRangeEnd=`echo "$j.IPAddressRangeEnd?1" | cli --less --synchronize`
                    process_ip_range $IPAddress $IPAddressRangeEnd
            done;
        done;
        echo Scanning Expr.IPADDR obejct done!
}

process_expr_change() #$1=Index path of the expresseion changed/added
{
        echo Processing $1 obejct...
        IPAddress=`echo "$1.IPAddress?1" | cli --less --synchronize`
        IPAddressRangeEnd=`echo "$1.IPAddressRangeEnd?1" | cli --less --synchronize`
        process_ip_range $IPAddress $IPAddressRangeEnd
        echo Processing $1 obejct...done!
}

#MAIN block
#Firewall, NATApplist, NAT Templates (created from GUI) use EXPR.IPADDR for IPaddress(es) involved in their rules
echo "dhcp-static-ip upgrade...(Event $1 $2 $3 $4)" #$1=Expr.IPADDR.i.Expr.j

#if the name of the expression ends with _DIP, skip it	
object=$(echo $1 | cut -d . -f 1-3)
name=$(echo $object.Name? | cli | cut -d = -f 2)
match_DIP=$(echo $name | egrep '_DIP$|_SIP$')
if [ -n "$match_DIP" ]; then
	exit 0
fi

expr_mismatch=${1##Expr.IPADDR.*.Expr.*}
if [ ${#expr_mismatch} -eq 0 ]; then
        process_expr_change $1
fi
if [ ${#expr_mismatch} -eq 0 ]; then
        process_static_leases
fi




