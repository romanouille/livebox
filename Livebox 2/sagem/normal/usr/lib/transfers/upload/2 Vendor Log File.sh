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
# Defaults
#####################################################################################
TMPFILE="/tmp/debug.txt"

#####################################################################################
# Command line argument parsing
#####################################################################################
parse_command_line $*

#####################################################################################
# Trigger the backup
#####################################################################################
/bin/getDebugInformation $TMPFILE

#####################################################################################
# Call CURL to perform the upload
#####################################################################################
transfer_file_without_finish "--upload-file $TMPFILE"

#####################################################################################
# Update the status
#####################################################################################
finish_transfer $ERRORCODE "$ERRORSTRING"


exit 0
