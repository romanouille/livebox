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
# Defaults
#####################################################################################
TMPFILE="/tmp/hgwcfg.crypt"
PERSISTENTTMPFILE="/etc/config/hgwcfg.usr.tmp"

#####################################################################################
# Command line argument parsing
#####################################################################################
parse_command_line $*

#####################################################################################
# Call CURL to perform the download
#####################################################################################
transfer_file "-o $TMPFILE"

#####################################################################################
# Check if the downloaded file is valid
#####################################################################################
if [ ! -e "$TMPFILE" ]; then
  finish_transfer 9018 "Downloaded file does not exist"
  exit 1
fi

if [ -e "/security/hgwcfg/hgwcfg.key" ]; then
  echo "File /security/hgwcfg/hgwcfg.key exists: decrypt the file"
  /bin/usrcrypt dec /security/hgwcfg/hgwcfg.key $TMPFILE > $PERSISTENTTMPFILE
  if [ "$?" -ne "0" ]; then
    finish_transfer 9018 "Could not decrypt file"
    /bin/rm -f $PERSISTENTTMPFILE
    exit 1
  fi
else
  echo "File /security/hgwcfg/hgwcfg.key does not exist: copy the file"
  /bin/cp $TMPFILE $PERSISTENTTMPFILE
fi

CHECK=`/bin/cat $PERSISTENTTMPFILE | /bin/grep "hgwconfig" | /bin/grep "softathome"`
if [ -z "$CHECK" ]; then
  finish_transfer 9018 "hgwcfg_check reported that the file is not valid, no hgwcfg string in this file"
  /bin/rm -f $PERSISTENTTMPFILE
  exit 1
fi

/bin/hgwcfg_check $PERSISTENTTMPFILE
if [ "$?" -ne "0" ]; then
  finish_transfer 9018 "hgwcfg_check reported that the file is not valid"
  /bin/rm -f $PERSISTENTTMPFILE
  exit 1
fi


#####################################################################################
# Copy the new user settings to the real target file
#####################################################################################
/bin/mv $PERSISTENTTMPFILE /etc/config/hgwcfg.usr
/bin/sync

#####################################################################################
# Wait for TR069 to become idle 
#####################################################################################
STATUS=`/bin/pcb_cli "ManagementServer.SessionStatus?" | /bin/grep "ManagementServer.SessionStatus" | /bin/sed s/ManagementServer.SessionStatus=//`
while [ "$STATUS" != "Idle" ]
do
  /bin/sleep 10
  STATUS=`/bin/pcb_cli "ManagementServer.SessionStatus?" | /bin/grep "ManagementServer.SessionStatus" | /bin/sed s/ManagementServer.SessionStatus=//`
done

#####################################################################################
# Disable the deamon to avoid sending the transfercomplete message
#####################################################################################
kill `/bin/cat /var/run/cwmpd.pid`

#####################################################################################
# Update the status
#####################################################################################
finish_transfer 0 ""
/bin/sleep 5 # give some time to Managementserver to store it's values persistently

#####################################################################################
# Trigger the restore
#####################################################################################
/bin/pcb_cli "NMC.restore()"

#####################################################################################
# Sleep for a while. Normally the restore will trigger a reboot
#####################################################################################
/bin/sleep 60

echo "ERROR: The board did not reboot?"

exit 1
