#!/bin/sh

#=============================================================================
# Copyright : (c) 2010 SAGEMCOM - Site Rueil-Malmaison - ATR-URD2
# The information and source code contained herein is the exclusive
# property of SAGEMCOM and may not be disclosed, examined, or
# reproduced in whole or in part without explicit written authorization
# of the company.
#=============================================================================

# Print on syslog
log()
{
    logger -t '[MESH-SCRIPT] conf_files_initialization.sh' $1
}



# fichier de conf au demarrage
. /etc/config_init_mesh.txt
# emplacements de fichiers
. /etc/config_pairing.txt

#chown root /root/
mkdir /var/empty
chown root /var/empty

mesh_state=$1

if [ "$mesh_state" = "GWC" ]
then
    log "Box is GWC !"

else if [ "$mesh_state" = "AP" ]
then
    log "Box is AP !"
else
    log "Box is GW !"
fi
fi



