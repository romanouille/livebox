#! /bin/sh
#
# Author:	Vincent Hervo - VHo
#			<vincent.hervo@sagem.com>
#
# This script configures QoS for the WIFI community service
#
# Adjust interfaces to fit with the target
# Adjust DSCP marking to fit with the customer
# Adjust system dependent invocations
#

# Interface settings
W_DA=ppp0		#WAN Data Up
W_VcDA=ethoa6		#WAN Data Down
W_VO=ethoa4		#WAN VoIP
L_PR=eth2		#LAN Private
L_PU=eth3		#LAN Public
L_ETH=eth0		#LAN Ethernet
L_BR=br0		#Bridge

# DSCP marking for UMA
DSCP_REWRITTING_ENABLE=1
# L=LAN	W=WAN
# V=voice D=Data
# MSK=marking mask CMSK=check mask

H_VoIP_V=0xff
H_VoIP_V_MSK=0x00
H_VoIP_V_CMSK=0xff

W_VoIP_V=0x00
W_VoIP_V_MSK=0x00
W_VoIP_V_CMSK=0xff

L_UMA_V=0xc0
L_UMA_V_MSK=0x00
L_UMA_V_CMSK=0xff

L_UMA_D=0xa0
L_UMA_D_MSK=0x00
L_UMA_D_CMSK=0xff

W_UMA_V=0xb8
W_UMA_V_MSK=0x00
W_UMA_V_CMSK=0xff

W_UMA_D=0x48
W_UMA_D_MSK=0x00
W_UMA_D_CMSK=0xff

# Mask to apply when matching an IP address
IP_MATCH_MSK=32

# PUBL traffic identifiers
L2TP_PORT=0x06a5 #L2TP port
L2TP_MSK=0xffff
UDP_PROTO=0x11
UDP_MSK=0xff


### Support from the system
TC=tc #Path to tc binary
#TC=echo #DEBUG only

##############################################################
#
#              DO NOT EDIT BENEATH SECTIONS
#
##############################################################

TRUE=1
FALSE=0
E_OPT_ERROR=1

### Fetch arguments
NO_ARGS=0
COMMUNITY_NUM_ARGS=3
NO_COMMUNITY_NUM_ARGS=4
ACTION=0

UMA_EN=$FALSE
COMM_EN=$FALSE
VALID_ARGS=$FALSE
DISABLE=0

if [ $# -eq "$NO_ARGS" ] #script invoked with no command-line args
then
	echo "
	Usage . $0 options (all mandatory when -e 1)
		--total-bw|-t:		total upstream bandwidth (kbit)
		--share-ratio|-s:	share ratio
		--l2tp-lns-addr|-l):LNS address
		--uma-dst-addr|-ud:	UMA dst address
		--uma-src-addr|-us:	UMA src address
		--uma--addr|-u:		UMA src&dst address (-ud and -us are the same)
		--voice-bw|-v:		VC Conv egress bandwitdh (kbit)
		--enable|-e:		1 enable / 0 disable
		--with-com:			with community support
		"
	exit $E_OPT_ERROR
fi

while [ -n "$1" ] ; do
	case $1 in
		--total-bw|-t)
			W_DA_UPLINK=$2
			W_DA_UPLINK_VAR=1;;

		--share-ratio|-s)
			BW=$2
			BW_VAR=1;;

		--uma-dst-addr|-ud) #We should expect multiple addresses, use a coma-separated list
			UMA_DST_IP=$2
			UMA_DST_IP_VAR=1;;

		--uma-src-addr|-us)
			UMA_SRC_IP=$2
			UMA_SRC_IP_VAR=1;;

		--uma_addr|-u)
			UMA_SRC_IP=$2
			UMA_DST_IP=$2
			UMA_DST_IP_VAR=1
			UMA_SRC_IP_VAR=1;;

		--voice-bw|-v)
			VOICE_BW=$2
			VOICE_BW_VAR=1;;

		--l2tp-lns-addr|-l)
			L2TP_LNS_ADDR=$2
			L2TP_LNS_ADDR_VAR=1;;
			
		--enable|-e)
			ACTION=$2;;

		--device|-d)
			L_PU=$2		#LAN Public
			[ "$2" = "eth2" ] && L_PR=eth1		#LAN Private
			[ "$2" = "eth3" ] && L_PR=eth2		#LAN Private
			;;
		--with-com)
			COMM_EN=$2;;

	esac
	shift 2
done

