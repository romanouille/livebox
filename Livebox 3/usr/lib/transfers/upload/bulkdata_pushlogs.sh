#!/bin/sh

#####################################################################################
# INFO
#####################################################################################
#
# This script uploads the "Vendor log file" for a server FTPS. 
# This script is also responsible for updating the QueuedTransfer status.
# 
# STEPS:
# - Generate the log file via pcb_cli
# - Upload the log file to the specified server
#
# POSSIBLE ERROR CODES:
#  0:    no error
#  9001: Request denied  
#  9002: Internal error 
#  9010: Download failure (associated with Download, TransferComplete or AutonomousTransferComplete methods). 
#  9011: Upload failure (associated with Upload, TransferComplete or AutonomousTransferComplete methods). 
#  9012: File transfer server authentication failure (associated with Upload, Download, TransferComplete or AutonomousTransferComplete methods). 
#  9014: Download failure: unable to join multicast group (associated with Download, TransferComplete or AutonomousTransferComplete methods). 
#  9015: Download failure: unable to contact file server (associated with Download, TransferComplete or AutonomousTransferComplete methods). 
#  9016: Download failure: unable to access file (associated with Download, TransferComplete or AutonomousTransferComplete methods). 
#  9017: Download failure: unable to complete download (associated with Download, TransferComplete or AutonomousTransferComplete methods). 
#  9018: Download failure: file corrupted (associated with Download, TransferComplete or AutonomousTransferComplete methods). 
#  9019: Download failure: file authentication failure (associated with Download, TransferComplete or AutonomousTransferComplete methods). 
#  
#####################################################################################
fn_exists()
{
    type $1 2>/dev/null | grep -q 'function'
}

source /usr/lib/transfers/transfer_functions.sh

SERIAL_NUMBER="UNKOWN"
PRODUCT_CLASS="UNKNOWN"
WAN_ADDR="00:01:02:03:04:05"
MANUFACTURER="UNKNOWN"
SW_VERSION="$(pcb_cli -l DeviceInfo.SoftwareVersion?)"

if [ -f /etc/environment ]; then
  source /etc/environment
fi

#####################################################################################
# Defaults
#####################################################################################

DIRNAME="$(pcb_cli -l Devices.Device.lan.PhysAddress?|cut -d '=' -f 2|tr -d ':')_$(date '+%Y%m%d')"
LOGFILE="${DIRNAME}/${DIRNAME}.csv"

#####################################################################################
# Command line argument parsing
#####################################################################################
parse_command_line $*

#####################################################################################
# Generic functions
#####################################################################################
# $1 : input, $2 $3 : translation equivalence
# N.B. : If $3 contains one more value (space-separated) than $2, it will be used as "else" value
translate_arg () {
    loc_idx=0
    loc_res=""

    for el in $2; do
        if [ "$1" == "$el" ]; then
            break
        fi
        loc_idx=$(( $loc_idx + 1 )) 
    done
    scd_loc_idx=0
    for el in $3; do
        if [ $scd_loc_idx -eq $loc_idx ]; then
            loc_res="$el"
            break
        fi
        scd_loc_idx=$(( $scd_loc_idx + 1 ))
    done
    echo "$loc_res"
}

# $1 : input yyyy-mm-ddThh:mm:ssZ
# output : ddmmyy hhmmss
format_time() {
    in_time="$1"
    day=`echo "$in_time" | cut -f 1 -d T`
    hour=`echo "$in_time" | cut -f 2 -d T`

    yy=`echo "$day" | cut -f 1 -d '-' | tail -c 3`
    mm=`echo "$day" | cut -f 2 -d '-'`
    dd=`echo "$day" | cut -f 3 -d '-'`

    hh=`echo "$hour" | cut -f 1 -d ':'`
    mi=`echo "$hour" | cut -f 2 -d ':'`

    echo "$dd$mm$yy $hh$mi"
}


#####################################################################################
# Trigger the backup
#####################################################################################
cd /tmp/
mkdir -p $DIRNAME

echo -n "GATEWAY NAME," > $LOGFILE
pcb_cli -l DeviceInfo.ProductClass? >> $LOGFILE
echo -n "IAD SERIAL NUMBER," >> $LOGFILE
pcb_cli -l DeviceInfo.SerialNumber? >> $LOGFILE

software_version=`pcb_cli -l 'DeviceInfo.SoftwareVersion?'`
software_version_date=`grep -m 1 'BUILD_START' '/web/version.txt'`
software_version_date=`echo "$software_version_date" | cut -f 2 -d '='`
echo "FIRMWARE VERSION,$software_version($software_version_date)" >> $LOGFILE

# No info presented by following pcb_cli call :
# pcb_cli -l Devices.Device.HGW.BootLoaderVersion? >> $LOGFILE
# So we use readrip directly until the bug 90940 is fixed
bootloader_version=`readrip -s BOOTLOADER_VERSION`
echo "BOOTLOADER VERSION,$bootloader_version" >> $LOGFILE

echo -n "HARDWARE VERSION," >> $LOGFILE
pcb_cli -l DeviceInfo.HardwareVersion? >> $LOGFILE

echo -n "MEASURE PERIOD," >> $LOGFILE
# Using UpTime (DeviceInfo.UpTime) would give us the time laps since the sysem's last reboot
# Using CPUStats info gives us the time laps since last file 
cpu_ret_count=`pcb_cli -l NMC.DeviceStats.Profile.CPUStats.RetrievalCount?`
cpu_period=`pcb_cli -l NMC.DeviceStats.Profile.CPUStats.Periodicity?`
echo $(( $cpu_ret_count * $cpu_period )) >> $LOGFILE

# CPU Info
cpu_stats=`pcb_cli 'NMC.DeviceStats.Profile.CPUStats.getStats(CPUStats)'`
cpu_stats=`echo "$cpu_stats" | tr -d ' ,'`
cpu_stats_max=`echo "$cpu_stats" | grep "max" | cut -f 2 -d :`
cpu_stats_min=`echo "$cpu_stats" | grep "min" | cut -f 2 -d :`
cpu_stats_av=`echo "$cpu_stats" | grep "average" | cut -f 2 -d :`

echo "CPU load average,$cpu_stats_av%" >> $LOGFILE
echo "CPU load min,$cpu_stats_min%" >> $LOGFILE
echo "CPU load max,$cpu_stats_max%" >> $LOGFILE

