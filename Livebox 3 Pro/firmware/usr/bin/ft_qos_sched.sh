#! /bin/sh

DEV=$2


LINK=$3Kbps
echo "LINK=$LINK"
q1_pcr_rate=$4Kbps
echo "q1_pcr_rate=$q1_pcr_rate"
q2_pcr_rate=$5Kbps
echo "q2_pcr_rate=$q2_pcr_rate"
q3_pcr_rate=$6Kbps
echo "q3_pcr_rate=$q3_pcr_rate"
q4_pcr_rate=$7Kbps
echo "q4_pcr_rate=$q4_pcr_rate"
q5_pcr_rate=$8Kbps
echo "q5_pcr_rate=$q5_pcr_rate"

q1_ceil_rate=$9Kbps;
q2_ceil_rate=${10}Kbps;
q3_ceil_rate=${11}Kbps;
q4_ceil_rate=${12}Kbps;
q5_ceil_rate=${13}Kbps;


#=========================================================================================================
# 										CONFIGURATION WFQ
#=========================================================================================================
if [ "$1" == "add" ]; then 
	CMD_TC="tc qdisc $1 dev $DEV root handle 1:0 fusiv_wfq type dwpfq bw $LINK borrow 0xFF contribute 0xFF tcp-ack-priority 0xFF qinfo 0:1Kbps/$q4_ceil_rate 1:$q5_pcr_rate/$q5_ceil_rate 4:$q4_pcr_rate/$q4_ceil_rate 5:$q3_pcr_rate/$q3_ceil_rate 6:$q2_pcr_rate/$q2_ceil_rate 7:$q1_pcr_rate/$q1_ceil_rate" 
elif [ "$1" == "del" ]; then
	CMD_TC="tc qdisc del dev $DEV root handle 1:0" 
else
	echo "ERROR -> unknown command"
	exit -1
fi

echo "CMD_TC=$CMD_TC"
$CMD_TC