if [ "$ACTION" -eq "$DISABLE" ]
then
	echo "
	###Cleaning Qdiscs"
	if [ "$COMM_EN" -eq "1" ]
		then
			echo $W_DA...
			${TC} qdisc del dev ${W_DA} root
			echo $L_PU...
			${TC} qdisc del dev ${L_PU} root
	fi
	echo $W_VO...
	${TC} qdisc del dev ${W_VO} root
	echo $L_PR...
	${TC} qdisc del dev ${L_PR} root
	exit 0;
fi

let NO_ARGS=UMA_DST_IP_VAR+UMA_SRC_IP_VAR+VOICE_BW_VAR+W_DA_UPLINK_VAR
if [ "$NO_ARGS" -eq "$NO_COMMUNITY_NUM_ARGS" ]
then
	UMA_EN=$TRUE
	VALID_ARGS=$TRUE
	echo ">>> Setting UMA QoS"
fi

let NO_ARGS=W_DA_UPLINK_VAR+BW_VAR+L2TP_LNS_ADDR_VAR
if [ "$NO_ARGS" -eq "$COMMUNITY_NUM_ARGS" ]
then
	COMM_EN=$TRUE
	VALID_ARGS=$TRUE
	echo ">>> Setting Community QoS"
fi

if [ "$VALID_ARGS" -eq "$FALSE" ]
then
	echo "Wrong set of arguments. See usage."
	exit $E_OPT_ERR
fi

echo "
	Calling `basename $0` with:
		--total-bw:	$W_DA_UPLINK
		--share-ratio:	$BW
		--l2tp-lns-addr:$L2TP_LNS_ADDR
		--uma-dst-addr:	$UMA_DST_IP
		--uma-src-addr:	$UMA_SRC_IP
		--enable:		$ACTION
		"

echo "
	###Cleaning Qdiscs"
if [ "$COMM_EN" -eq "$TRUE" ]
then
	echo $W_DA...
	${TC} qdisc del dev ${W_DA} root
	echo $L_PU...
	${TC} qdisc del dev ${L_PU} root
fi
if [ "$UMA_EN" -eq "$TRUE" ]
then
	echo $W_VO...
	${TC} qdisc del dev ${W_VO} root
	echo $L_PR...
	${TC} qdisc del dev ${L_PR} root
	echo $W_DA...
	${TC} qdisc del dev ${W_DA} root
	echo $L_BR...
	${TC} qdisc del dev ${L_BR} root
fi

# Set QDISC DSmark+HTB for W_DA interface without wificom beta test
#	Class 1:10 is VOIP
#	Class i:20 is DATA
	echo "
###Setting interface W_DA(${W_DA})"
	# setting interface buffer for ${W_DA}
	ifconfig ${W_DA} txqueuelen 10
	# setting interface buffer for ${W_VcDA}
	ifconfig ${W_VcDA} txqueuelen 10
	# setting interface buffer for ${L_ETH}
	ifconfig ${L_ETH} txqueuelen 100
	
####Setting rewrite dsmark interface W_DA(${W_DA})"
	${TC} qdisc add dev ${W_DA} handle 1:0 root dsmark indices 4 default_index 0

	# All packets in this qdisc is marked by value
	${TC} class change dev ${W_DA} classid 1:1 dsmark mask ${W_UMA_V_MSK} value ${W_UMA_V}
	${TC} class change dev ${W_DA} classid 1:2 dsmark mask ${W_UMA_D_MSK} value ${W_UMA_D}		
	
	# filter to right qdisc to remark
	${TC} filter add dev ${W_DA} parent 1:0 protocol ip prio 2 u32 \
				match ip tos ${L_UMA_V} ${L_UMA_V_CMSK} \
				flowid 1:1
	${TC} filter add dev ${W_DA} parent 1:0 protocol ip prio 3 u32 \
				match ip tos ${L_UMA_D} ${L_UMA_D_CMSK} \
				flowid 1:2
	
