#!/bin/sh

#FOR NOW, ONLY SUPPORTS THE CSV ENCODING.
#TODO: implement the full possibilities support
#TODO: check the problem that may occur: the expected file does not exists, ...

#Parameters provided:
#   $1 is the calling profile instance key
#   $2 is the prefix to be used for the generated file name 

# Setting the list of parameters to strip, as inputed to sed:
#   Each instance ({i}) should be replaced by a .*
#   The parameters are separated by escaped backslashes
PARAMETERS_TO_STRIP="Device.ManagementServer.Password\|Device.ManagementServer.ConnectionRequestPassword\|Device.ManagementServer.STUNPassword\|Device.LANConfigSecurity\|Device.WiFi.AccessPoint..*.Security.KeyPassphrase\|Device.WiFi.AccessPoint..*.Security.WEPKey\|Device.WiFi.AccessPoint..*.Security.PreSharedKey\|Device.PPP.Interface..*.Password\|Device.Services.VoiceService..*.VoiceProfile..*.SIP.inboundAuthPassword\|Device.Services.VoiceService..*.VoiceProfile..*.H323.AuthPassword\|Device.Services.VoiceService..*.VoiceProfile..*.Line..*.SIP.AuthPassword\|Device.Services.VoiceService..*.VoiceProfile..*.Line..*.SIP.EventSubscribe..*.AuthPassword"


PROFILE_ALIAS=$1
PROFILE_FILE_NAME_PREFIX=$2

BULKDATA_FILES_TMP_PATH="/tmp/bulkdata_collected_files"
OUTPUT_FILENAME=$(ls $BULKDATA_FILES_TMP_PATH | grep $PROFILE_FILE_NAME_PREFIX)

PROFILE_PREFIX="BulkData.Profile.[Alias=$PROFILE_ALIAS]"

ENCODING_TYPE=$(pcb_cli -l $PROFILE_PREFIX.EncodingType?)


if [ "$ENCODING_TYPE" == "CSV" ]
then
    SEPARATOR=$(pcb_cli -l $PROFILE_PREFIX.CSVEncoding.FieldSeparator?)
    
    sed -i "s/\(.*\)$SEPARATOR\($PARAMETERS_TO_STRIP\)$SEPARATOR.*/\1$SEPARATOR\2$SEPARATOR/" "${BULKDATA_FILES_TMP_PATH}/${OUTPUT_FILENAME}"
fi
