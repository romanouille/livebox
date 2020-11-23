#!/bin/sh

#####################################################################################
# INFO
#####################################################################################
#
# This script downloads and applies the "Vendor configuration file" (e.g. the
# encrypted hgwcfg.usr file) for tr069. This script is also responsible for
# updating the QueuedTransfer status.
#
# STEPS:
# - Download the encrypted hgwcfg file to /tmp/hgwcfg.crypt
# - Check/verify the downloaded file
# - Overwrite the existing /etc/config/hgwcfg.usr
# - Wait for TR069 status to become IDLE
# - Stop the TR069 daemon to avoid sending out a transfercomplete message
# - Update the QueuedTransfer status
# - Make sure the file system is synced
# - Trigger the restore sequence using NMC.Restore() [this will reboot and trigger
#      the box to use the new hgwcfg.usr settings]
# - After the reboot CWMP will automatically detect that the transfer was finished
#      which will cause it to send out the transfercomplete
#
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
CRYPT_FILE="/tmp/nbrcfg.crypt"
TMP_FILE="/tmp/nbrcfg.usr"
PERSISTENT_TMP_FILE="/etc/config/hgwcfg.usr.tmp"
CACERT_FILE="/usr/lib/cwmp/cwmpdcerts.pem"
CLCERT_FILE="/var/tmp/nbr.pem"

#####################################################################################
# Command line argument parsing
#####################################################################################
parse_command_line $*

#####################################################################################
# Extract client certif file
#####################################################################################
/usr/sbin/readrip -s "CLIENT_CERTIFICATE" > $CLCERT_FILE
/usr/sbin/readrip -s "PRIVATE_KEY" >> $CLCERT_FILE
/bin/chmod 400 $CLCERT_FILE
if [ ! -e "$CLCERT_FILE" ]; then
  finish_transfer 9002 "Problem with the local certificate"
  exit 1
fi

#####################################################################################
# Call CURL to perform the download
#####################################################################################
transfer_file_without_finish "--header \"User-Agent: CustomerConfiguration\" --header \"MAC: $WAN_ADDR\"  --header \"FW_version: $SW_VERSION\" --header \"lb_manufacturer: $MANUFACTURER\" --header \"lb_productclass: $PRODUCT_CLASS\" --header \"lb_serialnumber: $SERIAL_NUMBER\" --cert $CLCERT_FILE --cacert $CACERT_FILE -o $CRYPT_FILE"
/bin/rm -f $CLCERT_FILE
if [ ! "$ERRORCODE" == "0" ]; then
  finish_transfer $ERRORCODE "$ERRORSTRING"
  exit 1
fi

#####################################################################################
# Check if the downloaded file is valid
#####################################################################################
if [ ! -e "$CRYPT_FILE" ]; then
  finish_transfer 9018 "Downloaded file does not exist"
  exit 1
fi

#####################################################################################
# Decrypt the file into TMP_FILE
#####################################################################################
PPP_LOGIN=`/bin/pcb_cli -l "NMC.Username?"`
/usr/bin/nbr_crypt -p $PPP_LOGIN -d $CRYPT_FILE
if [ ! -e "$TMP_FILE" ]; then
  finish_transfer 9018 "File decryption failed (invalid file or passphrase)"
  /bin/pcb_cli "NMC.NetworkConfig.Status=Error"
  exit 1
fi

CHECK=`/bin/cat $TMP_FILE | /bin/grep "hgwconfig" | /bin/grep "softathome"`
if [ -z "$CHECK" ]; then
  finish_transfer 9018 "hgwcfg_check reported that the file is not valid, no hgwcfg string in this file"
  /bin/rm -f $TMP_FILE
  /bin/pcb_cli "NMC.NetworkConfig.Status=Error"
  exit 1
fi

/bin/hgwcfg_check $TMP_FILE
if [ "$?" -ne "0" ]; then
  finish_transfer 9018 "hgwcfg_check reported that the file is not valid"
  /bin/rm -f $TMP_FILE
  /bin/pcb_cli "NMC.NetworkConfig.Status=Error"
  exit 1
fi

/bin/mv $TMP_FILE $PERSISTENT_TMP_FILE
/bin/sync

#####################################################################################
# Wait for TR069 to become idle 
#####################################################################################
STATUS=`/bin/pcb_cli -l "ManagementServer.SessionStatus?"`
while [ "$STATUS" != "Idle" ]
do
  /bin/sleep 10
  STATUS=`/bin/pcb_cli -l "ManagementServer.SessionStatus?"`
done

#####################################################################################
# Disable the daemon to avoid sending the transfercomplete message
#####################################################################################
kill `/bin/cat /var/run/cwmpd.pid`

#####################################################################################
# Update the status
#####################################################################################
/bin/pcb_cli "NMC.NetworkConfig.Status=Available"
finish_transfer 0 ""

