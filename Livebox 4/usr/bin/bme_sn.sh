#!/bin/sh

if [ "$#" -lt 1 ]
then
    echo "$0 : missing mandatory argument"
else
    SOFT_VERSION=`grep -i '^SoftwareVersion=' /var/etc/build`
    BME_SN_TMP="$SERIAL_NUMBER $1 ${SOFT_VERSION#*=}"
    BME_SN=`bme_sn "$BME_SN_TMP" 2>/dev/null`

    echo "_BOARD_SERIAL_NBR=\"$BME_SN"\" >> /var/etc/environment  # for old xDSL implementation
    echo "BOARD_SERIAL_NBR=\"$BME_SN"\" >> /var/etc/environment   # for new xDSL plugin
fi
