#!/bin/sh

hgwcfg.sh backup
hgwcfg.sh restore

echo "User settings will be restored after flashing a new image."
echo "Please reboot into the bootloader and flash the new image to complete."



