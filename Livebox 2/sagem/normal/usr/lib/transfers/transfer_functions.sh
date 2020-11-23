#!/bin/sh

#####################################################################################
# INFO
#####################################################################################
#
# This script contains some usefull functions that can be used to write transfer scripts.
# 
# Available functions:
# - parse_command_line
#
#
# POSSIBLE ERROR CODES:
#  0:    no error
#  9001: Request denied  
#  9002: Internal error 
#  9010: Download failure (associated with Download, TransferComplete or AutonomousTransferComplete methods). 
#  9011: Upload failure (associated with Upload, TransferComplete or AutonomousTransferComplete methods). 
#  9012: File transfer server authentication failure (associated with Upload, Download, TransferComplete or AutonomousTransferComplete methods). 
#  9014: Download failure: unable to join multicast group (associated with Download, TransferComplete or AutonomousTransferComplete methods). 
#  9015: Download failure: unable to contact file server (associated with Download, TransferComplete or AutonomousTransferComplete methods). 
#  9016: Download failure: unable to access file (associated with Download, TransferComplete or AutonomousTransferComplete methods). 
#  9017: Download failure: unable to complete download (associated with Download, TransferComplete or AutonomousTransferComplete methods). 
#  9018: Download failure: file corrupted (associated with Download, TransferComplete or AutonomousTransferComplete methods). 
#  9019: Download failure: file authentication failure (associated with Download, TransferComplete or AutonomousTransferComplete methods). 
#  
#####################################################################################

#####################################################################################
# Finish the transfer
#  First argument: error code
#  Second argument: error string
#####################################################################################
finish_transfer ()
{
  echo $2
  /bin/pcb_cli "$PCBPATH.Finish($1,\"$2\")"
}

#####################################################################################
# Command line argument parsing
#####################################################################################
parse_command_line ()
{ 
  PCBPATH=""
  CONFIGPATH=""
  CAPATH=""
  for i in $*
  do
	case $i in
    	--path=*)
		PCBPATH=`echo ${i:7}`		
		;;
	--configpath=*)
		CONFIGPATH=`echo ${i:13}`
		;;
    	*)
		echo "   --path=[PCBPATH]"
		echo "   --configpath=[CONFIGPATH]"
		;;
  	esac
  done

  echo "PCBPATH=$PCBPATH"
  echo "CONFIGPATH=$CONFIGPATH"

  if [ ! -n "$PCBPATH" ]; then
    echo "Not a valid path"
    exit
  fi

  if [ ! -f "$CONFIGPATH" ]; then
    echo "Not a valid config path"
    exit
  fi
  cat $CONFIGPATH
}