# Reset the statistics profile for cpu
pcb_cli -q 'NMC.DeviceStats.resetProfile(CPUStats)'

# Memory Info
mem_total=`pcb_cli -l 'DeviceInfo.MemoryStatus.Total?'`
mem_free_stats=`pcb_cli 'NMC.DeviceStats.Profile.MemStats.getStats("DeviceInfo.MemoryStatus")'`
mem_free_stats=`echo "$mem_free_stats" | tr -d ' ,'`
mem_free_av=`echo "$mem_free_stats" | grep "average" | cut -f 2 -d :`
mem_free_min=`echo "$mem_free_stats" | grep "min" | cut -f 2 -d :`

let "mem_occup_av = (mem_total - mem_free_av) * 100"
let "mem_occup_max = (mem_total - mem_free_min) * 100"

let "RAM_occup = mem_occup_av/mem_total"
let "RAM_occup_max = mem_occup_max/mem_total"

echo "RAM occupation,$RAM_occup%" >> $LOGFILE
echo "max. RAM occupation,$RAM_occup_max%" >> $LOGFILE 

# Reset the statistics profile for memory
pcb_cli -q 'NMC.DeviceStats.resetProfile(MemStats)'

echo -n "IAD MAC (WAN)," >> $LOGFILE
pcb_cli -l Devices.Device.lan.PhysAddress? >> $LOGFILE
echo -n "ONU ID," >> $LOGFILE
pcb_cli -l SgcOmci.SerialNumber? >> $LOGFILE
# Removed because unsafe
echo "ONT password," >> $LOGFILE
echo -n "GPON Optical RX Power," >> $LOGFILE
pcb_cli -l SgcOmci.Optical.PowerRx? >> $LOGFILE
echo -n "GPON Optical TX Power," >> $LOGFILE
pcb_cli -l SgcOmci.Optical.PowerTx? >> $LOGFILE

echo -n "DDNS CONFIGURED," >> $LOGFILE
NbrLines=`pcb_cli 'DynDNS.getHosts()' | wc -l`
if [ $NbrLines -gt 1 ]; then   echo 1 >> $LOGFILE; else echo 0 >> $LOGFILE; fi

if [ $NbrLines -gt 1 ]; then
  List="dyndns No-IP DtDNS ChangeIP DNSdynamic"
  for x in $List
  do
    HostName=`pcb_cli -l DynDNS.Service.$x.Client.1.Host.1.Name?`  
    if [ -n "$HostName" ]; then
      Status=`pcb_cli -l DynDNS.Service.$x.Client.1.Host.1.Status?`
      if [ "$Status" == "UPDATED" ]; then echo "DDNS STATUS,1" >> $LOGFILE; else echo "DDNS STATUS,0" >> $LOGFILE; fi   
      echo "DDNS DOMAIN,$HostName" >> $LOGFILE 
      break     
    fi  
  done
else
  echo "DDNS STATUS,0" >> $LOGFILE;
  echo "DDNS DOMAIN," >> $LOGFILE;
fi

echo -n "WIFI CONF," >> $LOGFILE
SchedulingEnabled="$(pcb_cli -l NMC.Wifi.SchedulingEnabled?)"
WifiStatus="$(pcb_cli -l NMC.Wifi.Status?)"
if [ $SchedulingEnabled -eq 1 ]; then echo 2 >> $LOGFILE; else echo $WifiStatus >> $LOGFILE; fi

echo -n "WIFI 2,4 STATUS," >> $LOGFILE
pcb_cli -l NeMo.Intf.wl0.Status? >> $LOGFILE
echo -n "WIFI 2,4 SSID," >> $LOGFILE
pcb_cli -l NeMo.Intf.wl0.SSID? >> $LOGFILE
# Removed, not security compliant
echo "WIFI 2,4 Password," >> $LOGFILE

echo -n "WIFI 2,4 Mode," >> $LOGFILE
Standard=`pcb_cli -l NeMo.Intf.wifi0_bcm.OperatingStandards?`
translate_arg "$Standard" "bgn gn n" "0 1 2" >> $LOGFILE

echo -n "WIFI 2,4 CH CONF," >> $LOGFILE
Bandwidth=`pcb_cli -l NeMo.Intf.wifi0_bcm.OperatingChannelBandwidth?`
if [[ $Bandwidth="Auto" ]]; then echo 2 >> $LOGFILE; # for Wifi 2.4, Auto is 20MHz
elif [[ $Bandwidth="150Mbps" ]]; then echo 0 >> $LOGFILE;
elif [[ $Bandwidth="300Mbps" ]]; then echo 1 >> $LOGFILE;
elif [[ $Bandwidth="20MHz" ]]; then echo 2 >> $LOGFILE;
elif [[ $Bandwidth="40Mhz" ]]; then echo 3 >> $LOGFILE;
fi

echo -n "WIFI 2,4 CHANNEL CONF," >> $LOGFILE
pcb_cli -l NeMo.Intf.wifi0_bcm.AutoChannelEnable? >> $LOGFILE
echo -n "WIFI 2,4G CHANNEL," >> $LOGFILE
pcb_cli -l NeMo.Intf.wifi0_bcm.Channel? >> $LOGFILE
echo -n "WIFI 2,4G WPS," >> $LOGFILE
pcb_cli -l NeMo.Intf.wl0.WPS.Enable? >> $LOGFILE

echo -n "WIFI 2,4G security mode," >> $LOGFILE
ModeSecurity=`pcb_cli -l NeMo.Intf.wl0.Security.ModeEnabled?`
if [[ $ModeSecurity="WPA-WPA2-Personal" ]]; then echo 0 >> $LOGFILE;
elif [[ $ModeSecurity="WPA2-Personal" ]]; then  echo 1 >> $LOGFILE;
elif [[ $ModeSecurity="WPA-Personal" ]]; then  echo 2 >> $LOGFILE;
elif [[ $ModeSecurity="WEP-128" ]]; then  echo 3 >> $LOGFILE;
elif [[ $ModeSecurity="None" ]]; then echo 4 >> $LOGFILE;
fi

echo -n "WIFI 2,4 TX power," >> $LOGFILE
wifi_24_tx=`pcb_cli -l NeMo.Intf.wifi0_bcm.TransmitPower?`
if [ $wifi_24_tx -eq -1 ]; then
    echo "100%" >> $LOGFILE
