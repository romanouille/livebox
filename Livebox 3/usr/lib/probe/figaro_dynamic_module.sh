#!/bin/sh

url=$1
name=$(basename "$url" ".so")".so"
/usr/bin/curl -o /ext/figaro/$name $url
chmod 777 /ext/figaro/$name
pcb_cli "Process.sysbus_probe_client.loadSharedObject(/ext/figaro/"$name")"  




