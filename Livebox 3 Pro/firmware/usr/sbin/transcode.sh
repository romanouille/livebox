#!/bin/sh -e

if [ $5 = "VM" ] ; then
    
    mkdir -p `dirname $3`
fi

if [ $1 = "-mIvr" ] ; then
    
    mv "$2" "$3/$4"
fi

if [ $1 = "-tIvr" ] ; then
    
    echo "start sox"> /tmp/log_trancodage
    nice -n 20 sox "$2" -c 1 -r 8000 -b 16 -e signed /tmp/file_tmp.raw trim 0 120
    rm "$2"

    extevt SET $5 0.8

    echo "sox end">> /tmp/log_trancodage

    echo "encoder start">> /tmp/log_trancodage

    nice -n 20 g729enc /tmp/file_tmp.raw /tmp/file_tmp.g729 0

    extevt SET $5 0.95

    rm /tmp/file_tmp.raw

    mv /tmp/file_tmp.g729 "$3/$4"

    echo "encoder end">> /tmp/log_trancodage
fi

if [ $1 = "-m" ] ; then
    echo "start move" > /tmp/log_trancodage
    
    mv "$2" $3

    echo "end move">> /tmp/log_trancodage

elif [ $1 = "-t" ] ; then

    echo "start sox"> /tmp/log_trancodage
    
    nice -n 20 sox "$2" -c 1 -r 8000 -b 16 -e signed /tmp/file_tmp.raw trim 0 120
    rm "$2"

    extevt SET $4 0.8

    echo "sox end">> /tmp/log_trancodage

    echo "encoder start">> /tmp/log_trancodage

    nice -n 20 g729enc /tmp/file_tmp.raw /tmp/file_tmp.g729 0

    extevt SET $4 0.95

    rm /tmp/file_tmp.raw

    mv /tmp/file_tmp.g729 $3

    echo "encoder end">> /tmp/log_trancodage

fi


if [ $1 = "-mIvr" ] || [ $1 = "-tIvr" ] ; then

    extevt SET $5 1

elif [ $1 = "-m" ] || [ $1 = "-t" ] ; then

    extevt SET $4 1

fi



