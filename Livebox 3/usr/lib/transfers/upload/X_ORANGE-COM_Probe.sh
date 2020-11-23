#!/bin/sh

#####################################################################################
# INFO
#####################################################################################
#
# This script uploads the "Vendor log file" (e.g. the output of getDebugInformation)
# for tr069. This script is also responsible for updating the QueuedTransfer status.
#
# STEPS:
# - trigger the log creation using getDebugInformation
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

source /usr/lib/transfers/transfer_functions.sh

#####################################################################################
# Command line argument parsing
#####################################################################################
parse_command_line $*
##/usr/lib/transfers/upload/X_ORANGE-COM_Probe.sh --path=ManagementServer.QueuedTransfers.Entry.1 --url= --username= --password=
#####################################################################################
# Defaults
#####################################################################################
TMPFILE=$(/bin/pcb_cli -l "$PCBPATH.TargetFileName?")
ZIPFILE="${TMPFILE}.gz"

if [ "$TMPFILE" == "" ]; then
  finish_transfer 9016 "File not found"
  exit 1
fi

# We have to be able to handle certificate generated from RIP, the CA could also be changed by using --capath (override path if present)
TMPURL=$(/bin/pcb_cli -l "$PCBPATH.URL?")
TMPCERT='/usr/lib/probe/certs/figarocertclient.pem'
TMPCERT="/var/tmp/figarocertclient.pem"
TMPCA='/usr/lib/probe/certs/servfigarowbdvca.pem'



COMPRESSION=$(/bin/pcb_cli -l "Probe.Compression?")
if [ "$COMPRESSION" == "GZIP" ]; then
  #####################################################################################
  # Compress the file to send
  #####################################################################################
  /bin/gzip -c > $ZIPFILE < $TMPFILE
  TMPFILE="${ZIPFILE}"
fi


#######################################################################################
# We always calculate a sha1sum to be sure that the file is not corrupted
#######################################################################################
SHA1SUM=$(/usr/bin/sha1sum $TMPFILE | cut -d" " -f1)
MACADDR=$(/usr/sbin/readrip -m: WAN_ADDR)
DATE=$(date +"%a, %d %b %Y %H:%M:%S GMT")

HEADER_OPTIONS="
--header \"Header-Version: 1.0\"
--header \"Manufacturer-OUI: $(/bin/pcb_cli -l "DeviceInfo.ManufacturerOUI?")\"
--header \"Product-Class: $(/bin/pcb_cli -l "DeviceInfo.ProductClass?")\"
--header \"Serial-Number: $(/bin/pcb_cli -l "DeviceInfo.SerialNumber?")\"
--header \"Content-Digest: SHA1=$SHA1SUM\"
--header \"MAC: $MACADDR\"
--header \"Hardware-Version: $(/bin/pcb_cli -l "DeviceInfo.HardwareVersion?")\"
--header \"Software-Version: $(/bin/pcb_cli -l "DeviceInfo.SoftwareVersion?")\"
--header \"Probe-Name: Figaro\"
--header \"Probe-Version: $(/bin/pcb_cli -l "Probe.Version?")\"
--header \"Priority: P1\"
--header \"Export-Type: periodic\"
--header \"Customer-Agreement: true\"
--header \"Export-Attempt-Number: 0\"
--header \"Date: $DATE\"
"

CERTIFICATES="
--cert $TMPCERT --cacert $TMPCA
"

#####################################################################################
# Call CURL to perform the upload
#####################################################################################
transfer_file_without_finish "--verbose -m 10 $HEADER_OPTIONS $CERTIFICATES --upload-file $TMPFILE"

#####################################################################################
# Update the status
#####################################################################################
finish_transfer $ERRORCODE "$ERRORSTRING"


exit 0