else
    echo "$wifi_24_tx%" >> $LOGFILE
fi

echo -n "WIFI 5 STATUS," >> $LOGFILE
pcb_cli -l NeMo.Intf.eth4.Status? >> $LOGFILE
echo -n "WIFI 5 SSID," >> $LOGFILE
pcb_cli -l NeMo.Intf.eth4.SSID? >> $LOGFILE
echo "WIFI 5 Password," >> $LOGFILE
echo -n "WIFI 5 Mode," >> $LOGFILE
Standard=`pcb_cli -l NeMo.Intf.wifi0_quan.OperatingStandards?`
translate_arg "$Standard" "an ac" "0 1" >> $LOGFILE

echo -n "WIFI 5 CH CONF," >> $LOGFILE
Bandwidth=`pcb_cli -l NeMo.Intf.wifi0_quan.OperatingChannelBandwidth?`
if [[ $Bandwidth="Auto" ]]; then echo 2 >> $LOGFILE;
elif [[ $Bandwidth="20MHz" ]]; then echo 0 >> $LOGFILE;
elif [[ $Bandwidth="20/40Mhz" ]]; then echo 1 >> $LOGFILE;
elif [[ $Bandwidth="40Mhz" ]]; then echo 3 >> $LOGFILE;
fi

echo -n "WIFI 5 CHANNEL CONF," >> $LOGFILE
pcb_cli -l NeMo.Intf.wifi0_quan.AutoChannelEnable? >> $LOGFILE
echo -n "WIFI 5 CHANNEL," >> $LOGFILE
pcb_cli -l NeMo.Intf.wifi0_quan.Channel? >> $LOGFILE
echo -n "WIFI 5 WPS," >> $LOGFILE
pcb_cli -l NeMo.Intf.wl0.WPS.Enable? >> $LOGFILE

echo -n "WIFI 5 security mode," >> $LOGFILE
ModeSecurity=`pcb_cli -l NeMo.Intf.eth4.Security.ModeEnabled?`
if [[ $ModeSecurity="WPA-WPA2-Personal" ]]; then echo 0 >> $LOGFILE;
elif [[ $ModeSecurity="WPA2-Personal" ]]; then  echo 1 >> $LOGFILE;
elif [[ $ModeSecurity="WPA-Personal" ]]; then  echo 2 >> $LOGFILE;
elif [[ $ModeSecurity="WEP-128" ]]; then  echo 3 >> $LOGFILE;
elif [[ $ModeSecurity="None" ]]; then echo 4 >> $LOGFILE;
fi

echo -n "WIFI 5 TX power," >> $LOGFILE
wifi_5_tx=`pcb_cli -l 'NeMo.Intf.wifi0_quan.TransmitPower?'`
echo "$wifi_5_tx%" >> $LOGFILE

echo -n "WIFI MAC Filtering," >> $LOGFILE
MACFiltering=`pcb_cli -l NeMo.Intf.wl0.MACFiltering.Mode?`
if [ "$MACFiltering" = "Off" ]; then echo 0 >> $LOGFILE
else echo 1 >> $LOGFILE
fi

echo -n "WIFI guest SSID," >> $LOGFILE
pcb_cli -l NeMo.Intf.wlguest2.SSID? >> $LOGFILE
echo "WIFI guest password," >> $LOGFILE
echo -n "WIFI guest status," >> $LOGFILE
pcb_cli -l NeMo.Intf.wlguest2.Status? >> $LOGFILE

### LAN ###
echo -n "LAN IPv4 ADDRESS," >> $LOGFILE
pcb_cli -l NeMo.Intf.bridge.IPv4Addr.lan.Address? >> $LOGFILE

echo -n "LAN IPv4 MASK," >> $LOGFILE
Mask=`pcb_cli 'NMC.getLANIP()' | awk 'BEGIN {FS=","; OFS=","}{print $2}'`
echo $Mask | awk 'BEGIN {FS="="; OFS="="}{print $2}' >> $LOGFILE

echo -n "LAN IPv6 ADDRESS," >> $LOGFILE

lan_ipv6_addr=`pcb_cli -l 'NeMo.Intf.bridge.IPv6Addr.[Scope==global && Flags==permanent].Address?'`
# If no global found, give link
if [ -z $lan_ipv6_addr ]; then
    lan_ipv6_addr=`pcb_cli -l 'NeMo.Intf.bridge.IPv6Addr.[Scope==link && Flags==permanent].Address?'`
fi

echo "$lan_ipv6_addr" >> $LOGFILE

echo -n "DHCP SERVER," >> $LOGFILE
pcb_cli -l DHCPv4.Server.Enable? >> $LOGFILE

echo -n "LINE 1 NUMBER," >> $LOGFILE
pcb_cli -l VoiceService.VoiceApplication.VoiceProfile.SIP-Trunk.Line.LINE1.DirectoryNumber? >> $LOGFILE
line1_status=`pcb_cli -l VoiceService.VoiceApplication.VoiceProfile.SIP-Trunk.Line.LINE1.Status?`
line1_status=`translate_arg "$line1_status" "Disabled Enabled Down Up" "0 1 0 1"`
echo "LINE 1 STATUS,$line1_status" >> $LOGFILE

echo -n "LINE 2 NUMBER," >> $LOGFILE
pcb_cli -l VoiceService.VoiceApplication.VoiceProfile.SIP-Trunk.Line.LINE2.DirectoryNumber? >> $LOGFILE
line2_status=`pcb_cli -l VoiceService.VoiceApplication.VoiceProfile.SIP-Trunk.Line.LINE2.Status?`
line2_status=`translate_arg "$line2_status" "Disabled Enabled Down Up" "0 1 0 1"`
echo "LINE 2 STATUS,$line2_status" >> $LOGFILE

### Devices ###

