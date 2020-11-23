#!/bin/sh

  PEMFILE=/tmp/verifyDER_$$.pem

  rm -f ${PEMFILE}
  openssl x509 -inform DER -in "$1" > ${PEMFILE}
  [ ! -f ${PEMFILE} ] && exit 255

  openssl verify -CApath /usr/lib/pkitoken ${PEMFILE}
  RETVAL=$?

  rm -f ${PEMFILE}

  exit ${RETVAL}

