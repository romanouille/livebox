#!/bin/sh

#####################################################################################
# INFO
#####################################################################################
#
# This script uploads the Debug Information for a server FTPS. 
# This script is also responsible for updating the QueuedTransfer status.
# 
# STEPS:
# - Generate the log file via pcb_cli
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
fn_exists()
{
    type $1 2>/dev/null | grep -q 'function'
}

source /usr/lib/transfers/transfer_functions.sh

SERIAL_NUMBER="UNKOWN"
PRODUCT_CLASS="UNKNOWN"
WAN_ADDR="00:01:02:03:04:05"
MANUFACTURER="UNKNOWN"
SW_VERSION="$(pcb_cli -l DeviceInfo.SoftwareVersion?)"

if [ -f /etc/environment ]; then
  source /etc/environment
fi

#####################################################################################
# Defaults
#####################################################################################

DIRNAME="$(pcb_cli -l Devices.Device.lan.PhysAddress?|cut -d '=' -f 2|tr -d ':')_$(date '+%Y%m%d')"
LOGFILE="${DIRNAME}/${DIRNAME}.log"

#####################################################################################
# Command line argument parsing
#####################################################################################
parse_command_line $*

#####################################################################################
# Trigger the backup
#####################################################################################
cd /tmp/
mkdir -p $DIRNAME
/bin/getDebugInformation -p $LOGFILE


fn_exists transfer_file_without_finish                                                                                                    
if [ $? -eq 0 ]; then                                                                                                        
  #####################################################################################                                                   
  # Call CURL to perform the upload                                                    
  #####################################################################################

  logger -t pushlogs "Call transfer_file_without_finish to perform the upload "	   	

  transfer_file_without_finish "--header \"lb_ref: $WAN_ADDR\" --header \"User-Agent: Verbose Log\" --header \"FW_version: $SW_VERSION\" --header \"lb_manufacturer: $MANUFACTURER\" --header \"lb_productclass: $PRODUCT_CLASS\" --header \"lb_serialnumber: $SERIAL_NUMBER\" --ftp-ssl --upload-file $LOGFILE"

  rm -fr $DIRNAME                              
                                                              
  #####################################################################################
  # Update the status                                                               
  #####################################################################################
  finish_transfer $ERRORCODE "$ERRORSTRING"
else                                  
  #####################################################################################
  # Call CURL to perform the upload                                      
  #####################################################################################
  logger -t pushlogs "Call transfer_file to perform the upload "

  transfer_file "--header \"lb_ref: $WAN_ADDR\" --header \"User-Agent: Verbose Log\" --header \"FW_version: $SW_VERSION\" --header \"lb_manufacturer: $MANUFACTURER\" --header \"lb_productclass: $PRODUCT_CLASS\" --header \"lb_serialnumber: $SERIAL_NUMBER\" --ftp-ssl --upload-file $LOGFILE"

  rm -fr $DIRNAME                                        
    
  #####################################################################################
  # Update the status     
  #####################################################################################
  finish_transfer 0 ""
fi   

exit 0
