#!/bin/sh


# Parameters provided:
#   $1 is the calling profile alias
#   $2 is the prefix to be used for the generated file name
#
# Possible return values:
#   0: Success
#   1: Error in the collection script
#   501: Collection refused by the collection script: the collection process should abort

PROFILE_ALIAS=$1
PROFILE_FILE_NAME_PREFIX=$2

FIGARO_FILES_TMP_PATH="$(pcb_cli -l Probe.InputLocation?)"
BULKDATA_FILES_TMP_PATH="/tmp/bulkdata_collected_files"

[[ $FIGARO_FILES_TMP_PATH == "" ]]  &&  return 1

mkdir $BULKDATA_FILES_TMP_PATH

# Deleting possibly remaining figaro file
rm ${FIGARO_FILES_TMP_PATH}/*probe_log.txt

# Tell Figaro to set the file ready and wait for the answer (with a 10s timeout anyway) 
# TODO: set the timeout to the timeout defined by the BulkData, when it will be ok.
pcb_cli Probe.Trigger=1
REMAINING_ATTEMPTS=10
while [ pcb_cli -l Probe.Trigger? | grep -qv "0" ]
do
    [[ $REMAINING_ATTEMPTS == "0" ]]  &&  return 1;
    REMAINING_ATTEMPTS=$((REMAINING_ATTEMPTS-1))
    sleep 1
done

OUTPUT_WANTED_FILENAME="$(ls $FIGARO_FILES_TMP_PATH | grep -E probe_log.txt)"
OUTPUT_FILENAME="${PROFILE_FILE_NAME_PREFIX}_${OUTPUT_WANTED_FILENAME}"

[[ "$OUTPUT_WANTED_FILENAME" == "" ]]  &&  return 501

# Deletion of the modules log file
rm "${FIGARO_FILES_TMP_PATH}/probe_module_output.txt"

# Force deletion of any remaining file (should not be here, but you never know...)
rm -f "$BULKDATA_FILES_TMP_PATH/$OUTPUT_FILENAME"

mv ${FIGARO_FILES_TMP_PATH}/${OUTPUT_WANTED_FILENAME} ${BULKDATA_FILES_TMP_PATH}/${OUTPUT_FILENAME}
    
#overriding the BulkData default certificates
mv /var/tmp/figarocertclient.pem /var/tmp/$PROFILE_ALIAS_server.pem 
cp /usr/lib/probe/certs/servfigarowbdvca.pem /var/tmp/$PROFILE_ALIAS_server.pem
