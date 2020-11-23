#!/bin/sh

# this script sends a daily report at a fixed time
# the email contains the getDebugInfo (and other useful data)

DEBUG_FILE="/tmp/debug.txt"
MAIL_BODY="/tmp/daily.mail"

generate_report()
{
    # report firmware information
    grep BUILD /web/version.txt >> $MAIL_BODY

    # report system uptime
    echo "" >> $MAIL_BODY
    echo "Status:`uptime`" >> $MAIL_BODY

    # add debug info
    getDebugInformation
    echo "" >> $MAIL_BODY
    sed -e 's/\(tns:.*Password>\).*</\1###HIDDEN###</' -e 's/\(tns:.*SecurityKey>\).*</\1###HIDDEN###</' $DEBUG_FILE >> $MAIL_BODY
}

generate_report
pcb_cli -q "DeviceManagement.Email.send(\"Daily report\", \"$MAIL_BODY\")"
