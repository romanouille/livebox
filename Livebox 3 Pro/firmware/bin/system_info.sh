#!/bin/sh

show.sh
echo ""
echo "--------------------"
echo " RAM used/available"
echo "--------------------"
cat /proc/meminfo | grep -e MemTotal -e MemFree:
echo ""
echo "--------------------"
echo "   partition usage"
echo "--------------------"
df
echo ""
echo "--------------------"
echo "     CPU load"
echo "--------------------"
top -n1 | grep CPU:
echo ""
echo "--------------------"
echo "     Up Time"
echo "--------------------"
uptime | sed -e 's/.*up//' -e 's/load.*//' | tr -d ','
echo ""
echo "--------------------"
echo "  Last Reboot date"
echo "--------------------"
date -d @`cat /proc/stat| grep btime|cut -d' ' -f2`
echo ""
echo ""
