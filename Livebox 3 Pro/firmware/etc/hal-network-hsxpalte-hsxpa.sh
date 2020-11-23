#!/bin/sh

DEVICE=/dev/ttyUSB0    # default value

OUTPUTFILE=/tmp/hal-network-hsxpalte-hsxpa.txt
CMD1=$2
CMD2=$3
CMD3=$4

#################################################################################################
#   Find which device is dedicated for usb serial communication
#################################################################################################
#   SCRIPT device
#  (what is x value for /dev/ttyUSBx ?) 
#        0 : OK
#################################################################################################
search_device() {
   ls /dev/ttyUSB* | tr -d '\n' | cut -d'B' -f2 | cut -d'/' -f1 > $OUTPUTFILE
   retval=0
}

#################################################################################################
#   Unlock SIM card
#################################################################################################
#   SCRIPT unlock_sim PIN PUK DEVICE
#      Example=SCRIPT unlock_sim 3801 66633934 /dev/ttyUSB1
#        0 : OK
#       14 : incorrect PIN
#       24 : incorrect PUK
#  1,11,21 : error (see OUTPUTFILE)
#  2,12,22 : error (see OUTPUTFILE)
#  3,13,23 : TIMEOUT
#   others : other errors (see OUTPUTFILE)
#################################################################################################
unlockSim() {
   if [ -n $CMD3 ] ; #----- specify a device
   then
      DEVICE=$CMD3
   fi
   
   (chat ABORT 'CME ERROR' ABORT 'SIM PIN' ABORT 'SIM PUK' TIMEOUT 1 '' ATE1 OK AT+CPIN? READY  < $DEVICE > $DEVICE) 2> $OUTPUTFILE
   retval=$?
   
   if [ $retval -eq 5 ] ; #----- please enter PIN code
   then
      (chat ABORT 'CME ERROR' TIMEOUT 1 '' AT+CPIN=$CMD1 OK  < $DEVICE > $DEVICE) 2> $OUTPUTFILE
      retval=$?
      if [ $retval -ne 0 ] ; # an error
      then
         let retval=$retval+10
         if [ $retval -eq 14 ] ;
         then
            echo "PIN code is incorrect" > $OUTPUTFILE
         fi
      fi
   elif [ $retval -eq 6 ] ; #----- please enter PUK code
   then
      (chat ABORT 'CME ERROR' TIMEOUT 1 '' AT+CPIN=$CMD2,$CMD1 OK  < $DEVICE > $DEVICE) 2> $OUTPUTFILE
      retval=$?
      if [ $retval -ne 0 ] ; # an error
      then
         let retval=$retval+20
         if [ $retval -eq 24 ] ;
         then
            echo "PUK code is incorrect" > $OUTPUTFILE
         fi
      fi
   fi
}

#################################################################################################
#   Configure apn value
#################################################################################################
#   SCRIPT configure_apn APN DEVICE
#      Example=SCRIPT configure_apn orange /dev/ttyUSB1
#################################################################################################
configureApn() {
   if [ -n $CMD2 ] ; #----- specify a device
   then
      DEVICE=$CMD2
   fi

   (chat ABORT 'ERROR' TIMEOUT 1 '' AT+CGDCONT=1,\"IP\",\"$CMD1\",\"0.0.0.0\",0,0 OK < $DEVICE > $DEVICE) 2> $OUTPUTFILE
   retval=$?
}

#################################################################################################
#   Switch usb dongle from Mass Storage to Serial Modem ()
#################################################################################################
#   SCRIPT usb_modeswitch
#        0 : OK
#################################################################################################
usbModeswitch() {
   (/usr/bin/usb_modeswitch -v 12d1 -p 14c1 -W -M "55534243123456780000000000000011062000000100000000000000000000") 2> $OUTPUTFILE
   retval=$?
}

#################################################################################################
#   Load drivers needed for dongle
#################################################################################################
#   SCRIPT load_drivers
#        0 : OK
#################################################################################################
loadDrivers() {
   (insmod /lib/modules/2.6.30/usbserial.ko) 2> $OUTPUTFILE
   retval=$?
   if [ $retval -eq 17 ] ;   # driver already loaded --> NO ERROR
   then
      retval=0
   fi
   if [ $retval -eq 0 ] ;
   then
      (insmod /lib/modules/2.6.30/option.ko) 2> $OUTPUTFILE
      retval=$?
      if [ $retval -eq 17 ] ;   # driver already loaded --> NO ERROR
      then
         retval=0
      fi
   fi
}

#################################################################################################
#   Show usage of this script
#################################################################################################
#   SCRIPT usage
#################################################################################################
usage() {
   echo Usage: $0 \(device\|unlock_sim PIN PUK\|load_drivers\|usb_modeswitch\)
   retval=0
}

#################################################################################################
#   Choose your action
#################################################################################################
case "$1" in
   device)
      search_device
      ;;
   unlock_sim)
      unlockSim
      ;;
   configure_apn)
      configureApn
      ;;
   load_drivers)
      loadDrivers
      ;;
   usb_modeswitch)
      usbModeswitch
      ;;
   *)
      usage
      ;;

esac

exit $retval
