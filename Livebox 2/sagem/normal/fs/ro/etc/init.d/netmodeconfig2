#!/bin/sh

OLD_FBN_FILE="/var/state/netmodeconfig/inetdhcp-auto-detector.cli"
CFG_FILE="/var/state/netmodeconfig/nmc.cfg"
WANMODE_FILE="/var/state/netmodeconfig/wanmode"

step3_fbn_migration() {

	# migrate the VoIP mode
	LINE_VOIP=`grep "VoIPRunningInterface" ${OLD_FBN_FILE}`
	echo "VoIPMode=${LINE_VOIP#*=}" >> ${CFG_FILE}

	# disable the access technology discovery
	echo "Discovery.Enable=0" >> ${CFG_FILE}

	# migrate the DHCP autodetection parameters
	LINE_ENABLE=`grep "Autodetect.Enable" ${OLD_FBN_FILE}`
	echo "Autodetect.Enable=${LINE_ENABLE#*=}" >> ${CFG_FILE}

	LINE_NBOAM=`grep "Autodetect.nbOAM" ${OLD_FBN_FILE}`
	echo "Autodetect.nbOAM=${LINE_NBOAM#*=}" >> ${CFG_FILE}

	LINE_TIMER=`grep "Autodetect.Timer" ${OLD_FBN_FILE}`
	echo "Autodetect.Timer=${LINE_TIMER#*=}" >> ${CFG_FILE}

	# migrate the WAN protocol
	LINE_PROTOCOL=`grep "Autodetect.Protocol" ${OLD_FBN_FILE}`
	echo -n "DSL_${LINE_PROTOCOL#*=}" > ${WANMODE_FILE}
}

led_reset () {
	mssleep=500000
	first="Solid"
	second="Off"

	# Internet led set in right color
	pcb_cli "LED.Internet Led.Color=Green"
	allledoff
	for i in 1 2 3 4
	do
		pcb_cli \
		"LED.Power Led.State=$first" \
		"LED.VoIP Led.State=$first" \
		"LED.Wifi Led.State=$first" \
		"LED.Internet Led.State=$second" \
		"LED.Lan Led.State=$second" \
		"LED.Upgrade Led.State=$second"
		usleep $mssleep
		temp=$first
		first=$second
		second=$temp
	done
	allledoff
}

allledoff () {
	pcb_cli "LED.[].State=Off"
}


case $1 in
	backup)
		pcb_cli -l "NMC.export($2)"
		;;
	restore)
		mkdir -p /var/lib/netmodeconfig
		touch /var/lib/netmodeconfig/restore
		;;
	start)
		mkdir -p /var/state/netmodeconfig
		if [ ! -f ${CFG_FILE} -a -f ${OLD_FBN_FILE} ]
		then
			step3_fbn_migration
		fi
		pcb_cli -l \
			"NeMo.loadModule(route.so)" \
			"NeMo.loadModule(wlan-extra.so)" \
			"NeMo.Intf.[~swport || ~eth].Enable=1"
		sahenv -f /etc/environment /usr/bin/netmodeconfig -d
		pcb_cli -l -w -1 "NMC"
		;;
	stop)
		killall netmodeconfig
		pcb_cli -l \
			"NeMo.unloadModule(route.so)" \
			"NeMo.unloadModule(wlan-extra.so)"
		;;
	restart)
		$0 stop
		$0 start
		;;
	reset)
		rm -rf /var/state/netmodeconfig
		led_reset
		;;
	*)
		echo "Usage: $0 [start|stop|restart|backup|restore]"
		;;
esac


