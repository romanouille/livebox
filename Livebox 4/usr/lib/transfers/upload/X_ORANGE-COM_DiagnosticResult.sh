#!/bin/sh

#####################################################################################
# INFO
#####################################################################################
#
# This script uploads Diagnosis report files
#
# USED ERROR CODES:
#  0:    no error
#  9002: Internal error (here no report available)
#
#####################################################################################

source /usr/lib/transfers/transfer_functions.sh

#####################################################################################
# Env. stuff
#####################################################################################
SERIAL_NUMBER="UNKNOWN"
PRODUCT_CLASS="UNKNOWN"
WAN_ADDR="00:01:02:03:04:05"
MANUFACTURER_OUI="UNKNOWN"

if [ -f /etc/environment ]; then
  source /etc/environment
fi

#####################################################################################
# Defaults
#####################################################################################

REPORT_PATH="/ext/autodiag/"
CACERT_FILE="/usr/lib/cwmp/cwmpdcerts.pem"

#####################################################################################
# Command line argument parsing
#####################################################################################
parse_command_line $*

#####################################################################################
# Call CURL to perform the upload
#####################################################################################
REPORT_NAME=`ls $REPORT_PATH`
if [ -z "$REPORT_NAME" ]
then
    finish_transfer 9002 "No report in flash"
    exit 1
fi

REPORT_FILE="$REPORT_PATH$REPORT_NAME"

ORIGIN=`cat $REPORT_FILE | grep scriptTrigger| cut -d '"' -f 2`
TYPETEST=`cat $REPORT_FILE | grep scriptID | cut -d '"' -f 2`

transfer_file "--header \"X-DM-OrangeTrackingHeaderVersion: 1.0\" --header \"X-DM-MAC: $WAN_ADDR\" --header \"X-DM-OUI: $MANUFACTURER_OUI\" --header \"X-DM-ProductClass: $PRODUCT_CLASS\" --header \"X-DM-SerialNumber: $SERIAL_NUMBER\" --header \"X-DM-Autodiag-Origin: $ORIGIN\" --header \"X-DM-Autodiag-TypeTest: $TYPETEST\" --cacert $CACERT_FILE --upload-file $REPORT_FILE"

#####################################################################################
# Update the status
#####################################################################################
finish_transfer 0 ""

exit 0
