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
CERTFILE="/usr/lib/devicemngt/bulkdata.pem"
DIRNAME="bulkdata_$(pcb_cli -l DeviceInfo.SerialNumber?)_$(date '+%Y-%m-%d-%Hh%Mm%S%z')_$$"
PREFIX="${DIRNAME}/bulkdata"
LOGFILE="${PREFIX}.txt"
ZIPFILE="${PREFIX}.txt.gz"
AESFILE="${PREFIX}.aes"
KEYSIZE=256
KEYFILE="${PREFIX}.key"
RSAFILE="${PREFIX}.rsa"
TARFILE="${PREFIX}.tar"

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

if [ -e "$CERTFILE" ]
then
  #####################################################################################
  # Encrypt
  #####################################################################################
  gzip -c > $ZIPFILE < $LOGFILE
  dd of=$KEYFILE if=/dev/urandom count=1 bs=$(($KEYSIZE >> 3))
  openssl aes-${KEYSIZE}-cbc -out $AESFILE -in $ZIPFILE -pass  file:$KEYFILE -salt
  openssl rsautl -encrypt    -out $RSAFILE -in $KEYFILE -inkey     $CERTFILE -certin
  echo "to decrypt :

  # already done : tar xf bulkdata.tar
  printf 'location of \"Private_Key.pem\" : ' ; read private_key
  openssl rsautl -decrypt -out $KEYFILE -in $RSAFILE -inkey \$private_key
  openssl aes-${KEYSIZE}-cbc -d -out $ZIPFILE -in $AESFILE -pass file:$KEYFILE
  gzip -d > $LOGFILE < $ZIPFILE" > ${DIRNAME}/README.txt
  tar cf $TARFILE $AESFILE $RSAFILE ${DIRNAME}/README.txt
else
  gzip -c > $ZIPFILE < $LOGFILE
  tar cf $TARFILE $ZIPFILE
fi

fn_exists transfer_file_without_finish                                                                                                    
if [ $? -eq 0 ]; then                                                                                                        
  #####################################################################################                                                   
  # Call CURL to perform the upload                                                    
  #####################################################################################
transfer_file_without_finish "--header \"lb_ref: $WAN_ADDR\" --header \"User-Agent: Verbose Log\" --header \"FW_version: $SW_VERSION\" --header \"lb_manufacturer: $MANUFACTURER\" --header \"lb_productclass: $PRODUCT_CLASS\" --header \"lb_serialnumber: $SERIAL_NUMBER\" --upload-file $TARFILE"
  rm -fr $DIRNAME                              
                                                              
  #####################################################################################
  # Update the status                                                               
  #####################################################################################
  finish_transfer $ERRORCODE "$ERRORSTRING"
else                                  
  #####################################################################################
  # Call CURL to perform the upload
  #####################################################################################
  transfer_file "--header \"lb_ref: $WAN_ADDR\" --header \"User-Agent: Verbose Log\" --header \"FW_version: $SW_VERSION\" --header \"lb_manufacturer: $MANUFACTURER\" --header \"lb_productclass: $PRODUCT_CLASS\" --header \"lb_serialnumber: $SERIAL_NUMBER\" --upload-file $TARFILE"
  rm -fr $DIRNAME

  #####################################################################################
  # Update the status
  #####################################################################################
  finish_transfer 0 ""
fi

exit 0
