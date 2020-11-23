#! /bin/sh
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
# Copyright : (c) 2008 SAGEM SA - Site Velizy - URD2
#
# The information and source code contained herein is the exclusive
# property of SAGEM and may not be disclosed, examined, or
# reproduced in whole or in part without explicit written authorization
# of the company.
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
#
# File : Makefile                                                          
#                                                                        
# $Id:$                                                                  
#                                                                        
# Description : Script that permit to check if all trs are launched
#            
# History
#
# 01 OCT 2009 : H.FAD
# 		- BC_23327 : File creation
#
#~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

# usage :  check_tr_process <log_file> <output_file>

PS_LIST=/tmp/psList.txt

# 
ps > $PS_LIST
#
grep tr69 $PS_LIST && grep tr98 $PS_LIST && grep tr111 $PS_LIST && grep tr104 $PS_LIST
#  
if [ $? -eq 0 ] 
then
	echo "`date` : all trs are launched. Nothing to do" >> $1
	echo "0" > $2
else
	echo "`date` : tr lost. set -1 into $2 file to force restart TRs" >> $1
	echo "-1" > $2
fi
#
rm -f $TMP_LIST $PS_LIST 

