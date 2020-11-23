#! /bin/ash



test -r /etc/profile && . /etc/profile 

exec /usr/bin/clish -x /etc/remotessh/  "$@" 

