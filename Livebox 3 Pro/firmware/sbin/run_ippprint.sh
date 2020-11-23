#!/bin/sh

echo "IPP Print Server Service Launched."

/bin/ippprint -n "$1" &

