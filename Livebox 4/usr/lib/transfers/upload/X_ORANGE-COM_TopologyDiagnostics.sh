#!/bin/sh

#####################################################################################
# INFO
#####################################################################################
#
# This script uploads the "topology diagnostics xml" file
# This script is also responsible for updating the QueuedTransfer status.
#
# STEPS:
# - trigger file generation using topology builder
# - Upload the xml file to the specified server
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

WAN_ADDR_HEADER=$(echo "'MAC: $(sahenv -f /etc/environment sh -c "echo \$WAN_ADDR")'")
echo $WAN_ADDR_HEADER > /tmp/wanaddr

#####################################################################################
# Command line argument parsing
#####################################################################################
parse_command_line $*

#####################################################################################
# Fetch the file name
#####################################################################################
TMPFILE=$(/bin/pcb_cli -l "$PCBPATH.TargetFileName?")
RESULT=""

if [ "$TMPFILE" == "" ]; then
  TMPFILE=$(for i in $(pcb_cli -l TopologyDiagnostics.Results.[Status!=Uploaded].Name?); do FILE=$i; done; echo "/tmp/$FILE");
  RESULT=$(for i in $(pcb_cli -z TopologyDiagnostics.Results.[Status!=Uploaded]?); do FILE=$i; done; echo $FILE);
fi

echo $TMPFILE > /tmp/transfer
echo $RESULT >> /tmp/transfer

if [ "$TMPFILE" == "" ]; then
  finish_transfer 9016 "File not found"
  echo "File not found" >> /tmp/transfer
  exit 1
fi


#####################################################################################
# Call CURL to perform the upload
#####################################################################################
echo "TRANSFER: --upload-file $TMPFILE --header $WAN_ADDR_HEADER --header 'Content-Type: application/xml' --header Expect:"  >> /tmp/transfer
transfer_file "--upload-file $TMPFILE --header $WAN_ADDR_HEADER --header 'Content-Type: application/xml' --header Expect:"
echo "TRANSFER: done" >> /tmp/transfer

#####################################################################################
# Update the status
#####################################################################################
finish_transfer 0 ""
echo "TRANSFER: finished $RESULT" >> /tmp/transfer

echo "Remove $TMPFILE" >> /tmp/transfer
/bin/rm -f $TMPFILE
/bin/sync

if [ "$RESULT" == "" ]; then
  echo "Result is empty, no update of state" >> /tmp/transfer
  exit 0
fi

echo "Set state to uploaded for $RESULT" >> /tmp/transfer
export TOPOLOGY_RESULT=$RESULT
echo "$TOPOLOGY_RESULT" >> /tmp/transfer
echo $(pcb_cli "$TOPOLOGY_RESULT.setState(Uploaded)") >> /tmp/transfer

exit 0
