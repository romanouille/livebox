#!/bin/sh

export PATH=/bin

mkdir -p /var/lock/racoon.sh

mypid=$$

echo $mypid > /var/lock/racoon.sh/$mypid

locked=1
i=0
oldpid=0

(
while [ $locked = 1 ]
do
    set `ls -cr /var/lock/racoon.sh`
    if [ $1 = $mypid ]
    then locked=0
    elif [ $1 != $oldpid ]
    then oldpid=$1
         i=0
         sleep 1
    elif [ $i = 45 ]
    then  rm /var/lock/racoon.sh/$1
    else sleep 1
         i=$((i+1))
    fi
done
)

killall racoon

if killall -0 racoon
then sleep 2
     killall racoon
     killall -9 racoon
fi

mkdir -p /etc/racoon

cd /etc/racoon || exit 1

rm -f psk.txt racoon.conf setkey.conf

(
echo start ipsec_gen_conf
/sbin/ipsec_gen_conf || ( echo "error running ipsec_gen_conf" ; rm -f psk.txt racoon.conf setkey.conf )
echo stop ipsec_gen_conf

if [ -e "setkey.conf" -a -s "setkey.conf" -a  -e "racoon.conf" -a -s "racoon.conf" -a -e "psk.txt" -a -s "psk.txt" ]
then

    echo start setkey
    while true
    do /sbin/setkey -f /etc/racoon/setkey.conf
      e=$?
      if [ _$e = _139 ]
      then echo "$0: setkey did segfault"
      elif [ _$e != _0 ]
      then rm /var/lock/racoon.sh/$mypid
	  exit 1
      else break
      fi
    done
    echo stop setkey

    chmod 600 /etc/racoon/psk.txt

    echo start racoon
    /sbin/racoon -v -f /etc/racoon/racoon.conf -l /dev/console
    echo racoon is launched

else

    echo "No VPN is activated."

    echo 'flush;' > /etc/racoon/setkey.conf
    echo 'spdflush;' >> /etc/racoon/setkey.conf

    echo start setkey
    while true
    do /sbin/setkey -f /etc/racoon/setkey.conf
      e=$?
      if [ _$e = _139 ]
      then echo "$0: setkey did segfault"
      elif [ _$e != _0 ]
      then rm /var/lock/racoon.sh/$mypid
	  exit 1
      else break
      fi
    done
    echo stop setkey

fi

rm /var/lock/racoon.sh/$mypid

) > /dev/ttyS0 2>&1 &
