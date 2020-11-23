#!/bin/sh

#FOR NOW, ONLY SUPPORTS THE CSV ENCODING, WITH THE DEFAULT PARAMETERS.
#TODO: implement the full possibilities support
#TODO: set the user of the specific pcb_cli commands to cwmpd

#Parameters provided:
#   $1 is the calling profile alias
#   $2 is the prefix to be used for the generated file name
#
#File to be generated:
#   ${PROFILE_FILE_NAME_PREFIX}_${PROFILE_FILE_NAME_PREFIX}
#
#Possible return values:
#   0: Success
#   501: Collection refused by the collection script: the collection process should abort

PROFILE_ALIAS=$1
PROFILE_FILE_NAME_PREFIX=$2

OUTPUT_FILENAME="${PROFILE_FILE_NAME_PREFIX}_${PROFILE_FILE_NAME_PREFIX}"
BULKDATA_FILES_TMP_PATH="/tmp/bulkdata_collected_files"
mkdir $BULKDATA_FILES_TMP_PATH

#Force deletion of any remaining file (should not be here, but you never know...)
rm -f "$BULKDATA_FILES_TMP_PATH/$OUTPUT_FILENAME"

PROFILE_PREFIX="BulkData.Profile.[Alias=$PROFILE_ALIAS]"

if [ $(pcb_cli -l $PROFILE_PREFIX.ExportType?) == "onevent" ]
then
    path=$(pcb_cli -l $PROFILE_PREFIX.Event.DeliveredEvents.PathParameter?)
    triggeringValue="$(pcb_cli -l $PROFILE_PREFIX.Event.DeliveredEvents.TriggeringValue?)"
    [[ "$triggeringValue" == "" ]]  &&  return 501
    pcb_cli -l $path? | grep -vq "$triggeringValue"  && return 501
fi

ENCODING_TYPE=$(pcb_cli -l $PROFILE_PREFIX.EncodingType?)

if [ "$ENCODING_TYPE" == "CSV" ]
then
    OUTPUT_FILENAME="$OUTPUT_FILENAME.csv"
    echo -n "" > $BULKDATA_FILES_TMP_PATH/$OUTPUT_FILENAME.tmp
    
    FIELD_SEPARATOR=$(pcb_cli -l $PROFILE_PREFIX.CSVEncoding.FieldSeparator?)
    ROW_SEPARATOR=$(pcb_cli -l $PROFILE_PREFIX.CSVEncoding.RowSeparator?)
    ESCAPE_CHARACTER=$(pcb_cli -l $PROFILE_PREFIX.CSVEncoding.EscapeCharacter?)
    REPORT_FORMAT=$(pcb_cli -l $PROFILE_PREFIX.CSVEncoding.ReportFormat?)
    ROW_TIMESTAMP=$(pcb_cli -l $PROFILE_PREFIX.CSVEncoding.RowTimestamp?)
    
#Escaping the escape character and , in case it's a special (problematic) value.
    echo "$ESCAPE_CHARACTER" | grep -q "^[][\"'\^$\}{;:.\`\!]"  &&  ESCAPE_CHARACTER="\\$ESCAPE_CHARACTER"
    echo "$FIELD_SEPARATOR" | grep -q "^[][\"'\^$\}{;:.\`\!]"  &&  FIELD_SEPARATOR="\\$FIELD_SEPARATOR"

#Defining the timestamp value, according to the wanted format in the profile.
#TODO: Check the case the time could not be acquired, according to the internal specs.
    if [ $ROW_TIMESTAMP == "Unix-Epoch" ]
    then
        TIMESTAMP_MARK="$(date -u +%s)$FIELD_SEPARATOR"
    elif [ $ROW_TIMESTAMP == "ISO-8601" ]
    then
        TIMESTAMP_MARK=$(date -Iseconds -u | sed "s/UTC//")
        echo "$(pcb_cli -l Time.CurrentTime?)" | grep -q "Z"  &&  TIMESTAMP_MARK="${TIMESTAMP_MARK}Z"  #Adding the Z if needed
        TIMESTAMP_MARK="$TIMESTAMP_MARK$FIELD_SEPARATOR"
    else
        TIMESTAMP_MARK=""
    fi
    
#TODO: check the header is ok: the name are to be approved 
#Adding the columns header
    [[ $TIMESTAMP_MARK != "" ]]  &&  echo -n "Timestamp$FIELD_SEPARATOR" >> $BULKDATA_FILES_TMP_PATH/$OUTPUT_FILENAME.tmp
    echo "Name${FIELD_SEPARATOR}Value" >> $BULKDATA_FILES_TMP_PATH/$OUTPUT_FILENAME.tmp

#Adding the values in the file, while formatting it.
    /bin/pcb_cli "Device.?" | \
    grep = | \
    sed "s/$FIELD_SEPARATOR/$ESCAPE_CHARACTER$FIELD_SEPARATOR/g" | \
    sed "s/=/$FIELD_SEPARATOR/" | \
    sed "s/^/$TIMESTAMP_MARK/" | \
    tr "\n" "$ROW_SEPARATOR" >> ${BULKDATA_FILES_TMP_PATH}/${OUTPUT_FILENAME}.tmp
    
fi

mv ${BULKDATA_FILES_TMP_PATH}/${OUTPUT_FILENAME}.tmp ${BULKDATA_FILES_TMP_PATH}/${OUTPUT_FILENAME}