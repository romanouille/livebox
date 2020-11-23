#!/bin/sh
POSTPROCESSLOCATION="/usr/lib/storage/mount/"
POSTPROCESS="$POSTPROCESSLOCATION/*.sh"
if [ -d $POSTPROCESSLOCATION ]; then
    for each in $POSTPROCESS; do sh $each "$1" "$2" "$3" "$4"; done;
fi