# $1 : device Id
# $2 : device Nbr
# $3 : header type (1 : CONNECTED DEVICE / 2: DEVICE)
devices_get_connDevice_info () {
    device_ID=$1
    device_nbr=$2
    device_header_type=$3
    if [ $device_header_type -eq 1 ]; then
        device_header="CONNECTED DEVICE"
    elif [ $device_header_type -eq 2 ]; then
        device_header="DEVICE"
    else 
        device_header=$3
    fi

    echo -n "$device_header NAME $device_nbr,"
    pcb_cli -l "Devices.Device.$device_ID.Name?"
    device_mac=`pcb_cli -l Devices.Device.$device_ID.PhysAddress?`
    echo "$device_header MAC $device_nbr,$device_mac"
   
    # IP Addresses
    if [ $device_header_type -eq 1 ]; then 
        #IPv4
        device_ipv4=`pcb_cli -l "Devices.Device.$device_ID.IPv4Address.get()"`
        device_ipv4=`echo "$device_ipv4" | grep -m 1 " Address "`
        device_ipv4=`echo "$device_ipv4" | cut -f2 -d: | tr -d " ,"`
        echo "$device_header IPv4 $device_nbr,$device_ipv4"

        #IPv6
        device_ipv6=`pcb_cli -l "Devices.Device.$device_ID.IPv6Address.get()"`
        device_ipv6=`echo "$device_ipv6" | grep -m 2 " Address " | tail -n 1`
        device_ipv6=`echo "$device_ipv6" | sed -r s/":"/","/`
        device_ipv6=`echo "$device_ipv6" | cut -f2 -d, | tr -d " ,"`
        echo "$device_header IPv6 $device_nbr,$device_ipv6"
    else
        echo -n "$device_header IP $device_nbr,"
        echo `pcb_cli -l "Devices.Device.$device_ID.IPAddress?"`
    fi

    device_intf=`pcb_cli -l Devices.Device.$device_ID.InterfaceName?`
    device_con_mode=`translate_arg "$device_intf" "eth0 eth1 eth2 eth3 eth4 wl0 wlguest2 wlguest5" "0 0 0 0 2 1 3 4"`
    # I know, bad spelling but that's in OSP's requirements
    echo "$device_header CONECTION MODE $device_nbr,$device_con_mode"

    device_mode=`pcb_cli -l NeMo.Intf.$device_intf.AssociatedDevice.$device_mac.Mode?`
    if [ "$device_con_mode" == "0" ]; then
        device_wifi_mode="0"
    else 
        device_wifi_mode=`translate_arg "$device_mode" "a b g n ac Unknown" "1 2 3 4 5 Unknown"`
        device_rssi=`pcb_cli -l "NeMo.Intf.$device_intf.AssociatedDevice.$device_mac.SignalStrength?"`
    fi
    echo "$device_header WIFI MODE $device_nbr,$device_wifi_mode"

    if [ "$device_header" = "CONNECTED DEVICE" ]; then
        echo "$device_header RSSI $device_nbr,$device_rssi"
    else
        echo -n "$device_header LAST CONNECTION $device_nbr,"
        device_last_conn=`pcb_cli -l "Devices.Device.$device_ID.LastConnection?"`
        format_time "$device_last_conn"

        # Build Id to fetch RSSI stats
        device_wifi_comp=`translate_arg "$device_intf" "wl0 wlguest2 eth4 wlguest5" "WiFiBCM WiFiBCM WiFiQUAN WiFiQUAN None"`
        if [ "$device_wifi_com" == "None" ]; then
            echo "$device_header MAX RSSI $device_nbr," 
            echo "$device_header MIN RSSI $device_nbr," 
            return 
        fi
        device_wifi_stats_profile=`translate_arg "$device_intf" "wl0 wlguest2 eth4 wlguest5" "RSSI_BCM RSSI_BCM RSSI_QUAN RSSI_QUAN"`
        device_wifi_stats_id="$device_wifi_comp.AccessPoint.$device_intf.AssociatedDevice.$device_mac"

        # Fetch stats profile and extract data
        device_wifi_stats=`pcb_cli "NMC.DeviceStats.Profile.$device_wifi_stats_profile.getStats(\"$device_wifi_stats_id\")"`
        device_wifi_stats=`echo "$device_wifi_stats" | tr -d ' ,'`
        device_rssi_max=`echo "$device_wifi_stats" | grep "max" | cut -f 2 -d :`
        device_rssi_min=`echo "$device_wifi_stats" | grep "min" | cut -f 2 -d :`

        echo "$device_header MAX RSSI $device_nbr,$device_rssi_max" 
        echo "$device_header MIN RSSI $device_nbr,$device_rssi_min" 
    fi
}

devices_list_conn=`pcb_cli -l 'Devices.find("lan && !self && .Active==1")'`
devices_nbr_conn=`echo "$devices_list_conn" | wc -l`

echo -n "NUMBER OF DEVICES CONNECTED," >> $LOGFILE
if [ $devices_nbr_conn -gt 3 ]; then
  echo $(( $devices_nbr_conn - 3)) >> $LOGFILE;
else 
  echo 0 >> $LOGFILE;
fi

if [ $devices_nbr_conn -gt 3 ]; then
    devices_list_conn=`echo "$devices_list_conn" | sed -r s/,$/""/`
    let "line_nbr = 1"
    echo "$devices_list_conn" | while read -r device_ID
    do
        if [ $line_nbr -gt 2 ] && [ $line_nbr -lt $devices_nbr_conn ]; then
            device_nbr=$(( $line_nbr -2 ))
            devices_get_connDevice_info $device_ID $device_nbr 1 >> $LOGFILE
        fi
        let "line_nbr = line_nbr + 1"
    done 
fi

devices_list_all=`pcb_cli 'Devices.find("lan && !self")'`
devices_tot_nbr=`echo "$devices_list_all" | wc -l`

echo -n "TOTAL NUMBER OF DEVICES," >> $LOGFILE
if [ $devices_tot_nbr -gt 3 ]; then
  echo $(( $devices_tot_nbr - 3)) >> $LOGFILE;
else 
  echo 0 >> $LOGFILE;
fi

if [ $devices_tot_nbr -gt 3 ]; then
    devices_list_all=`echo "$devices_list_all" | sed s/,$/""/`
    let "line_nbr = 1"
    echo "$devices_list_all" | while read -r device_ID
    do
        if [ $line_nbr -gt 2 ] && [ $line_nbr -lt $devices_tot_nbr ]; then
            device_nbr=$(( $line_nbr -2 ))
            devices_get_connDevice_info $device_ID $device_nbr 2 >> $LOGFILE
        fi
        let "line_nbr = line_nbr + 1"
    done 
fi

