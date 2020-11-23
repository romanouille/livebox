#!/bin/sh
 
chmod 777 "/usr/lib/probe/figaro_wifi.sh"
 
if [ -d "/usr/lib/probe/vendor/" ]; then
    cd "/usr/lib/probe/vendor/"
    for script in *; do
        "./${script}"
    done
fi

exit 0;