#####################################################################################
# Perform transfer
# First must contain the curl transfer options
#####################################################################################
transfer_file_without_finish ()
{ 
  SSL=""

  if [ -n "$CAPATH" ]; then
    SSL="--capath $CAPATH"
  else
    SSL="--insecure"    
  fi

  # the first -o or --output flag has priority
  RESPONSE=$(eval /usr/bin/curl --config $CONFIGPATH $1 --output /dev/null $SSL)
  CURLERROR=$?
  
  ERRORSTRING=""
  ERRORCODE="0"
  DEFAULT_ERROR_CODE=9010
  case "$1" in 
    *--upload-file*)
      DEFAULT_ERROR_CODE=9011
      ;;
  esac

  case "$CURLERROR" in
	1) 
		ERRORSTRING="Unsupported protocol. This build of curl has no support for this protocol."
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	2) 
		ERRORSTRING="Failed to initialize. "
		ERRORCODE="9002"
		;;		
	3) 
		ERRORSTRING="URL malformed. The syntax was not correct."
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	5) 
		ERRORSTRING="Couldn't resolve proxy. The given proxy host could not be resolved. "
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	6) 
		ERRORSTRING="Couldn't resolve host. The given remote host was not resolved. "
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	7) 	
		ERRORSTRING="Failed to connect to host. "
		ERRORCODE="9015"
		;;		
	8) 
		ERRORSTRING="FTP weird server reply. The server sent data curl couldn't parse. "
		ERRORCODE="9017"
		;;		
	9) 
		ERRORSTRING="FTP access denied. The server denied login or denied access to the particular resource or directory you wanted to reach. Most often you tried to change to a directory that doesn't exist on the server. "
		ERRORCODE="9012"
		;;		
	11) 
		ERRORSTRING="FTP weird PASS reply. Curl couldn't parse the reply sent to the PASS request. "
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	13) 
		ERRORSTRING="FTP weird PASV reply, Curl couldn't parse the reply sent to the PASV request. "
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	14) 
		ERRORSTRING="FTP weird 227 format. Curl couldn't parse the 227-line the server sent. "
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	15) 
		ERRORSTRING="FTP can't get host. Couldn't resolve the host IP we got in the 227-line. "
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	17) 
		ERRORSTRING="FTP couldn't set binary. Couldn't change transfer method to binary. "
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	18) 
		ERRORSTRING="Partial file. Only a part of the file was transferred. "
		ERRORCODE="9017"
		;;		
	19) 
		ERRORSTRING="FTP couldn't download/access the given file, the RETR (or similar) command failed. "
		ERRORCODE="9016"
		;;		
	21) 
		ERRORSTRING="FTP quote error. A quote command returned error from the server. "
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	22) 
		case "$RESPONSE" in
		204)
			ERRORSTRING="HTTP page not retrieved. The requested url was not found or returned another error with the HTTP error code being 400 or above. This return code only appears if -f/--fail is used.   204 - No Content"
			ERRORCODE="9016"
			;;
		400)
			ERRORSTRING="HTTP page not retrieved. The requested url was not found or returned another error with the HTTP error code being 400 or above. This return code only appears if -f/--fail is used.   400 - Bad request"
			ERRORCODE="9010"
			;;
		401)
			ERRORSTRING="HTTP page not retrieved. The requested url was not found or returned another error with the HTTP error code being 400 or above. This return code only appears if -f/--fail is used.   401 - Unauthorized"
			ERRORCODE="9012"
			;;
		403)
			ERRORSTRING="HTTP page not retrieved. The requested url was not found or returned another error with the HTTP error code being 400 or above. This return code only appears if -f/--fail is used.   403 - Forbidden"
			ERRORCODE="9016"
			;;
		404)
			ERRORSTRING="HTTP page not retrieved. The requested url was not found or returned another error with the HTTP error code being 400 or above. This return code only appears if -f/--fail is used.   404 - Not found"
			ERRORCODE="9016"
			;;
		*)	
			ERRORSTRING="HTTP page not retrieved. The requested url was not found or returned another error with the HTTP error code being 400 or above. This return code only appears if -f/--fail is used. "
			ERRORCODE="$DEFAULT_ERROR_CODE"
			;;
		esac	
		;;		
	23) 
		ERRORSTRING="Write error. Curl couldn't write data to a local filesystem or similar. "
		ERRORCODE="9002"
		;;		
	25) 
		ERRORSTRING="FTP couldn't STOR file. The server denied the STOR operation, used for FTP uploading. "
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	26) 
		ERRORSTRING="Read error. Various reading problems. "
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	27) 
		ERRORSTRING="Out of memory. A memory allocation request failed. "
		ERRORCODE="9002"
		;;		
	28) 
		ERRORSTRING="Operation timeout. The specified time-out period was reached according to the conditions. "
		ERRORCODE="9002"
		;;		
	30) 
		ERRORSTRING="FTP PORT failed. The PORT command failed. Not all FTP servers support the PORT command, try doing a transfer using PASV instead! "
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	31) 
		ERRORSTRING="FTP couldn't use REST. The REST command failed. This command is used for resumed FTP transfers. "
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	33) 
		ERRORSTRING="HTTP range error. The range \"command\" didn't work. "
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	34) 
		ERRORSTRING="HTTP post error. Internal post-request generation error. "
		ERRORCODE="9002"
		;;		
	35) 
		ERRORSTRING="SSL connect error. The SSL handshaking failed. "
		ERRORCODE="9012"
		;;		
	36) 
		ERRORSTRING="FTP bad download resume. Couldn't continue an earlier aborted download. "
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	37) 
		ERRORSTRING="FILE couldn't read file. Failed to open the file. Permissions? "
		ERRORCODE="9016"
		;;		
	38) 
		ERRORSTRING="LDAP cannot bind. LDAP bind operation failed. "
		ERRORCODE="9002"
		;;		
	39) 
		ERRORSTRING="LDAP search failed. "
		ERRORCODE="9002"
		;;		
	41) 
		ERRORSTRING="Function not found. A required LDAP function was not found. "
		ERRORCODE="9002"
		;;		
	42) 
		ERRORSTRING="Aborted by callback. An application told curl to abort the operation. "
		ERRORCODE="9002"
		;;		
	43) 
		ERRORSTRING="Internal error. A function was called with a bad parameter. "
		ERRORCODE="9002"
		;;		
	45) 
		ERRORSTRING="Interface error. A specified outgoing interface could not be used. "
		ERRORCODE="9002"
		;;		
	47) 
		ERRORSTRING="Too many redirects. When following redirects, curl hit the maximum amount. "
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	48) 
		ERRORSTRING="Unknown TELNET option specified. "
		ERRORCODE="9002"
		;;		
	49) 
		ERRORSTRING="Malformed telnet option. "
		ERRORCODE="9002"
		;;		
	51) 
		ERRORSTRING="The peer's SSL certificate or SSH MD5 fingerprint was not ok. "
		ERRORCODE="9012"
		;;		
	52) 
		ERRORSTRING="The server didn't reply anything, which here is considered an error. "
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	53) 
		ERRORSTRING="SSL crypto engine not found. "
		ERRORCODE="9002"
		;;		
	54) 
		ERRORSTRING="Cannot set SSL crypto engine as default. "
		ERRORCODE="9002"
		;;		
	55) 
		ERRORSTRING="Failed sending network data. "
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	56) 
		ERRORSTRING="Failure in receiving network data. "
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	58) 
		ERRORSTRING="Problem with the local certificate."
		ERRORCODE="9002"
		;;		
	59) 
		ERRORSTRING="Couldn't use specified SSL cipher. "
		ERRORCODE="9002"
		;;		
	60) 
		ERRORSTRING="Peer certificate cannot be authenticated with known CA certificates. "
		ERRORCODE="9012"
		;;		
	61) 
		ERRORSTRING="Unrecognized transfer encoding. "
		ERRORCODE="9002"
		;;		
	62) 
		ERRORSTRING="Invalid LDAP URL. "
		ERRORCODE="9002"
		;;		
	63) 
		ERRORSTRING="Maximum file size exceeded. "
		ERRORCODE="9002"
		;;		
	64) 
		ERRORSTRING="Requested FTP SSL level failed. "
		ERRORCODE="9002"
		;;		
	65) 
		ERRORSTRING="Sending the data requires a rewind that failed. "
		ERRORCODE="9002"
		;;		
	66) 
		ERRORSTRING="Failed to initialise SSL Engine. "
		ERRORCODE="9002"
		;;		
	67) 
		ERRORSTRING="The user name, password, or similar was not accepted and curl failed to log in. "
		ERRORCODE="9012"
		;;		
	68) 
		ERRORSTRING="File not found on TFTP server. "
		ERRORCODE="9016"
		;;		
	69) 
		ERRORSTRING="Permission problem on TFTP server. "
		ERRORCODE="9012"
		;;		
	70) 
		ERRORSTRING="Out of disk space on TFTP server. "
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	71) 
		ERRORSTRING="Illegal TFTP operation. "
		ERRORCODE="9002"
		;;		
	72) 
		ERRORSTRING="Unknown TFTP transfer ID. "
		ERRORCODE="9002"
		;;		
	73) 
		ERRORSTRING="File already exists (TFTP). "
		ERRORCODE="9002"
		;;		
	74) 
		ERRORSTRING="No such user (TFTP). "
		ERRORCODE="9012"
		;;		
	75) 
		ERRORSTRING="Character conversion failed. "
		ERRORCODE="9002"
		;;		
	76) 
		ERRORSTRING="Character conversion functions required. "
		ERRORCODE="9002"
		;;		
	77) 
		ERRORSTRING="Problem with reading the SSL CA cert (path? access rights?). "
		ERRORCODE="9002"
		;;		
	78) 
		ERRORSTRING="The resource referenced in the URL does not exist. "
		ERRORCODE="$DEFAULT_ERROR_CODE"
		;;		
	79) 
		ERRORSTRING="An unspecified error occurred during the SSH session. "
		ERRORCODE="9002"
		;;		
	80) 
		ERRORSTRING="Failed to shut down the SSL connection. "
		ERRORCODE="9002"
		;;		
	82) 
		ERRORSTRING="Could not load CRL file, missing or wrong format (added in 7.19.0). "
		ERRORCODE="9002"
		;;		
	83) 
		ERRORSTRING=" Issuer check failed (added in 7.19.0). "
		ERRORCODE="9002"
		;;	
    	0)	
		ERRORSTRING=""
		ERRORCODE="0"
		;;
    	*)	
		ERRORSTRING="Curl failed with error $CURLERROR"
		ERRORCODE="9002"
		;;
  esac	
  
}

#####################################################################################
# Perform transfer
# First must contain the curl transfer options
#####################################################################################
transfer_file () 
{
  transfer_file_without_finish "$*"
  if [ ! "$ERRORCODE" == "0" ]; then
    finish_transfer $ERRORCODE "$ERRORSTRING"
    exit 1
  fi	
}