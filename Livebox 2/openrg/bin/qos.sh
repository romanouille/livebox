#!/bin/sh 
#
# Author:	
#
# This script configures QoS for the WIFI community service
#
# Adjust interfaces to fit with the target
# Adjust DSCP marking to fit with the customer
# Adjust system dependent invocations
#

TRUE=1
FALSE=0

# Mask to apply when matching an IP address
IP_MATCH_MSK=32

#QOS_TYPE data/voice
QOS_DATA=1
QOS_VOICE=2
QOS_REMARQUAGE=3

#service enable
UMA_EN=$TRUE
WIFICOM_EN=$TRUE

### Support from the system
TC=tc #Path to tc binary
#TC=echo #DEBUG only


##############################################################
#
#              GET PARAMETER
#
##############################################################
### Fetch arguments
E_OPT_ERROR=1
NO_ARGS=0

if [ $# -eq "$NO_ARGS" ] #script invoked with no command-line args
then
	echo "
	Usage . $0 options
    --qos-type|-q:  qos type data/voice
		--device|-d:    device to apply qos
		--overhead|-o:  overhead of protocol used
		--data-bw|-t:   total upstream bandwidth (kbit)
		--voice-bw|-v:  VC Conv egress bandwitdh (kbit)
		--H323ReADSL|-rh: case of ReADSL line in H323
		--uma-dst-addr|-ud: UMA dst address
		--with-com|-w:  Wifi community address
		"
	exit $E_OPT_ERROR
fi

while [ -n "$1" ] ; do
    case $1 in
	--qos-type|-q)
          QOS_TYPE=$2
	  shift 2;;
      
	--device|-d)
	  DEVICE=$2
	  shift 2;;
		  
	--overhead|-o)
	  OVERHEAD=$2
	  shift 2;;
		  
	--data-bw|-t)
	  W_DA_UPLINK=$2
	  shift 2;;
			
	--voice-bw|-v)
	  VOICE_BW=$2
	  shift 2;;

	--H323ReADSL|-rh)
	  H323ReADSL=$2
	  shift 2;;

	--uma-dst-addr|-ud) #We should expect multiple addresses, use a coma-separated list
	  UMA_DST_IP=$2
	  if [ "$UMA_DST_IP" = "0.0.0.0" ]
	      then
	      UMA_EN=$FALSE
	  fi
	  shift 2
	  ;;

	--with-com|-w)
	  WIFICOM_DST_IP=$2
	  if [ "$WIFICOM_DST_IP" = "0.0.0.0" ]
	      then
	      WIFICOM_EN=$FALSE
	  fi
	  shift 2
	  ;;
    esac
done

echo "
	Calling `basename $0` with:
    --qos-type|-q:  $QOS_TYPE
		--device|-d:    $DEVICE
		--overhead|-o:  $OVERHEAD
		--data-bw|-t:   $W_DA_UPLINK
		--voice-bw|-v:  $VOICE_BW
		--uma-dst-addr|-ud: $UMA_DST_IP
		--with-com|-w:  $WIFICOM_DST_IP
		"

##############################################################
#
#              QOS VCI FUNCTION
#
##############################################################

qos_clean_vci()
{
echo "
	###Cleaning Qdiscs"
	echo $DEVICE...
	${TC} qdisc del dev ${DEVICE} root	
}