### ###
echo "LAN ETH4 mode," >> $LOGFILE
echo -n "LAN ETH1," >> $LOGFILE
pcb_cli -l NeMo.Intf.eth0.Status? >> $LOGFILE
echo -n "LAN ETH2," >> $LOGFILE
pcb_cli -l NeMo.Intf.eth1.Status? >> $LOGFILE
echo -n "LAN ETH3," >> $LOGFILE
pcb_cli -l NeMo.Intf.eth2.Status? >> $LOGFILE
echo -n "LAN ETH4," >> $LOGFILE
pcb_cli -l NeMo.Intf.eth3.Status? >> $LOGFILE

echo -n "STATICS DHCP ASSIGNMENT," >> $LOGFILE
static_lease_asgmnt_nbr=`pcb_cli 'DHCPv4.Server.Pool.default.getStaticLeases()' | wc -l`
if [ $static_lease_asgmnt_nbr -ge 7 ]; then
    echo 1 >> $LOGFILE
else
    echo 0 >> $LOGFILE
fi

echo -n "DMZ," >> $LOGFILE
dmz=`pcb_cli Firewall.DMZ? | wc -l`
if [ $dmz -ge 7 ]; then
    echo 1 >> $LOGFILE
else
    echo 0 >> $LOGFILE
fi

### NAT ###
nat_rules_nbr=`pcb_cli -l 'Firewall.PortForwardingNumberOfEntries?'`
echo -n "NAT," >> $LOGFILE
if [ $nat_rules_nbr -ge 1 ]; then
    echo 1 >> $LOGFILE
else
    echo 0 >> $LOGFILE
fi

# Address mapping not supported
echo "NAT Address Mapping Rules Number,0" >> $LOGFILE

# Port mapping
nat_list_rules=`pcb_cli -l 'Firewall.getPortForwarding(origin=webui)'`
nat_nbr_rules=`echo "$nat_list_rules" | grep -c "{"`
echo "NAT Port Mapping Rules Number,$(( $nat_nbr_rules - 1))" >> $LOGFILE

nat_list_rules=`echo "$nat_list_rules" | sed -r 's/,$//'`
nat_rules_info=`echo "$nat_list_rules" | awk 'BEGIN{rule_nbr=0; tcp_rule_nbr=0; udp_rule_nbr=0;}
{
    if ($1 == "Enable") {
        printf "Mapping Rule Status "rule_nbr","$3"\n";
    }
    else if ($1 == "DestinationIPAddress") {
        printf "Mapping Rule Application Name "rule_nbr","$3"\n";
    }
    else if ($1 == "Protocol") {
        protocol="";
        if ($3 == "17") {
            protocol="1";
        }
        else if ($3 == "6") {
            protocol="0";
        }
        else if ($3 == "6,17" || $3 == "17,6") {
            protocol="2";
        }
        printf "Mapping Rule Protocol "rule_nbr","protocol"\n";
    }
    else if ($1 == "InternalPort") {
        printf "Mapping Rule Internal Port "rule_nbr","$3"\n";
    }
    else if ($1 == "ExternalPort") {
        printf "Mapping Rule External Port "rule_nbr","$3"\n";
    }
    else if ($1 == "Id") {
        rule_nbr = rule_nbr + 1;
    }
}
END{}'`
if [ `echo "$nat_rules_info" | wc -l` -ge 2 ]; then
    echo "$nat_rules_info" >> $LOGFILE
fi

### Firewall Custom Rules ###

echo -n "Special Applications Rules Number," >> $LOGFILE
pcb_cli -l Firewall.Chain.Custom.RuleNumberOfEntries? >> $LOGFILE
firewall_list_custom_rules=`pcb_cli 'Firewall.Chain.Custom.Rule.get()'`
firewall_list_custom_rules=`echo "$firewall_list_custom_rules" | sed -r 's/,$//'`
firewall_custom_rules_info=`echo "$firewall_list_custom_rules" | awk 'BEGIN{rule_nbr=1}
{
    if ($1 == "Status") {
        status="0";
        if ($3 == "Enabled") {
            status="1";
        }
        printf "Rule Status "rule_nbr","status"\n";
    }
    else if ($1 == "Protocol") {
        protocol="";
        if ($3 == "17") {
            protocol="1";
        }
        else if ($3 == "6") {
            protocol="0";
        }
        else if ($3 == "6,17" || $3 == "17,6") {
            protocol="2";
        }
        printf "trigger Port Type "rule_nbr","protocol"\n";
    }
    else if ($1 == "SourcePort") {
        printf "Trigger Port "rule_nbr","$3"\n";
    }
    else if ($1 == "DestinationPort") {
        printf "Public Port "rule_nbr","$3"\n";
        printf "Public Type "rule_nbr",\n";
    }
    else if ($1 == "}") {
        rule_nbr = rule_nbr + 1;
    }
}END{}'`
echo "$firewall_custom_rules_info" >> $LOGFILE

# Unclear what should this fields contain, only NAT mapping rules or also firewall custom rules ?
# However OSP told us we could set the value for 0 as there are here only for compatibility reasons.
# If ever we need to implement true data extraction, it will be easy to do with grep.
echo "NAT Mapping Table Number,0" >> $LOGFILE
echo "NAT Mapping Table TCP Number,0" >> $LOGFILE
echo "NAT Mapping Table UDP Number,0" >> $LOGFILE

### PCP rules ###
echo -n "PCP Mapping Table Number" >> $LOGFILE
pcb_cli -l "Firewall.PCP.MAPNumberOfEntries?" >> $LOGFILE

pcp_rules=`pcb_cli -l "Firewall.PCP.MAP.get()"`
pcp_rules=`echo "$pcp_rules" | sed -r 's/,$//'`
pcp_rules_formatted=`echo "$pcp_rules" | awk 'BEGIN{rule_nbr=1}
{
    if ($1 == "Status") {
        printf "PCP rule status "rule_nbr","$3"\n";
    }
    else if ($1 == "ExternalPort") {
        printf "PCP public port "rule_nbr","$3"\n";
    }
    else if ($1 == "Protocol") {
        protocol="";
        if ($3 == "6") {
            protocol="0";
        }
        else if ($3 == "17") {
            protocol="1";
        }
        else if ($3 == "17,6" || $3 == "6,17") {
            protocol="2";
        }
        printf "PCP protocol "rule_nbr","protocol"\n";
    }
    else if ($1 == "InternalPort") {
        printf "PCP internal port "rule_nbr","$3"\n";
    }
    else if ($1 == "InternalIPAddress") {
        printf "PCP internal IPv4 "rule_nbr","$3"\n";
    }
    else if ($1 == "}") {
        rule_nbr = rule_nbr + 1;
    }
}END{}'`

