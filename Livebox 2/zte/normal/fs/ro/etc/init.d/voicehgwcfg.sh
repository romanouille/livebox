
VOIPHGWCFG=/etc/voicehgwcfg.sh
TMPFILE=/tmp/voicehgwcfg
SIP_TRUNK_PATH=VoiceService.VoiceApplication.VoiceProfile.SIP-Trunk
ATA_PATH=VoiceService.VoiceApplication.VoiceProfile.ATA
GROUP_PATH=VoiceService.VoiceApplication.X_SOFTATHOME-COM_Group

CLI_CMD="pcb_cli"

if [ -n "$CONFIG_GENERATION_RESC" ]; then
	bootmode=rescue
else
	bootmode=system
fi

if [ $# -eq 0 ]; then
	echo "Please specify the needed operation"
	exit 1
fi


for arg in $*; do
	if [ "$arg" == "backup" ]; then
		if [ "$CONFIG_GENERATION_RESC" ]; then
			echo "backup requested, but this is not an operational image, skipping backup"
		else
			export_voicecfg=y
		fi
	elif [ "$arg" == "restore" ]; then
		restore_voicecfg=y
	else
		echo "Usage: voicehgwcfg.sh [backup] [restore]"
		exit 1
	fi
done


if [ -n "$export_voicecfg" ]; then

	#intiate the cli file
	echo "# [CLI configuration] "  > $VOIPHGWCFG
	echo "path=$SIP_TRUNK_PATH" >> $VOIPHGWCFG

	#Export the Servers config
	echo " "  >> $VOIPHGWCFG
	echo "# [Servers configuration] "  >> $VOIPHGWCFG
	echo "Exporting SIP configuration"
	echo "$SIP_TRUNK_PATH.SIP?" | $CLI_CMD | egrep 'ProxyServer|RegistrarServer|OutboundProxy' | cut -d . -f 5-50 >> $VOIPHGWCFG

	
	#export Line config
	echo "$SIP_TRUNK_PATH.Line.?" | $CLI_CMD --depth 0 | cut -f 6 -d . | sed -e '/^ *$/d' > $TMPFILE
	
	
	echo "Exporting Accounts configuration"
	echo " "  >> $VOIPHGWCFG
	echo "# [Lines configuration] "  >> $VOIPHGWCFG
	list_name=`cat /tmp/voicehgwcfg`
	
	for name in $list_name
	do
		echo "Line.+{ key=$name, X_SOFTATHOME-COM_Name=$name }" | sed -e "s#LineName#$name#" >> $VOIPHGWCFG
		echo "$SIP_TRUNK_PATH.Line.$name.?" | $CLI_CMD --depth 1 | cut -f 5-50 -d . | egrep 'Directory|Enable' >> $VOIPHGWCFG
		echo "$SIP_TRUNK_PATH.Line.$name.SIP?" | $CLI_CMD | cut -f 5-50 -d . | egrep 'Auth|URI'=  >> $VOIPHGWCFG
	done


	echo "Exporting Numbering Plan configuration"
	echo " " >> $VOIPHGWCFG
	echo "# [Numbering Plan configuration]" >> $VOIPHGWCFG 
	echo "$SIP_TRUNK_PATH.NumberingPlan.PrefixInfo?" | $CLI_CMD | cut -d . -f 5-20 | egrep 'PrefixRange|FacilityAction' >> $VOIPHGWCFG

	#export common-group members
 
	echo "Exporting X_SOFTATHOME_COM_Group configuration"
	echo " " >> $VOIPHGWCFG
	echo "# [X_SOFTATHOME_COM_Group configuration]" >> $VOIPHGWCFG
	echo "path=$GROUP_PATH" >> $VOIPHGWCFG
	echo "Member-" >> $VOIPHGWCFG

	echo "$GROUP_PATH?" | $CLI_CMD --depth 0 | cut -f 4 -d . | sed -e '/^ *$/d' > $TMPFILE
	
	list_group=`cat /tmp/voicehgwcfg`
	for name in $list_group
	do
			echo "+{ key=$name, GroupName=$name }" | sed -e "s#Group_Name#$name#" >> $VOIPHGWCFG
			echo "$GROUP_PATH.$name.?" | $CLI_CMD --depth 1 | cut -f 5-50 -d . | egrep 'Type|Number' >> $VOIPHGWCFG
			echo "path=$GROUP_PATH.$name" >> $VOIPHGWCFG 
			LINEREFERENCES=$(echo "$GROUP_PATH.$name.Member?" | $CLI_CMD | cut -d . -f 7)
			for x in $LINEREFERENCES
			do
				name=$(echo $x | cut -d = -f 2)
				echo "Member+{key=$name, $x}" >> $VOIPHGWCFG
			done
	done


	echo "exporting ATA configuration"
	echo " " >> $VOIPHGWCFG
	echo "# [ATA configuration]" >> $VOIPHGWCFG
	echo "path=$ATA_PATH" >> $VOIPHGWCFG
	echo "$ATA_PATH.Line?" | $CLI_CMD | cut -d . -f 5-20 | grep "OutgoingLineReference" >> $VOIPHGWCFG

	rm $TMPFILE
	
	echo "Done! Settings exported to $VOIPHGWCFG"

fi

if [ -n "$restore_voicecfg" ]; then

	if [ -e $VOIPHGWCFG ];
	then
		cat $VOIPHGWCFG | pcb_cli
		echo " Done! Configuration restored using the backup configuration"
	else
		echo "backup configuration doesn't exist"
	fi

fi