####Setting QoS interface W_DA(${W_DA})"
	${TC} qdisc add dev ${W_DA} parent 1: handle 2:0 htb default 12
	
	W_DA_UPLINK=$(($W_DA_UPLINK * 97 /100))
	
	${TC} class add dev ${W_DA} parent 2: classid 2:1 htb rate ${W_DA_UPLINK}kbit

	# shappe Voix class at 100kbit
	${TC} class add dev ${W_DA} parent 2:1 classid 2:11 htb rate 100kbit ceil ${W_DA_UPLINK}kbit prio 0
	
	# filter voix packet by tos field
	${TC} filter add dev ${W_DA} parent 2:0 protocol ip prio 0 u32 \
				match ip tos ${H_VoIP_V} ${H_VoIP_V_CMSK} \
				flowid 2:11
	${TC} filter add dev ${W_DA} parent 2:0 protocol ip prio 1 u32 \
				match ip tos 0xfc ${H_VoIP_V_CMSK} \
				flowid 2:11
	
	# del tos field after filter
	${TC} qdisc add dev ${W_DA} parent 2:11 handle 30: dsmark indices 2 default_index 1
	${TC} class change dev ${W_DA} classid 30:1 dsmark mask ${W_VoIP_V_MSK} value ${W_VoIP_V}

	# shappe data class at DATA_RATE
	DATA_RATE=$(( $W_DA_UPLINK - 100))
	
	${TC} class add dev ${W_DA} parent 2:1 classid 2:12 htb rate ${DATA_RATE}kbit ceil ${W_DA_UPLINK}kbit prio 3

