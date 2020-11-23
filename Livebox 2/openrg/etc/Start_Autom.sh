#! /bin/sh
echo "Lancement manuel des TRxxx"
/bin/killall main_autom
/bin/killall tr69 tr98 tr111 tr104_sip tr104_h323
/bin/main_autom /etc/process_list.dat 1 1 &

