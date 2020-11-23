#!/bin/sh
# Create /etc/bmeSerial according to board serial number / board name / software version
# max size is 32 bytes
# (c) 2011 SAGEMCOM 
# 
# Notice :
# If you want to force the model in the Inventory Serial Number item, fill it here :
FORCE_MODEL=""
# If you want to force the version in the Inventory Serial Number item, fill it here :
FORCE_VERSION=""

# Get Board Type
source /bin/get_board_type.sh

# Output file name
BME_SERIAL_FILE=/etc/bmeSerialNumber

# retrieve board serial number
SERIAL_NUMBER=`get_pp 2`

if [  -z "$SERIAL_NUMBER" ] 
then
# Force serial number  
    SERIAL_NUMBER="LK12345DP123456"
fi 
   
if [ "$FORCE_MODEL" = "" ] 
then 

	# Set MODEL value
	case "$BOARD_TYPE_SHORT" in

		"LB2.8")
			# Set Value for LiveBox 2.8
			MODEL="LB3_FR"
			;;
		* )
			# Set Value for other boards to board type short
			MODEL=$BOARD_TYPE_SHORT
			;;

	esac

else 
	MODEL="$FORCE_MODEL"
fi

if [ "$FORCE_VERSION" = "" ] 
then 
	# Default software version
	VERSION="000000"

	OPER_MTD=`grep operational /proc/mtd | awk 'FS=":" {print $1}'`
	if [ "$OPER_MTD" != "" ] ; then  
		OPER_OFF=`dd if=/dev/$OPER_MTD bs=1 skip=148 count=4 2> /dev/null | hexdump -e '"" "%d"'`
		OPER_OFF=$(($OPER_OFF+32))
		OPER_V=`dd if=/dev/$OPER_MTD bs=1 skip=$OPER_OFF count=32 2> /dev/null` 
		# Use only 0-9 digits
		FULL_VERSION=`echo $OPER_V | sed -e 's/[^0-9]//g'`
		# echo "full VERSION : $FULL_VERSION"
		# Use only last 6 digits.
		VERSION=`printf "%06u" $(($FULL_VERSION%1000000))`
		# echo  "VERSION : " $VERSION
	fi
else 
	VERSION="$FORCE_VERSION"
fi

BME_SERIAL="$SERIAL_NUMBER $MODEL $VERSION"
echo "Set BME Serial : $BME_SERIAL"
echo -n "$BME_SERIAL" > $BME_SERIAL_FILE

