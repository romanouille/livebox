#!/bin/sh

ROOTFS_SCRIPT="/lib/chroot-utils/chroot_fstab_parser.awk"
AWK="/usr/bin/awk"
MOUNT="/bin/mount"
UMOUNT="/bin/umount"

[ ! -e $ROOTFS_SCRIPT ] && echo "awk script $ROOTFS_SCRIPT missing" && exit 0
[ ! -e $AWK ] && echo "awk binary ($AWK) missing" && exit 0

##
#  mark the directory as shared if is not already done
#  arg1 : directory path
##
make_dir_shared()
{
   local dir_shared=$1
   local dir_temp=""

   for dir_temp in $($AWK '/shared:/{ print $5}' /proc/self/mountinfo) ; do
      [ "x$dir_temp" == "x$dir_shared" ] && return 1
   done

   $MOUNT -o bind $dir_shared $dir_shared
   $MOUNT -o shared $dir_shared $dir_shared

   return 0
}

##
#  create chroot rootfs and bind all file and directory
#  arg1 : fstab rootfs file description
#  arg2 : destination rootfs
##
create_rootfs()
{
   local fstab=$1
   local destdir=$2
   local temp=""

   [ ! -e $fstab ] && echo "Missing $fstab file" && return 1

   $AWK -v rootdir=$destdir -v operation=create -f $ROOTFS_SCRIPT $fstab
   return 0
}

##
#  remove chroot rootfs unbinding all files and directory and delete
#  the tree directory
#  arg1: chroot rootfs to remove
##
delete_rootfs()
{
   local fstab=$1
   local destdir=$2
   local temp=""

   [ ! -e  $destdir ] && echo "Missing Root directory '$destdir'" && return 1
   $AWK -v rootdir=$destdir -v operation=delete -f $ROOTFS_SCRIPT $fstab

   return 0
}

