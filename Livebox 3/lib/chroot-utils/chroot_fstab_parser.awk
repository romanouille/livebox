#############################################################
# Script for create chroot environnement
# command line :
# > awk --posix -v rootdir=/var/lib/destination -f chroot.awk bin.fstab
#############################################################

##############################################################
# Function to execute shell command line and return the result
function exec (cmdline)
{
   ret = ""
	cmdline | getline
   ret = $0
   close(cmdline)
   return ret
}

##############################################################
# Function remove filename portion of pathname
# 
function dirname (pathname){
   if (sub(/\/[^\/]*$/, "", pathname))
      return pathname
   else
      return "."
}

##############################################################
BEGIN {
    exec("mkdir -p "rootdir)
}

# Delete all commented line
/^[[:blank:]]*\#/ { next }

# Delete all blank line
/^[[:space:]]*$/ { next }

# default operation
{
   op = operation
   chroot_path = rootdir
   filename = 	$1
   pathname = dirname($1)
   type     = $2
   mode     = $3
   user     = $4
   group    = $5
   optmnt   = $6
   
   arg["f"] = 6
   arg["d"] = 6
   arg["l"] = 3
   arg["b"] = 6
   arg["c"] = 6

    ### print "arguments "NF" [0:"chroot_path" :1"filename" 0:"pathname" 2:"type" 3:"mode" 4:"user" 5:"group" 6:"optmnt"] "arg[type]
   if ( "" == arg[type]) {
      print FILENAME"("FNR"):Unknown type of file "type
      next
   }
   if ( NF < arg[type]) {
      print FILENAME"("FNR"):Missing "(arg[type]-NF)" arguments"
      next
   }

   if (match(optmnt, /slave/) != 0)
      next

   if (op == "create") {
      if ("f" == type) {
         exec("mkdir -p "chroot_path"/"pathname)
         exec("touch "chroot_path"/"filename)
      }
      else if ("d" == type) {
         exec("mkdir -p "chroot_path"/"filename)
      }
      else if ("l" == type) {
         link_src=$3
         exec("mkdir -p "chroot_path"/"pathname)
         exec("ln -s "link_src" "chroot_path"/"filename)
      }
      else if ("b" == type || 
               "c" == type) {
         major=$6
         minor=$7
         exec("mkdir -p "chroot_path"/"pathname)
         exec("mknod "chroot_path"/"filename" "type" "major" "minor)      
      }
      else {
         next
      }

      if ("-" != mode)
         exec("chmod "mode" "chroot_path"/"filename)
      if ("-" != group)
         exec("chgrp "group" "chroot_path"/"filename)
      if ("-" != user) 
         exec("chown "user" "chroot_path"/"filename)

      if ("-" != optmnt) {
         #is_shared= match(optmnt, /slave/)
         #
         #if ( is_shared != 0) {
         #   if ( match(optmnt, /,slave/) != 0) { sub(/,slave/,"",optmnt) }
         #   else if ( match(optmnt, /slave,/) != 0) { sub(/slave,/,"",optmnt) }
         #   else if ( match(optmnt, /slave/) != 0) { sub(/slave/,"",optmnt) }
         #   next
         #}
         exec("mount -o bind,"optmnt" "filename" "chroot_path"/"filename)
         #if (is_shared != 0) {
         #   exec("mount -o rslave "chroot_path"/"filename" "chroot_path"/"filename)
         #}
      }
   }
   if (op == "delete") {
       if ("-" != optmnt)
          exec("umount "chroot_path"/"filename)
       if ("f" == type || "b" == type || "c" == type ) {
          exec("rm -rf "chroot_path"/"filename)
      }
       if ("d" == type) {
          exec("rmdir "chroot_path"/"filename)
      }
   }

}

##############################################################


