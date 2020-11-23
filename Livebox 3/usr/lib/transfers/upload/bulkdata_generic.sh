#!/bin/sh


#####################################################################################
# INFO
#####################################################################################
#
# This script does NOT delete the input log file (i.e. previously constructed by the 
# probe and moved by the BulkData. This operation is done by the C code, not to block
# the possibility to retry the sending process.
# The output file (the one provided to curl) IS deleted.
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


BULKDATA_FILES_TMP_PATH="/tmp/bulkdata_collected_files"

getHeaders() {
    local http_headers=""
    local profile_prefix=$1
    local profile_protocol=$2
    
    local temp_http_header=""
    local temp_http_header_dataType=""
    local temp_http_header_name=""
    local temp_http_header_data=""
    local current_parameter="DataType"
    for parameter in $(pcb_cli -l $profile_prefix.$profile_protocol.HeaderField.?)
    do
        if [ "$current_parameter" == "DataType" ]
        then
            temp_http_header_dataType=$parameter
            current_parameter="Name"
        elif [ "$current_parameter" == "Name" ]
        then
            temp_http_header_name=$parameter
            current_parameter="Data"
        elif [ "$current_parameter" == "Data" ]
        then
            temp_http_header_data=$parameter
            current_parameter="DataType"
            
            
            [[ "$temp_http_header_data" == "" ]]  &&  continue
            temp_http_header="--header \""
            [[ "$temp_http_header_name" != "" ]]  &&  temp_http_header="$temp_http_header$temp_http_header_name: "  ||  temp_http_header="$temp_http_header$temp_http_header_data: "
            if [ "$temp_http_header_dataType" == "Value" ]
            then
                temp_http_header="$temp_http_header$temp_http_header_data\""
            else
                local temp_data=$(pcb_cli -le $temp_http_header_data?)
                [[ "$?" == 0 ]]  &&  temp_http_header="$temp_http_header$temp_data\""  ||  continue
            fi
            http_headers="$http_headers $temp_http_header"
        fi
    done
    
    echo "$http_headers"
}



#TODO: check the return value of all the pcb_cli requests


fn_exists()
{
    type $1 2>/dev/null | grep -q 'function'
}

source /usr/lib/transfers/transfer_functions.sh

if [ -f /etc/environment ]; then
  source /etc/environment
fi

#####################################################################################
# Defaults
#####################################################################################

# Command line argument parsing
#####################################################################################
parse_command_line $*
PROFILE_ALIAS=$(pcb_cli -l $PCBPATH.Initiator?)
PROFILE_PREFIX="BulkData.Profile.[Alias=$PROFILE_ALIAS]"
#Here I suppose ther could be only one file per profile in the tmp. Could not be the case when adding a feature of file retention when unsuccessful (see tr181)
INPUT_FILE_NAME=$(ls $BULKDATA_FILES_TMP_PATH | grep $PROFILE_ALIAS)
OUTPUT_FILE_NAME=$(echo $INPUT_FILE_NAME | sed "s/.*${PROFILE_ALIAS}_//")
#####################################################################################
# Gathering data from the profile
#####################################################################################

# Most of the data gathered depends on the fact that the protocol stuff is stored 
# under the eponymous object: Profile.SomeProfileName.HTTP. for HTTP protocol. 

################ Profile dependant stuff ################

#The protocol
PROTOCOL=$(pcb_cli -l $PROFILE_PREFIX.Protocol.?)
#The URL
URL=$(pcb_cli -l $PROFILE_PREFIX.$PROTOCOL.URL?)
#The compression
COMPRESSION=$(pcb_cli -l $PROFILE_PREFIX.$PROTOCOL.Compression?)


################ Protocol dependant stuff ################
PROTOCOL_OPTIONS=""
#The header fields
HEADERS=$(getHeaders $PROFILE_PREFIX $PROTOCOL)
    
if [ "$PROTOCOL" == "HTTP" ]
then
    DATE=$(date -u +"%a, %d %b %Y %H:%M:%S GMT")
    [[ "$(pcb_cli -l $PROFILE_PREFIX.$PROTOCOL.UseDateHeader?)" == "1" ]]  &&  HEADERS="$HEADERS --header \"Date: $DATE\""
    
    #The certification stuff
    CERTIFICATION_OPTIONS=""
    if echo "$URL" | grep -q ^https
    then
        CLIENT_CERT_FILE="/var/tmp/${PROFILE_ALIAS}_client.pem"
        SERVER_CERT_FILE="/var/tmp/${PROFILE_ALIAS}_server.pem"
        ls "$CLIENT_CERT_FILE"  &&  CERTIFICATION_OPTIONS="$CERTIFICATION_OPTIONS --cert $CLIENT_CERT_FILE"
        ls "$SERVER_CERT_FILE"  &&  CERTIFICATION_OPTIONS="$CERTIFICATION_OPTIONS --cacert $SERVER_CERT_FILE"
    else
        CERTIFICATION_OPTIONS="$CERTIFICATION_OPTIONS -k"
    fi
elif [ "$PROTOCOL" == "FTP" ]
then
    PROTOCOL_OPTIONS="--ftp-ssl"
fi

#####################################################################################
# Compression step
#####################################################################################

# Do not change this cp in a mv: see the info part
cp "$BULKDATA_FILES_TMP_PATH/$INPUT_FILE_NAME" "$BULKDATA_FILES_TMP_PATH/$OUTPUT_FILE_NAME"
if [ "$COMPRESSION" == "GZIP" ]
then
    gzip -9 "$BULKDATA_FILES_TMP_PATH/$OUTPUT_FILE_NAME"
fi

FILE_TO_UPLOAD="$(/bin/ls $BULKDATA_FILES_TMP_PATH/* | grep $OUTPUT_FILE_NAME | grep -v $INPUT_FILE_NAME)"


#####################################################################################
# cURL options step
#####################################################################################

ADDITIONAL_CURL_OPTIONS=""

ADDITIONAL_CURL_OPTIONS="$ADDITIONAL_CURL_OPTIONS $CERTIFICATION_OPTIONS"

ADDITIONAL_CURL_OPTIONS="$ADDITIONAL_CURL_OPTIONS --header \"Content-Digest: SHA1=$(/usr/bin/sha1sum $FILE_TO_UPLOAD | cut -d" " -f1)\""

ADDITIONAL_CURL_OPTIONS="$ADDITIONAL_CURL_OPTIONS $PROTOCOL_OPTIONS"

#  #####################################################################################                                                   
#  # Call CURL to perform the upload                                                    
#  #####################################################################################
if [ "$(pcb_cli -l $PROFILE_PREFIX.Status?)" == "Working" ]
then 
    transfer_file_without_finish "--verbose -m 10 $ADDITIONAL_CURL_OPTIONS $HEADERS --upload-file $FILE_TO_UPLOAD"
    finish_transfer $ERRORCODE "$ERRORSTRING"
fi

rm -f $FILE_TO_UPLOAD
