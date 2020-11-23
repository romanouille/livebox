#!/bin/sh

FILEWIFI="/tmp/wifilogtmp"
TMPFILE=/tmp/wifitmp
HEADER="WIFI,"

##sync rate
#[2014/03/19 - 15:16:16], WIFI, Type = Radio, Name = wifi0_bcm, Status = ON
daterate0=`date +"%Y/%m/%d - %X"`
rate0=`wlctl -i wl0 rate`
echo "["$daterate0"], "$HEADER" Interface = wl0, SyncRate = "$rate0 > $FILEWIFI
daterate1=`date +"%Y/%m/%d - %X"`
rate1=`wlctl -i wl1 rate`
echo "["$daterate1"], "$HEADER" Interface = wl1, SyncRate = "$rate1 >> $FILEWIFI

##txnobuf
counters0=`wlctl -i wl0 counters`
datecounters0=`date +"%Y/%m/%d - %X"`
echo $counters0 > $TMPFILE
txnobuf0=`cat $TMPFILE | grep -e txnobuf | awk '{print $20}'`
echo "["$datecounters0"], "$HEADER" Interface = wl0, txnobuf = "$txnobuf0 >> $FILEWIFI
rm -f $TMPFILE
counters1=`wlctl -i wl1 counters`
datecounters1=`date +"%Y/%m/%d - %X"`
echo $counters1 > $TMPFILE
txnobuf1=`cat $TMPFILE | grep -e txnobuf | awk '{print $20}'`
echo "["$datecounters1"], "$HEADER" Interface = wl1, txnobuf = "$txnobuf1 >> $FILEWIFI

##associated station

assosta0=`wlctl -i wl0 assoclistinfo`
dateassosta0=`date +"%Y/%m/%d - %X"`
echo $assosta0 > $TMPFILE
assstaformat0=`cat $TMPFILE | grep -e stations | awk '{print $2}'`
var=$(echo $assstaformat0| awk -F":" '{print $1,$2}')   
set -- $var
echo "["$dateassosta0"], "$HEADER" Interface = wl0, associatedStation = "$2 >> $FILEWIFI
rm -f $TMPFILE
assosta1=`wlctl -i wl1 assoclistinfo`
dateassosta1=`date +"%Y/%m/%d - %X"`
echo $assosta1 > $TMPFILE
assstaformat1=`cat $TMPFILE | grep -e stations | awk '{print $2}'`
var=$(echo $assstaformat1| awk -F":" '{print $1,$2}')   
set -- $var
echo "["$dateassosta1"], "$HEADER" Interface = wl1, associatedStation = "$2 >> $FILEWIFI
rm -f $TMPFILE

##Available buffers
osl0=`wlctl -i wl0 dump osl`
dateosl0=`date +"%Y/%m/%d - %X"`
echo $osl0 > $TMPFILE
currobj0=`cat $TMPFILE | grep -e curr_obj | awk '{print $6}'`
max_obj0=`cat $TMPFILE | grep -e max_obj | awk '{print $2}'`
obj_size0=`cat $TMPFILE | grep -e obj_size | awk '{print $4}'`
fast_allocs0=`cat $TMPFILE | grep -e fast_allocs | awk '{print $10}'`
fast_frees0=`cat $TMPFILE | grep -e fast_frees | awk '{print $12}'`
echo "["$dateosl0"], "$HEADER" Interface = wl0, curr_obj = "$currobj0", max_obj = "$max_obj0", obj_size = "$obj_size0", fast_allocs = "$fast_allocs0", fast_frees = "$fast_frees0>> $FILEWIFI
rm -f $TMPFILE
osl1=`wlctl -i wl1 dump osl`
dateosl1=`date +"%Y/%m/%d - %X"`
echo $osl1 > $TMPFILE
currobj1=`cat $TMPFILE | grep -e curr_obj | awk '{print $6}'`
max_obj1=`cat $TMPFILE | grep -e max_obj | awk '{print $2}'`
obj_size1=`cat $TMPFILE | grep -e obj_size | awk '{print $4}'`
fast_allocs1=`cat $TMPFILE | grep -e fast_allocs | awk '{print $10}'`
fast_frees1=`cat $TMPFILE | grep -e fast_frees | awk '{print $12}'`
echo "["$dateosl1"], "$HEADER" Interface = wl1, curr_obj = "$currobj1", max_obj = "$max_obj1", obj_size = "$obj_size1", fast_allocs = "$fast_allocs1", fast_frees = "$fast_frees1>> $FILEWIFI
rm -f $TMPFILE

##Txop
datechanim0=`date +"%Y/%m/%d - %X"`
chanim0=`wlctl -i wl0 chanim_stats| tail -n 1 | awk '{ print $8 }'`
echo "["$datechanim0"], "$HEADER" Interface = wl0, Txop = "$chanim0 >> $FILEWIFI
datechanim1=`date +"%Y/%m/%d - %X"`
chanim1=`wlctl -i wl1 chanim_stats| tail -n 1 | awk '{ print $8 }'`
echo "["$datechanim1"], "$HEADER" Interface = wl1, Txop = "$chanim1 >> $FILEWIFI

## radar detection
dateradar0=`date +"%Y/%m/%d - %X"`
radar0=`wlctl -i wl0 dfs_status`
echo $radar0 > $TMPFILE
radarstate0=`cat $TMPFILE | grep -e IDLE | awk '{print $8}'`
if test -z "$radarstate0"
then
        radarstate0=`cat $TMPFILE | grep -e Pre-ISM | awk '{print $8}'`
        if test -z "$radarstate0"
        then
                radarstate0=`cat $TMPFILE | grep -e Monitoring(ISM) | awk '{print $9}'`
        fi
fi
echo "["$dateradar0"], "$HEADER" Interface = wl0, radarDetection = "$radarstate0 >> $FILEWIFI
rm -f $TMPFILE
radar1=`wlctl -i wl1 dfs_status`
dateradar1=`date +"%Y/%m/%d - %X"`
echo $radar1 > $TMPFILE
radarstate1=`cat $TMPFILE | grep -e IDLE | awk '{print $8}'`
if test -z "$radarstate1"
then
        radarstate1=`cat $TMPFILE | grep -e Pre-ISM | awk '{print $8}'`
        if test -z "$radarstate1"
        then
                radarstate1=`cat $TMPFILE | grep -e Monitoring | awk '{print $9}'`
        fi
fi
echo "["$dateradar1"], "$HEADER" Interface = wl1, radarDetection = "$radarstate1 >> $FILEWIFI
rm -f $TMPFILE
chmod 777 $FILEWIFI
