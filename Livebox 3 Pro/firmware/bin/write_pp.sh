#!/bin/sh

# Sagemcom Broadband
# PPy  10/06/2011
# JPMt 21/07/2011
#
# Script to download permanent parameters binary file in ubi partition
#
# Utilisation:
# Command: write_pp.sh arg
#
# arg  :   Permanent Parameters File
#          in text Unix formatted
#
# On error file err is created
#          with some status informations
#
# if no arg, the script fail
#
#

# Use text filename as parameter
PP=$1

# Initialize permanent parameter ubi partition ...
UBIVOL="/dev/ubi0_2"

# .. and search it in the system 
for UV in /sys/class/ubi/ubi0/ubi0_*
do
   if [ `cat $UV/name` = "permanent_param" ]; then
      # echo "Found permanent_param UBI from $UV"
      UBIVOL=`echo "$UV" | sed -e 's/^\/sys\/class\/ubi\/ubi0\/\(.*\)$/\/dev\/\1/'`
      # echo "permanent_param UBI is $UBIVOL"
   fi
done

# Flash the file only if the file size is not null
if [ -s "$PP" ]
then

	# Save original PP file
	cp $PP ppFile

	# To be sure to have PP file in Unix format
	dos2unix -u ppFile

	# Generate binairy file format for PP
	genpp -o fusivPP_PermanentParameters.bin ppFile

	sleep 1

	# Store PP in permanent_param UBI partition
	#ubiupdatevol $UBIVOL $PP 2>>err 1>&2
	ubiupdatevol $UBIVOL fusivPP_PermanentParameters.bin 2>>err 1>&2

	sync
	sleep 3

	# Re-read PP
	get_pp all > ppFlash

	# Verify PP between original and written
	CMP=`cmp ppFlash ppFile`
	if [ "$CMP" = "" ]
	then
		# Dump PP from UBI Volume
		dd if=$UBIVOL of=testPP skip=532 bs=1c count=6 2> /dev/null

		# Retreive WAN_BASE_MAC_ADDRESS from binary PP file
		MEM_MAC=`hexdump -e '6/1 "%02x"' testPP | tr 'a-f' 'A-F'`

		# Retreive WAN_BASE_MAC_ADDRESS with tool
		PP_MAC=`get_pp WAN_BASE_MAC_ADDRESS`

		# Verify between PP get with tool and get with dump
		if [ "$PP_MAC" != "$MEM_MAC" ]
		then
			echo "==> Error 0 : cannot flash "$PP" as PP !!!"
			echo "$PP_MAC(PP_MAC)!=$MEM_MAC(MEM_MAC)" >>err
			exit 1
		else
			echo "==> Ok    : update "$PP" done !"
		fi
	else
		echo "==> Error : cannot flash "$PP" as PP !!!"
		echo "CMP(cmp -s ppFlash ppFile)="$CMP >>err
		exit 1
	fi
	rm -f err
	rm -f "$PP"
	rm -f testPP
	rm -f ppFile
	rm -f ppFlash
	rm -f fusivPP_PermanentParameters.bin

	exit 0
else 
	echo "==> Error 1 : cannot find "$PP" : Aborting !!!"
	exit 1
fi
