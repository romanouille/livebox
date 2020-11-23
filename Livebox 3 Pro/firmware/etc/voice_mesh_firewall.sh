#!/bin/sh                                                                     
#=============================================================================  
# Copyright : (c) 2010 SAGEMCOM - Site Rueil-Malmaison - ATR-URD2
# The information and source code contained herein is the exclusive
# property of SAGEMCOM and may not be discled, or
# reproduced in whole or in part without explicit written au.                              
#=============================================================================
  
if [ ! -f /tmp/.voicemeshfirewall ]
then
   firewall-cli add outgoing -x IP_BR_LAN --protocol udp --source-port 9246 --destination-port 9246 --creator voiceManager --target accept
   firewall-cli add ingoing -x IP_BR_LAN --protocol tcp --destination-port 9246 --creator voiceManager --target accept
   firewall-cli add outgoing -x IP_BR_LAN --protocol tcp --destination-port 9246 --creator voiceManager --target accept
 
   touch /tmp/.voicemeshfirewall   
   
fi