echo "$pcp_rules_formatted" >> $LOGFILE

### ###
firewall_ipv4_level=`pcb_cli -l 'Firewall.getFirewallLevel()'`
firewall_ipv6_level=`pcb_cli -l 'Firewall.getFirewallIPv6Level()'`
echo -n "Firewall IPv4," >> $LOGFILE
translate_arg "$firewall_ipv4_level" "Disabled Low Medium High Custom" "0 1 2 3 4" >> $LOGFILE
echo -n "Firewall IPv6," >> $LOGFILE
translate_arg "$firewall_ipv6_level" "Disabled Low Medium High Custom" "0 1 2 3 4" >> $LOGFILE

echo -n "Access Control Status," >> $LOGFILE
devices_blocked_nbr=`pcb_cli Scheduler.Types.ToD.Schedules.? | grep -c "CurrentState=Disable"`
if [ $devices_blocked_nbr -eq 0 ]; then
    echo 0 >> $LOGFILE
else
    echo 1 >> $LOGFILE
fi

# Not supported (OK, removed)
echo "MAC Filtering Status," >> $LOGFILE
echo -n "Parental Control Status," >> $LOGFILE
urlmon_list_devices=`pcb_cli 'URLMon.Host.get()'`
urlmon_list_devices=`echo "$urlmon_list_devices" | sed -r 's/,$//'`
access_control_status=`echo "$urlmon_list_devices" | awk 'BEGIN{control_status="0"}
    {
        if ( $1 == "ParentalControlActive" ) {
            control_status = $3;
        }
        if (control_status == "1") {
            exit
        }
    }END{printf control_status"\n"}'`
echo $access_control_status >> $LOGFILE

# Not supported (OK, removed)
# Can't be disabled
echo "SPI & DoS protection,1" >> $LOGFILE

### WAN Ping ###

firewall_resp_to_ping=`pcb_cli 'Firewall.getRespondToPing(data)'`
firewall_resp_to_ping=`echo "$firewall_resp_to_ping" | sed -r 's/,$//'`
firewall_resp_to_ping_status=`echo "$firewall_resp_to_ping" | awk 'BEGIN{ping_ipv4="0";ping_ipv6="0";}{
    if ($1 == "enableIPv4") {
        ping_ipv4 = $3;
    }
    else if ($1 == "enableIPv6") {
        ping_ipv6 = $3;
    }
}END{ if ( ping_ipv4 == "1" || ping_ipv6 == "1") {printf "1"} else { printf "0"}}'`
echo "Ping WAN,"$firewall_resp_to_ping_status >> $LOGFILE

### Mass Storage Device Info ###
# $1 : data (map) to put on one line
map_print_oneline() {
    loc_info=`echo "$1" | sed -r s/" *: "/":\'"/`
    loc_info=`echo "$loc_info" | tr -d '\n'`
    loc_info=`echo "$loc_info" | sed -r s/", *"/"\' "/g`
    loc_info=`echo "$loc_info" | sed -r s/"^[\{ \t]*"/""/`
    loc_info=`echo "$loc_info" | sed -r s/"\}$"/"\'"/`

    echo "$loc_info"
}

storage_device=`echo " $( pcb_cli StorageService.PhysicalMedium.?) " | awk 'BEGIN{OFS=FS;FS=".";}{if ($4 == "Status=Online") {printf $3; exit}}END{FS=OFS}'`
if [ -z $storage_device ]; then
    echo "Mass Storage device connected,0" >> $LOGFILE
    echo "Mass Storage device 1 info," >> $LOGFILE
else
    echo "Mass Storage device connected,1" >> $LOGFILE
    echo -n "Mass Storage device 1 info," >> $LOGFILE
    info=`pcb_cli -l "StorageService.PhysicalMedium.$storage_device.get()"`
    #A bit too much info so lets extract only necessary fields
    info=`echo "$info" | grep -E ' Name | Model | Vendor | Capacity | ConnectionType | USBVersion | SerialNumber '`
    map_print_oneline "$info" >> $LOGFILE
fi

### Printer ###
printer_devices=`pcb_cli -l 'Devices.find("printer")'`
printer_devices=`echo "$printer_devices" | tr -d '[], '`
printer_devices=`echo "$printer_devices" | sed '/^$/d'`
printer_device=`echo "$printer_devices" | head -n 1`

if [ -z $printer_device ];then 
    echo "Printer Connected,0"  >> $LOGFILE
    echo "Printer info,"  >> $LOGFILE
else
    echo "Printer Connected,1"  >> $LOGFILE
    echo -n "Printer info,"  >> $LOGFILE
    printer_info=`pcb_cli -l "Devices.Device.$printer_device.get()"`
    #Necessary steps other wise get redundant data
    cut_line=`echo "$printer_info" | grep -n 'Names' | cut -f1 -d:`
    if [ $(( $cut_line - 1 )) -gt 0 ]; then
        printer_info=`echo "$printer_info" | head -n $(( $cut_line - 1 ))`
    fi
    printer_info=`echo "$printer_info" | grep -E ' Name | Manufacturer | SerialNumber | USBVersion | Model | ConnectionType '`
    map_print_oneline "$printer_info" >> "$LOGFILE"
fi

echo -n "File Server (NAS)," >> $LOGFILE
pcb_cli -l SambaService.Enable? >> $LOGFILE
# Not supported (OK, removed)
echo "File Server (NAS) Remote Access," >> $LOGFILE
echo -n "FTP Service," >> $LOGFILE
pcb_cli -l FTPServer.Enable? >> $LOGFILE
echo "FTP Service Remote Access," >> $LOGFILE
echo -n "UPnP Status," >> $LOGFILE
pcb_cli -l UPnP-IGD.Enable? >> $LOGFILE
echo "DLNA Status,1" >> $LOGFILE

