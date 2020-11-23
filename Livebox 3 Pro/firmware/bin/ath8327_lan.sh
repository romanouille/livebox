#!/bin/sh

# configure ACL rule for SSDP
ssdk_sh acl status set enable
ssdk_sh acl list create 0 0
ssdk_sh acl rule add 0 0 1 mac y 01-00-5e-7f-ff-fa ff-ff-ff-ff-ff-ff n n n n n n n n n n n n n n n n n n n n y n n n n n n 0 0 n n n n n n n n n n n n n
ssdk_sh acl list bind 0 0 0 1
ssdk_sh acl list bind 0 0 0 2
ssdk_sh acl list bind 0 0 0 3
ssdk_sh acl list bind 0 0 0 4
