#!/bin/sh

#####################################################################################
# INFO
#####################################################################################
#
# This script uploads the "Vendor configuration file" (e.g. the
# encrypted hgwcfg.usr file) for tr069. This script is also responsible for
# updating the QueuedTransfer status.
#
# STEPS:
# - Crypt user file
# - Upload the encrypted hgwcfg file to the specified server
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
# Env. stuff
#####################################################################################
SERIAL_NUMBER="UNKNOWN"
PRODUCT_CLASS="UNKNOWN"
WAN_ADDR="00:01:02:03:04:05"
MANUFACTURER="UNKNOWN"
SW_VERSION=`/bin/pcb_cli -l "DeviceInfo.SoftwareVersion?"`

if [ -f /etc/environment ]; then
  source /etc/environment
fi

#####################################################################################
# Defaults
#####################################################################################
HGWCFG_FILE="/etc/config/hgwcfg.usr"
CACERT_FILE="/usr/lib/cwmp/cwmpdcerts.pem"

#####################################################################################
# Command line argument parsing
#####################################################################################
parse_command_line $*

#####################################################################################
# Fetch ppp_login and config filename
#####################################################################################
PPP_LOGIN=`/bin/pcb_cli -l "NMC.Username?"`
CIPHERED_NAME=`/bin/pcb_cli -l "NMC.NetworkConfig.ConfigName?"`
if [ -z "$CIPHERED_NAME" ]; then
  finish_transfer 9002 "Could not fetch backup filename"
  exit 1
fi
CIPHERED_FILE="/tmp/"${CIPHERED_NAME}

#####################################################################################
# Cipher /etc/config/hgwcfg.usr into /tmp/
#####################################################################################
/usr/bin/nbr_crypt -p $PPP_LOGIN -e $CIPHERED_FILE
if [ ! -e "$CIPHERED_FILE" ]; then
  finish_transfer 9019 "Fail to encrypt backup file"
  exit 1
fi
#####################################################################################
# Call CURL to perform the upload
#####################################################################################
transfer_file "--header \"User-Agent: CustomerConfiguration\" --header \"MAC: $WAN_ADDR\"  --header \"FW_version: $SW_VERSION\" --header \"lb_manufacturer: $MANUFACTURER\" --header \"lb_productclass: $PRODUCT_CLASS\" --header \"lb_serialnumber: $SERIAL_NUMBER\" --cacert $CACERT_FILE --upload-file $CIPHERED_FILE"

#####################################################################################
# Update the status
#####################################################################################
finish_transfer 0 ""

exit 0
