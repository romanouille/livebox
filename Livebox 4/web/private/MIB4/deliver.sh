#! /bin/bash

echo "Copying to deliver"
install -d deliver
rsync -a output/release/root_fs/app deliver
echo "Done"
