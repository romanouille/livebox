#!/bin/sh

rm -f /cfg/formatted
rm -f /ext/formatted
sync

echo "User partition will be formatted during next system restart."
echo "Please reboot the device to complete."
