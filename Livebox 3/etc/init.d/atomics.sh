# Helper functions for atomic operations on files

# Copy $1 to $2, atomically.
# $2 must not exist before.
#
# If power fails, either $2 is created and has the contents of $2,
# or $2 does not exist. If $2 exists, it is guarnateed that any file
# system operations preceding it have completed. If it does not exist,
# preceding file system operations may or may not have completed.
#
# If power fails, it is possible that a $2.<pid> file is left behind.
#
# This is not multi-thread safe: two parallel ATOMIC_CP operations on
# the same file break the guarantees.
ATOMIC_CP()
{
    test -e "$2" && return 1
    rm -f "$2".$$
    cp "$1" "$2".$$
    sync
    mv "$2".$$ "$2"
    sync # Not strictly needed, brings disk state up-to-date sooner.
}

# Copy $1 to $2, atomically, if $2 doesn't exist.
# Cfr. ATOMIC_CP but only if $2 doesn't exist yet.
#
# This is not multi-thread safe: two parallel ATOMIC_CP operations on
# the same file break the guarantees.
ATOMIC_CP_IF_NOT_EXISTS()
{
    if [ ! -e "$2" ]; then
        ATOMIC_CP "$1" "$2"
    fi
}

# Create an (empty) marker file $1, atomically.
# $1 must not exist before.
#
# Similar to ATOMIC_CP but create an empty file instead of copying an
# existing one.
#
# If power fails, either $1 exists, and any file system operations
# preceding it have completed or $1 does not exist. In the later case,
# preceding file system operations may or may not have completed.
#
# This is not multi-thread safe: two parallel ATOMIC_TOUCH operations on
# the same file break the guarantees.
ATOMIC_TOUCH()
{
    test -e "$1" && return 1
    sync # Make sure preceding operations have completed
    touch "$1"
    sync # Not strictly needed, brings disk state up-to-date sooner.
}