### E-Mail Nofications Status ###
New_ip_RuleNbr=`echo "$( pcb_cli 'RuleEngine.Rule.?' )" | awk 'BEGIN{OFS=FS;FS="."}{if ($4 == "Name=New IP session"){printf $3;}}END{FS=OFS}'`
Missed_Call_RuleNbr=`echo "$( pcb_cli 'RuleEngine.Rule.?' )" | awk 'BEGIN{OFS=FS;FS="."}{if ($4 == "Name=Missed call"){printf $3;}}END{FS=OFS}'`
New_device_RuleNbr=`echo "$( pcb_cli 'RuleEngine.Rule.?' )" | awk 'BEGIN{OFS=FS;FS="."}{if ($4 == "Name=New device connection"){printf $3;}}END{FS=OFS}'`

echo -n "Mail Notifications Missed Calls Status," >> $LOGFILE
pcb_cli -l RuleEngine.Rule."$Missed_Call_RuleNbr".Enabled? >> $LOGFILE
echo -n "Mail Notifications New IP Status," >> $LOGFILE
pcb_cli -l RuleEngine.Rule."$New_ip_RuleNbr".Enabled? >> $LOGFILE
echo -n "Mail Notifications New Device Status," >> $LOGFILE
pcb_cli -l RuleEngine.Rule."$New_device_RuleNbr".Enabled? >> $LOGFILE

### ###
echo -n "Remote Access to GUI," >> $LOGFILE
pcb_cli -l RemoteAccess.Enable? >> $LOGFILE

### SSID ###
BCM_ScanResults=`pcb_cli 'NeMo.Intf.wifi0_bcm.getScanResults()'`
QUAN_ScanResults=`pcb_cli 'NeMo.Intf.wifi0_quan.scan()'`
BCM_ScanResults=`echo "$BCM_ScanResults" | sed -r 's/,$//'`
QUAN_ScanResults=`echo "$QUAN_ScanResults" | sed -r 's/,$//'`

ssid_bcm_nbr=`echo "$BCM_ScanResults" | grep -c "{"`
ssid_quan_nbr=`echo "$QUAN_ScanResults" | grep -c "{"`

# $1 : scan result, $2 : header
extract_SSIDInfo () {
    ssid_scan_result=`echo "$1" | grep -E ' SSID | RSSI | Channel | Bandwidth '`
    ssid_scan_result=`echo "$ssid_scan_result" | sed -r s/" "/""/g`
    ssid_scan_result=`echo "$ssid_scan_result" | sed -r s/":"/","/`

    ssid_scan_result=`echo "$ssid_scan_result" | sed -r s/"Channel,"/"channel,"/`
    # Bandiwth translation
    ssid_scan_result=`echo "$ssid_scan_result" | sed -r s/"Bandwidth,20"/"channel width,0"/`
    ssid_scan_result=`echo "$ssid_scan_result" | sed -r s/"Bandwidth,40"/"channel width,1"/`
    ssid_scan_result=`echo "$ssid_scan_result" | sed -r s/"Bandwidth,80"/"channel width,2"/`

    ssid_idx=0

    echo "$ssid_scan_result" | while read -r line
    do
        if [ `echo "$line" | grep -Ec "^SSID,"` -eq 1 ]; then
            ssid_idx=$(( $ssid_idx + 1 ))
            line=`echo ${line:4}`
        else
            line=`echo " $line"`
        fi 
        if [ $ssid_idx -gt 0 ]; then
            echo "SSID-$ssid_idx $2$line"
        fi
    done 
}
ssid_bcm_list=`extract_SSIDInfo "$BCM_ScanResults" "2,4GHz"`

echo "Number of SSIDs 2,4GHz,$ssid_bcm_nbr" >> $LOGFILE
if [ $ssid_bcm_nbr -gt 0 ]; then
    echo "$ssid_bcm_list" >> $LOGFILE
fi

ssid_quan_list=`extract_SSIDInfo "$QUAN_ScanResults" "5GHz"`

echo "Number of SSIDs 5GHz,$ssid_quan_nbr" >> $LOGFILE
if [ $ssid_quan_nbr -gt 0 ]; then
    echo "$ssid_quan_list" >> $LOGFILE
fi
# VoIP and Internet unavailability
## Using a workaround we can estimate how long each feature was unavailable
voip_stats=`pcb_cli "NMC.DeviceStats.Profile.VoIPAvailability.getStats()"`
voip_stats=`echo "$voip_stats" | tr -d ' ,'`

voip_null_count=`echo "$voip_stats" | grep "count_str_NULL" | cut -f 2 -d :`
voip_empty_count=`echo "$voip_stats" | grep "count_str_:" | cut -f 2 -d :`
voip_period=`pcb_cli -l "NMC.DeviceStats.Profile.VoIPAvailability.Periodicity?"`

if [ "$voip_null_count" = "" ]; then
    voip_null_count=0
fi
if [ "$voip_empty_count" = "" ]; then
    voip_empty_count=0
fi

voip_unavailable_count=$(( $voip_null_count * $voip_period + $voip_empty_count * $voip_period ))
echo "VOIP unavailability,$voip_unavailable_count" >> $LOGFILE

wan_stats=`pcb_cli "NMC.DeviceStats.Profile.WanAvailability.getStats()"`
wan_stats=`echo "$wan_stats" | tr -d ' ,'`
wan_period=`pcb_cli -l "NMC.DeviceStats.Profile.WanAvailability.Periodicity?"`

wan_down_count=`echo "$wan_stats" | grep "count_str_down" | cut -f 2 -d :`
if [ "$wan_down_count" = "" ]; then
    wan_down_count=0
fi
echo "Internet unavailability,$(( $wan_down_count * $wan_period ))" >> $LOGFILE

#Reset stats profiles
pcb_cli -q "NMC.DeviceStats.resetProfile(WanAvailability)"
pcb_cli -q "NMC.DeviceStats.resetProfile(VoIPAvailability)"

### Softphones ###
echo -n "Num Softphones," >> $LOGFILE
softph_list_accounts=`pcb_cli 'SoftPhoneConfig.listAccounts()'`
#Can't use wc -l as it seems the number of line can vary between handsets
echo `echo "$softph_list_accounts" | grep -c '^[[:space:]]*name*'` >> $LOGFILE

#Parallel call usage
fxs1_parallel_call=`pcb_cli "NMC.DeviceStats.Profile.FXS1State.getStats()"`
fxs2_parallel_call=`pcb_cli "NMC.DeviceStats.Profile.FXS2State.getStats()"`

