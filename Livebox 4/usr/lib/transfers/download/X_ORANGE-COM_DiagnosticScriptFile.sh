#!/bin/sh

#####################################################################################
# INFO
#####################################################################################
#
# This script download diagnostic xml script file
#
# STEPS:
# - Download file
# - TODO Hash checking and signature process (need FT feedback)
# - Put the script file in /cfg/system if all checks OK
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
CACERT_FILE="/usr/lib/cwmp/cwmpdcerts.pem"
TMP_FILE="/tmp/autodiag-script.xml"
SCRIPT_FILE="/cfg/system/autodiag-script.xml"

#####################################################################################
# Command line argument parsing
#####################################################################################
parse_command_line $*

#####################################################################################
# Call CURL to perform the download
#####################################################################################
transfer_file "--cacert $CACERT_FILE -o $TMP_FILE"

#####################################################################################
# Check if the downloaded file is valid
#####################################################################################
if [ ! -e "$TMP_FILE" ]; then
  finish_transfer 9018 "Downloaded file does not exist"
  exit 1
fi

#####################################################################################
# Swap the file (if already one existing) and load it
#####################################################################################
if [ -e "$SCRIPT_FILE" ]; then
  /bin/rm -f $SCRIPT_FILE
fi

/bin/mv $TMP_FILE $SCRIPT_FILE
/bin/pcb_cli "AutoDiag.reloadDiagnosticsScript()"

#####################################################################################
# Update the status
#####################################################################################
finish_transfer 0 ""

exit 0
