#!/bin/sh
# Create device files for thomson usb dect dongle
 
#check if PHYSDEVDRIVER is cp2101 used by thomson/generique dect 
if [ "$PHYSDEVDRIVER" != "cp2101" ]; then
exit
fi

#dbg
#env > /dev/console

if [ "$ACTION" = "add" ]; then
 #retrieve idProduct and idVendor to check with thomson dect (06b9 et 6000) or orange generic dect (0bdd) 
 IDPRODUCT=`cat /sys/${PHYSDEVPATH}/../../idProduct`
 IDVENDOR=`cat /sys/${PHYSDEVPATH}/../../idVendor`
 if test "$IDVENDOR" = "06b9" -a "$IDPRODUCT" = "6000" \
  || test "$IDVENDOR" = "0bdd" -a \( "$IDPRODUCT" = "0100" \
                                  -o "$IDPRODUCT" = "0101" \
								  -o "$IDPRODUCT" = "0110" \
								  -o "$IDPRODUCT" = "0111" \
								  -o "$IDPRODUCT" = "0120" \
								  -o "$IDPRODUCT" = "0121" \
								  -o "$IDPRODUCT" = "0130" \
								  -o "$IDPRODUCT" = "0131" \); then 
  echo "$ACTION Thomson usb dect dongle ($MDEV)" > /dev/console
  echo "$MDEV" > /tmp/etc/thomsonDect${MDEV}
  ln -sf /dev/${MDEV} /dev/thomsonDect${MDEV}
  hciattach -p -t 2 /dev/thomsonDect${MDEV} bcsp_usb 115200 flow
  hciconfig hci${MINOR} up
  sleep 1
  insmod /lib/modules/2.6.28.8/thomson_lower_dect_driver.ko hcidevid=${MINOR}
 fi
else if [ "$ACTION" = "remove" ]; then
 if [ "$MDEV" = `cat /tmp/etc/thomsonDect${MDEV}` ]; then
  killall hciattach
  rmmod thomson_lower_dect_driver
  rm /tmp/etc/thomsonDect${MDEV}
  rm /dev/thomsonDect${MDEV}
 fi
fi
fi