#remarquage WAN -> LAN
qos_remarquage()
{
    ${TC} qdisc del dev br0 root

    #Remarquage
    ${TC} qdisc add dev br0 handle 1:0 root dsmark indices 8 default_index 0
    # All packets in this qdisc is marked by value
    ${TC} class change dev br0 classid 1:1 dsmark mask 0x00 value 0x00 
    ${TC} class change dev br0 classid 1:2 dsmark mask 0x00 value 0x80
    ${TC} class change dev br0 classid 1:3 dsmark mask 0x00 value 0xa0
    ${TC} class change dev br0 classid 1:4 dsmark mask 0x00 value 0xc0


    ${TC} filter add dev br0 parent 1:0 protocol ip prio 1 u32 \
    match ip tos 0xe0 0xff \
    flowid 1:2
    ${TC} filter add dev br0 parent 1:0 protocol ip prio 1 u32 \
    match ip tos 0xc0 0xff \
    flowid 1:2
    ${TC} filter add dev br0 parent 1:0 protocol ip prio 1 u32 \
    match ip tos 0xb8 0xff \
    flowid 1:4
    ${TC} filter add dev br0 parent 1:0 protocol ip prio 1 u32 \
    match ip tos 0xa0 0xff \
    flowid 1:4
    ${TC} filter add dev br0 parent 1:0 protocol ip prio 1 u32 \
    match ip tos 0x98 0xff \
    flowid 1:2
    ${TC} filter add dev br0 parent 1:0 protocol ip prio 1 u32 \
    match ip tos 0x90 0xff \
    flowid 1:2
    ${TC} filter add dev br0 parent 1:0 protocol ip prio 1 u32 \
    match ip tos 0x88 0xff \
    flowid 1:2
    ${TC} filter add dev br0 parent 1:0 protocol ip prio 1 u32 \
    match ip tos 0x80 0xff \
    flowid 1:2
    ${TC} filter add dev br0 parent 1:0 protocol ip prio 1 u32 \
    match ip tos 0x78 0xff \
    flowid 1:2
    ${TC} filter add dev br0 parent 1:0 protocol ip prio 1 u32 \
    match ip tos 0x70 0xff \
    flowid 1:2
    ${TC} filter add dev br0 parent 1:0 protocol ip prio 1 u32 \
    match ip tos 0x68 0xff \
    flowid 1:2
    ${TC} filter add dev br0 parent 1:0 protocol ip prio 1 u32 \
    match ip tos 0x60 0xff \
    flowid 1:2
    ${TC} filter add dev br0 parent 1:0 protocol ip prio 1 u32 \
    match ip tos 0x58 0xff \
    flowid 1:1
    ${TC} filter add dev br0 parent 1:0 protocol ip prio 1 u32 \
    match ip tos 0x50 0xff \
    flowid 1:1
    ${TC} filter add dev br0 parent 1:0 protocol ip prio 1 u32 \
    match ip tos 0x48 0xff \
    flowid 1:3
    ${TC} filter add dev br0 parent 1:0 protocol ip prio 1 u32 \
    match ip tos 0x40 0xff \
    flowid 1:1
    ${TC} filter add dev br0 parent 1:0 protocol ip prio 1 u32 \
    match ip tos 0x38 0xff \
    flowid 1:1
    ${TC} filter add dev br0 parent 1:0 protocol ip prio 1 u32 \
    match ip tos 0x30 0xff \
    flowid 1:1
    ${TC} filter add dev br0 parent 1:0 protocol ip prio 1 u32 \
    match ip tos 0x28 0xff \
    flowid 1:1
    ${TC} filter add dev br0 parent 1:0 protocol ip prio 1 u32 \
    match ip tos 0x20 0xff \
    flowid 1:1
}

