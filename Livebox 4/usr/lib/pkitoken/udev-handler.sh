#!/bin/sh

  ACTION=
  DEVICE=

# logger -t pkitoken -p daemon.warning "$*"

  while [ ! -z $1 ]
  do

    case "$1" in
    
      "--action")
        shift
        ACTION=$1
#       logger -t pkitoken -p daemon.warning ACTION=$ACTION
        ;;

      "--device")
        shift
        DEVICE=$1
#       logger -t pkitoken -p daemon.warning DEVICE=$DEVICE
        ;;

    esac

    shift

  done

  case "$ACTION" in

    "add")
      if [ ! -z $DEVICE ] && [ "$DEVICE" != ":" ]
      then
        logger -t pkitoken -p daemon.warning "Attempt to start plugin \"pkitoken\"."
        /etc/init.d/pkitoken_plugin start
      fi
      ;;

    "remove")
      logger -t pkitoken -p daemon.warning "Attempt to stop plugin \"pkitoken\"."
      /etc/init.d/pkitoken_plugin stop
      ;;
  
  esac