fxs1_parallel_call=`echo "$fxs1_parallel_call" | tr -d ' ,'`
fxs1_count=`echo "$fxs1_parallel_call" | grep "parallel_call_count" | cut -f 2 -d :`
fxs1_conn=`echo "$fxs1_parallel_call" | grep "count_str_CONNECTED" | cut -f 2 -d :`

if [ "$fxs1_count" = "" ]; then
    fxs1_count=0
fi
if [ "$fxs1_conn" = "" ]; then
    fxs1_conn=0
fi

fxs2_parallel_call=`echo "$fxs2_parallel_call" | tr -d ' ,'`
fxs2_count=`echo "$fxs2_parallel_call" | grep "parallel_call_count" | cut -f 2 -d :`
fxs2_conn=`echo "$fxs2_parallel_call" | grep "count_str_CONNECTED" | cut -f 2 -d :`

if [ "$fxs2_count" = "" ]; then
    fxs2_count=0
fi
if [ "$fxs2_conn" = "" ]; then
    fxs2_conn=0
fi

pc_count=0
if [ $fxs1_count -gt 0 -o $fxs2_count -gt 0 ]; then
    pc_count=2
elif [ $fxs1_conn -gt 0 -o $fxs2_conn -gt 0 ]; then
    pc_count=1
fi

echo "Max Num parallel calls,$pc_count" >> $LOGFILE

# Reset stats profile
pcb_cli -q "NMC.DeviceStats.resetProfile(FXS1State)"
pcb_cli -q "NMC.DeviceStats.resetProfile(FXS2State)"

## Traffic information

netdev_gpon_idx=`pcb_cli -l 'NetDev.Link.[Name==gpon0].Index?'`
now_seconds=`date +%s`

traffic_stats=`pcb_cli "NMC.DeviceStats.Profile.Traffic.getStats(NetDev.Link.$netdev_gpon_idx.Stats)"`
traffic_stats=`echo "$traffic_stats" | grep -E ' RxBytes | TxBytes | down_count | last_value | retrieval_count'`
traffic_stats=`echo "$traffic_stats" | tr -d ' ,'`

first_stats=`echo "$traffic_stats" | head -n 4`
scnd_stats=`echo "$traffic_stats" | tail -n 4`

process_stats() {
    traffic_title=`echo "$1" | head -n 1`

    traffic_stats_lv=`echo "$1" | grep "last_value"`
    traffic_stats_lv=`echo "$traffic_stats_lv" | cut -f 2 -d :`
    if [ "$traffic_stats_lv" = "" ]; then
        traffic_stats_lv=0
    fi

    traffic_stats_dc=`echo "$1" | grep "down_count"`
    traffic_stats_dc=`echo "$traffic_stats_dc" | cut -f 2 -d :`
    if [ "$traffic_stats_dc" = "" ]; then
        traffic_stats_dc=0
    fi

    if [ "$traffic_title" = "RxBytes:" ]; then 
        echo "DOWNLOAD TRAFFIC,$(( $traffic_stats_lv/1000000 + $traffic_stats_dc * 1024 * 24 ))"
    elif [ "$traffic_title" = "TxBytes:" ]; then
        echo "UPLOAD TRAFFIC,$(( $traffic_stats_lv/1000000 + $traffic_stats_dc * 1024 * 24 ))"
    fi
}

if [ "$traffic_stats" = "" ]; then
    echo "DOWNLOAD TRAFFIC,0" >> $LOGFILE
    echo "UPLOAD TRAFFIC,0" >> $LOGFILE
else
    process_stats "$first_stats" >> $LOGFILE
    process_stats "$scnd_stats" >> $LOGFILE
fi

traffic_period=`pcb_cli -l 'NMC.DeviceStats.Profile.Traffic.Periodicity?'`
traffic_ret_count=`echo "$traffic_stats" | grep -m 1 "retrieval_count" | cut -f 2 -d :`
let "traffic_start_seconds = now_seconds - traffic_ret_count * traffic_period"

# Convertion from seconds to human readable time presented some problems with
# date. A workaround with awk was the best I could find to avoid doing it manually.
traffic_start=`awk -v time_value=$traffic_start_seconds 'BEGIN { print strftime("%Y-%m-%dT%H:%M:%S", time_value); }'`
traffic_end=`awk -v time_value=$now_seconds 'BEGIN { print strftime("%Y-%m-%dT%H:%M:%S", time_value); }'`

echo "TRAFFIC START TIME,`format_time "$traffic_start"`" >> $LOGFILE
echo "TRAFFIC END TIME,`format_time "$traffic_end"`" >> $LOGFILE

pcb_cli -q 'NMC.DeviceStats.resetProfile(Traffic)'

#Not supported
echo "Autoreboot,0" >> $LOGFILE

fn_exists transfer_file_without_finish                                                                                                    
if [ $? -eq 0 ]; then                                                                                                        
  #####################################################################################                                                   
  # Call CURL to perform the upload                                                    
  #####################################################################################

  logger -t pushlogs "Call transfer_file_without_finish to perform the upload "	   	

  transfer_file_without_finish "--header \"lb_ref: $WAN_ADDR\" --header \"User-Agent: Verbose Log\" --header \"FW_version: $SW_VERSION\" --header \"lb_manufacturer: $MANUFACTURER\" --header \"lb_productclass: $PRODUCT_CLASS\" --header \"lb_serialnumber: $SERIAL_NUMBER\" --ftp-ssl --upload-file $LOGFILE"

  rm -fr $DIRNAME                              
                                                              
  #####################################################################################
  # Update the status                                                               
  #####################################################################################
  finish_transfer $ERRORCODE "$ERRORSTRING"
else                                  
  #####################################################################################
  # Call CURL to perform the upload                                      
  #####################################################################################
  logger -t pushlogs "Call transfer_file to perform the upload "

  transfer_file "--header \"lb_ref: $WAN_ADDR\" --header \"User-Agent: Verbose Log\" --header \"FW_version: $SW_VERSION\" --header \"lb_manufacturer: $MANUFACTURER\" --header \"lb_productclass: $PRODUCT_CLASS\" --header \"lb_serialnumber: $SERIAL_NUMBER\" --ftp-ssl --upload-file $LOGFILE"

  rm -fr $DIRNAME                                        
    
  #####################################################################################
  # Update the status     
  #####################################################################################
  finish_transfer 0 ""
fi   

exit 0
