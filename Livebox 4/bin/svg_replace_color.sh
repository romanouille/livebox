#!/bin/sh

CT_MNT_POINT=/ext/image
WEB_UI_PATH=/web/private/configurator
PREVIOUS_COLOR=#C7D01F
NEW_COLOR=

print_usage_and_exit() {
	echo -e "Error: $1\n\n"
	echo -e "Usage: $0 <new_color> <previous_color> <web_ui_path>"
	echo -e "\t\t-new_color: the new color"
	echo -e "\t\t-previous_color: the color to replace (default=$PREVIOUS_COLOR)"
	echo -e "\t\t-web_ui_path: path where the ui is located (default=$CT_MNT_POINT$WEB_UI_PATH)\n"
	
	exit 1
}

# verify the number of command line options
if [ $# -eq 0 ]
then
	print_usage_and_exit "Missing command line options"
fi

if [ $# -gt 3 ]
then
	print_usage_and_exit "too many options defined"
fi

# get the command line options
NEW_COLOR=$1
if [ $# -gt 1 ]
then
	PREVIOUS_COLOR=$2
fi

if [ $# -gt 2 ]
then
	WEB_UI_PATH=$3
fi

if [ "$(mount | grep " $CT_MNT_POINT ")" == "" ]; then
    /bin/export_to_usb.sh || exit 1;
fi

# perform the replacement
for svg in $(find $WEB_UI_PATH -type f -iname *.svg)
do 
	echo -e "patching file \"$svg\""
	cat $svg | sed "s/$PREVIOUS_COLOR/$NEW_COLOR/g"  > $CT_MNT_POINT$svg
done

exit 0