# Set QDISC HTB for W_DA interface
#	Class 1:10 is PRIV
#	Class i:20 is PUBL
if [ "$COMM_EN" -eq "$TRUE" ]
then
	echo $W_DA...
	echo "
	###Setting interface W_DA(${W_DA}) for wificomm "

	#change rate's data class for wificomm
	let ALLOC_BW=DATA_RATE*BW/100
	#private traffic
	${TC} class change dev ${W_DA} parent 2:1 classid 2:12 htb rate ${ALLOC_BW}kbit ceil ${W_DA_UPLINK}kbit prio 5
	let ALLOC_BW=DATA_RATE-ALLOC_BW
	#visitor traffic
	${TC} class add dev ${W_DA} parent 2:1 classid 2:13 htb rate ${ALLOC_BW}kbit ceil ${W_DA_UPLINK}kbit prio 6
	${TC} qdisc add dev ${W_DA} parent 2:12 handle 50: sfq perturb 10
	${TC} qdisc add dev ${W_DA} parent 2:13 handle 60: sfq perturb 10
	
	# Now, classify packets
	OLDIFS=$IFS
	IFS=","
	L2TP_LNS_ADDR=$L2TP_LNS_ADDR
	set -- $L2TP_LNS_ADDR
	IFS=$OLDIFS
	while [ $# -gt 0 ] ; do
		ADDR=$1
		shift
		${TC} filter add dev ${W_DA} parent 2:1 protocol ip prio 1 u32 \
				match ip dst ${ADDR}/${IP_MATCH_MSK} flowid 2:13
	done

	# Set QDISC for L_PU interface
	# Nothing to be done
	echo "
	###Setting interface L_PU(${L_PU})"
fi

if [ "$UMA_EN" -eq "$TRUE" ]
then
# Set QDISC DSmark+HTB for W_VO interface
#	Class 1:1 is VOIP
#	Class i:2 is UMA_V
#	Class 1:3 is UMA_D
	echo "
	###Setting interface W_VO(${W_VO})"
	
	# setting interface buffer for ${W_VO}
	ifconfig ${W_VO} txqueuelen 50

#### Setting rewrite dsmark interface W_DA(${W_DA})"
	${TC} qdisc add dev ${W_VO} handle 1:0 root dsmark indices 4 default_index 0
	
	# All packets in this qdisc is marked by value
	${TC} class change dev ${W_VO} classid 1:1 dsmark mask ${W_UMA_V_MSK} value ${W_UMA_V}
	${TC} class change dev ${W_VO} classid 1:2 dsmark mask ${W_UMA_D_MSK} value ${W_UMA_D}	
		
	# filter to right qdisc to remark
	${TC} filter add dev ${W_VO} parent 1:0 protocol ip prio 1 u32 \
				match ip tos ${L_UMA_V} ${L_UMA_V_CMSK} \
				flowid 1:1
	${TC} filter add dev ${W_VO} parent 1:0 protocol ip prio 2 u32 \
				match ip tos ${L_UMA_D} ${L_UMA_D_CMSK} \
				flowid 1:2
	
#### Setting QoS interface W_VO(${W_VO})"
	${TC} qdisc add dev ${W_VO} parent 1:  handle 2:0 htb default 22
	${TC} class add dev ${W_VO} parent 2: classid 2:1 htb rate ${VOICE_BW}kbit

	#we should only get 45, 120, 240 for VOICE_BW
	if [ $VOICE_BW -lt 98 ]
	then
		#g729 only
		Z_RATE=$(( $VOICE_BW - 4))
		UMA_VOICE=2
		UMA_DATA=2

	else
		UMA_DATA=$(($VOICE_BW * 4 /100))
		UMA_VOICE=$(($VOICE_BW * 26 /100))
		Z_RATE=$(($VOICE_BW - $UMA_VOICE - $UMA_DATA))

	fi
	#voice Z : high
	${TC} class add dev ${W_VO} parent 2:1 classid 2:20 htb rate ${Z_RATE}kbit ceil ${VOICE_BW}kbit prio 0
	#medium
	${TC} class add dev ${W_VO} parent 2:1 classid 2:21 htb rate ${UMA_VOICE}kbit ceil ${VOICE_BW}kbit prio 1
	#low
	${TC} class add dev ${W_VO} parent 2:1 classid 2:22 htb rate ${UMA_DATA}kbit ceil ${VOICE_BW}kbit prio 2

	# grow down buffer coming from each class
	${TC} qdisc add dev ${W_VO} parent 2:20 pfifo limit 3
	${TC} qdisc add dev ${W_VO} parent 2:21 pfifo limit 3
	${TC} qdisc add dev ${W_VO} parent 2:22 pfifo limit 10

	# del tos field after filter
	${TC} qdisc add dev ${W_VO} parent 2:20 handle 30: dsmark indices 2 default_index 1
	${TC} class change dev ${W_VO} classid 30:1 dsmark mask ${W_VoIP_V_MSK} value ${W_VoIP_V}

	# Now, classify packets
	#Loop on this for every address in UMA_DST_IP
	OLDIFS=$IFS
	IFS=","
	UMA_DST_IP=$UMA_DST_IP
	set -- $UMA_DST_IP
	IFS=$OLDIFS
	while [ $# -gt 0 ] ; do
		ADDR=$1
		shift
		# filter UMA packet by tos field and distant address
		${TC} filter add dev ${W_VO} parent 2:0 protocol ip prio 2 u32 \
				match ip dst ${ADDR}/${IP_MATCH_MSK}\
				match ip tos ${L_UMA_V} ${L_UMA_V_CMSK} \
				flowid 2:21
		${TC} filter add dev ${W_VO} parent 2:0 protocol ip prio 4 u32 \
				match ip dst ${ADDR}/${IP_MATCH_MSK}\
				match ip tos ${L_UMA_D} ${L_UMA_D_CMSK} \
				flowid 2:22
		${TC} filter add dev ${W_VO} parent 2:0 protocol ip prio 7 u32 \
				match ip dst ${ADDR}/${IP_MATCH_MSK}\
				flowid 2:21
		# filter voix packet by tos field
		${TC} filter add dev ${W_VO} parent 2:0 protocol ip prio 0 u32 \
				match ip tos ${H_VoIP_V} ${H_VoIP_V_CMSK} \
				flowid 2:20
		${TC} filter add dev ${W_VO} parent 2:0 protocol ip prio 1 u32 \
				match ip tos 0xfc ${H_VoIP_V_CMSK} \
				flowid 2:20
	done


# Set QDISC for L_BR interface
#	Class 1:1 is UMA_V
#	Class i:2 is UMA_D

echo "
###Setting interface L_BR(${L_BR})"
	
#### setting interface buffer for ${L_BR}
	ifconfig ${L_BR} txqueuelen 100

#### Setting rewrite dsmark interface L_BR(${L_BR})"	
	${TC} qdisc add dev ${L_BR} handle 1:0 root dsmark indices 4 default_index 0

	${TC} class change dev ${L_BR} classid 1:1 dsmark mask ${L_UMA_V_MSK} value ${L_UMA_V}
	${TC} class change dev ${L_BR} classid 1:2 dsmark mask ${L_UMA_D_MSK} value ${L_UMA_D}
	# Now, classify packets
	#Loop on this for every address in UMA_SRC_IP
	OLDIFS=$IFS
	IFS=","
	UMA_SRC_IP=$UMA_SRC_IP
	set -- $UMA_SRC_IP
	IFS=$OLDIFS
	while [ $# -gt 0 ] ; do
		ADDR=$1
		shift
		# filter to right qdisc to remark
		${TC} filter add dev ${L_BR} parent 1:0 protocol ip prio 1 u32 \
		match ip tos ${W_UMA_V} ${W_UMA_V_CMSK} \
		flowid 1:1
		${TC} filter add dev ${L_BR} parent 1:0 protocol ip prio 2 u32 \
		match ip tos ${W_UMA_D} ${W_UMA_D_CMSK} \
		flowid 1:2
	done
fi


echo "
	###Success"
exit 0