qos_filter_vci()
{
# Now, classify Public packets

if [ "$WIFICOM_EN" -eq "$TRUE" ]
then
	#Loop on this for every address in WIFICOM_DST_IP
	OLDIFS=$IFS
	IFS=","
	WIFICOM_DST_IP=$WIFICOM_DST_IP
	set -- $WIFICOM_DST_IP
	IFS=$OLDIFS
	while [ $# -gt 0 ] ; do
	        ADDR=$1
		shift
                # filter WIFICOM packet by distant address	
                ${TC} filter add dev ${DEVICE} parent 2:0 protocol ip prio 1 u32 \
		                match ip dst ${ADDR}/${IP_MATCH_MSK}\
		                flowid 2:50
	done
fi

# Now, classify Private packets
# filter UMA packet by tos field and distant address
if [ "$UMA_EN" -eq "$TRUE" ]
then
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
		${TC} filter add dev ${DEVICE} parent 2:0 protocol ip prio 2 u32 \
				match ip dst ${ADDR}/${IP_MATCH_MSK}\
				match ip tos 0xb8 0xff \
				flowid 2:20
		${TC} filter add dev ${DEVICE} parent 2:0 protocol ip prio 3 u32 \
				match ip dst ${ADDR}/${IP_MATCH_MSK}\
				flowid 2:30
	done			
fi
		# filter packet by tos field
		${TC} filter add dev ${DEVICE} parent 2:0 protocol ip prio 4 u32 \
		    match ip tos 0xb8 0xff \
		    flowid 2:10
		${TC} filter add dev ${DEVICE} parent 2:0 protocol ip prio 4 u32 \
		    match ip tos 0xa0 0xff \
		    flowid 2:10
		    
		${TC} filter add dev ${DEVICE} parent 2:0 protocol ip prio 4 u32 \
		    match ip tos 0xc0 0xff \
		    flowid 2:20
		${TC} filter add dev ${DEVICE} parent 2:0 protocol ip prio 4 u32 \
		    match ip tos 0xe0 0xff \
		    flowid 2:20
	    
		${TC} filter add dev ${DEVICE} parent 2:0 protocol ip prio 4 u32 \
		    match ip tos 0x98 0xff \
		    flowid 2:30
		${TC} filter add dev ${DEVICE} parent 2:0 protocol ip prio 4 u32 \
		    match ip tos 0x90 0xff \
		    flowid 2:30
		${TC} filter add dev ${DEVICE} parent 2:0 protocol ip prio 4 u32 \
		    match ip tos 0x88 0xff \
		    flowid 2:30
		${TC} filter add dev ${DEVICE} parent 2:0 protocol ip prio 4 u32 \
		    match ip tos 0x80 0xff \
		    flowid 2:30
		${TC} filter add dev ${DEVICE} parent 2:0 protocol ip prio 4 u32 \
		    match ip tos 0x78 0xff \
		    flowid 2:30
		${TC} filter add dev ${DEVICE} parent 2:0 protocol ip prio 4 u32 \
		    match ip tos 0x70 0xff \
		    flowid 2:30
		${TC} filter add dev ${DEVICE} parent 2:0 protocol ip prio 4 u32 \
		    match ip tos 0x68 0xff \
		    flowid 2:30
		${TC} filter add dev ${DEVICE} parent 2:0 protocol ip prio 4 u32 \
		    match ip tos 0x60 0xff \
		    flowid 2:30
		${TC} filter add dev ${DEVICE} parent 2:0 protocol ip prio 4 u32 \
		    match ip tos 0x48 0xff \
		    flowid 2:30        		                 		    
}


qos_vci()
{
PCR_RATE=$1
CEIL_POURCENT=99
let CEIL_RATE=$(($PCR_RATE*$CEIL_POURCENT))
let CEIL_RATE=$(($CEIL_RATE/100))
PCR_RATE=$CEIL_RATE
Q5_CEIL_RATE=$CEIL_RATE

if [ $PCR_RATE -lt 224 ]
then
  echo PCR_RATE<224
  let Q1_RATE=$(($PCR_RATE-4))
  Q1_CEIL=$PCR_RATE
  Q2_RATE=1
  Q3_RATE=1
  Q4_RATE=1
  Q5_RATE=1
else
  if [ $PCR_RATE -lt 320 ]
  then
    echo PCR_RATE<320
    Q1_RATE=220
    Q1_CEIL=220
    let Q2_RATE=$(($PCR_RATE-223))
    Q3_RATE=1
    Q4_RATE=1
    Q5_RATE=1
  else
    if [ $PCR_RATE -ge 320 ]
    then
      echo PCR_RATE>=320
      Q1_RATE=220
      Q1_CEIL=220
      if [ $PCR_RATE -lt 529 ]
      then
        echo PCR_RATE<529
        Q2_RATE=90
      else
        Q2_RATE=180
      fi
      
      let REST=$(($PCR_RATE-220-$Q2_RATE))
      if [ $REST -le 128 ]
      then
        echo REST<=128
        Q3_RATE=`expr $REST - 2`
        let Q3_RATE=$(($REST2))
        Q4_RATE=1
        Q5_RATE=1
      else
        Q3_RATE=128
        let Q4_RATE=$(((95*($REST-$Q3_RATE))/100))
        let Q5_RATE=$(((5*($REST-$Q3_RATE))/100))
      fi
    fi
  fi
fi

#special value of Q5 rate for FTTH mode
if [ $PCR_RATE -eq 99000 ]
then
  Q5_CEIL_RATE=1024
  Q5_RATE=1
fi

echo PCR_RATE $PCR_RATE
echo CEIL_RATE $CEIL_RATE
echo Q5_CEIL_RATE $Q5_CEIL_RATE
echo Q1_RATE $Q1_RATE
echo Q1_CEIL $Q1_CEIL
echo Q2_RATE $Q2_RATE
echo Q3_RATE $Q3_RATE
echo Q4_RATE $Q4_RATE
echo Q5_RATE $Q5_RATE

$TC qdisc add dev $DEVICE handle 1:0 root dsmark indices 4 default_index 0

$TC qdisc add dev $DEVICE parent 1: handle 2:0 htb default 40

$TC class add dev $DEVICE parent 2:0 classid 2:1 htb rate ${PCR_RATE}kbit ceil ${CEIL_RATE}kbit prio 0 overhead $OVERHEAD

$TC class add dev $DEVICE parent 2:1 classid 2:10 htb rate ${Q1_RATE}kbit ceil ${CEIL_RATE}kbit prio 1 overhead $OVERHEAD
$TC class add dev $DEVICE parent 2:1 classid 2:20 htb rate ${Q2_RATE}kbit ceil ${CEIL_RATE}kbit prio 2 overhead $OVERHEAD
$TC class add dev $DEVICE parent 2:1 classid 2:30 htb rate ${Q3_RATE}kbit ceil ${CEIL_RATE}kbit prio 3 overhead $OVERHEAD
$TC class add dev $DEVICE parent 2:1 classid 2:40 htb rate ${Q4_RATE}kbit ceil ${CEIL_RATE}kbit prio 4 overhead $OVERHEAD
$TC class add dev $DEVICE parent 2:1 classid 2:50 htb rate ${Q5_RATE}kbit ceil ${Q5_CEIL_RATE}kbit prio 5 overhead $OVERHEAD 

$TC qdisc add dev $DEVICE parent 2:10 handle 10 pfifo limit 10
$TC qdisc add dev $DEVICE parent 2:20 handle 20 pfifo limit 10
$TC qdisc add dev $DEVICE parent 2:30 handle 30 sfq perturb 10
$TC qdisc add dev $DEVICE parent 2:40 handle 40 sfq perturb 10
$TC qdisc add dev $DEVICE parent 2:50 handle 50 sfq perturb 10

}

##############################################################
#
#              QOS VCCONV FUNCTION
#
##############################################################
qos_clean_vcconv()
{
echo "
	###Cleaning Qdiscs"
	echo $DEVICE...
	${TC} qdisc del dev ${DEVICE} root
}

qos_vcconv()
{

if [ $H323ReADSL -ne 1 ]
then

  PCR_RATE=$1
  CEIL_RATE=$PCR_RATE

  if [ $PCR_RATE -ge 320 ]
  then
    Q1_RATE=220
  else
    Q1_RATE=150
  fi

  let Q2_RATE=$(($PCR_RATE-1-$Q1_RATE))


  $TC qdisc add dev $DEVICE handle 1:0 root dsmark indices 4 default_index 0

  $TC qdisc add dev $DEVICE parent 1: handle 2:0 htb default 10

  $TC class add dev $DEVICE parent 2:0 classid 2:1 htb rate ${PCR_RATE}kbit ceil ${CEIL_RATE}kbit prio 0 overhead $OVERHEAD 

  $TC class add dev $DEVICE parent 2:1 classid 2:10 htb rate ${Q1_RATE}kbit ceil ${CEIL_RATE}kbit prio 0 overhead $OVERHEAD
  $TC class add dev $DEVICE parent 2:1 classid 2:20 htb rate ${Q2_RATE}kbit ceil ${CEIL_RATE}kbit prio 1 overhead $OVERHEAD  
  $TC class add dev $DEVICE parent 2:1 classid 2:30 htb rate 1kbit ceil ${CEIL_RATE}kbit prio 2 overhead $OVERHEAD 

  $TC qdisc add dev $DEVICE parent 2:10 handle 10 pfifo limit 10
  $TC qdisc add dev $DEVICE parent 2:20 handle 20 pfifo limit 10
  $TC qdisc add dev $DEVICE parent 2:30 handle 30 sfq perturb 10


  # Now, classify packets
  # Loop on this for every address in UMA_DST_IP
    OLDIFS=$IFS
    IFS=","
    UMA_DST_IP=$UMA_DST_IP
    set -- $UMA_DST_IP
    IFS=$OLDIFS
    while [ $# -gt 0 ] ; do
    ADDR=$1
    shift
  # filter UMA packet by tos field and distant address
    ${TC} filter add dev ${DEVICE} parent 2:0 protocol ip prio 2 u32 \
        match ip dst ${ADDR}/${IP_MATCH_MSK}\
        match ip tos 0xb8 0xff \
        flowid 2:20
    ${TC} filter add dev ${DEVICE} parent 2:0 protocol ip prio 3 u32 \
        match ip dst ${ADDR}/${IP_MATCH_MSK}\
        flowid 2:30
    done
fi			
}

##############################################################################################################

if [ $QOS_TYPE -eq $QOS_DATA ]
then
  qos_clean_vci
  qos_vci $W_DA_UPLINK
  qos_filter_vci
else
  if [ $QOS_TYPE -eq $QOS_VOICE ]
  then
    qos_clean_vcconv
    qos_vcconv $VOICE_BW
  else
    qos_remarquage
  fi
fi
echo "
	###Success"
exit 0
