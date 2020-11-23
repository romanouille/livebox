jQuery.orange.config.areacontent.infoSystemLAN = {
	preParse: function() {
	
		var MeshEnable = "Device/MESH/Enable";
//		jQuery.orange.config.api.crud.read(
//				[MeshEnable],
//				function (result) {
//					MeshEnable = result[MeshEnable].values[MeshEnable];
//				});
		MeshEnable = false;
		if(MeshEnable != true){
			$("#routerlist").parent().remove();
			$("#MASTERBOX > div > span").removeClass('plus');
			$("#MASTERBOX > div > span").removeClass('moins');
		}else{
//			var nbAPDevice;
//			var APDevice = "Device/MESH/AccessPoints/AccessPoint[Alias!='GWC']";
//			jQuery.orange.config.api.crud.read(
//				[APDevice],
//				function (result) {
//					if (result[APDevice] == undefined) {
//						$("#routerlist").parent().remove();
//						$("#MASTERBOX > div > span").removeClass('plus');
//						$("#MASTERBOX > div > span").removeClass('moins');
//					}
//					else {
//						nbAPDevice = result[APDevice].nb;
//						if (result[APDevice].nb == 0) {
//							$("#routerlist").parent().remove();
//							$("#MASTERBOX > div > span").removeClass('plus');
//							$("#MASTERBOX > div > span").removeClass('moins');
//						}
//						else if (result[APDevice].nb > 0) {
//							var box;
//							for (box in result[APDevice].values) {
//								var uid = result[APDevice].values[box]["uid"];
//								$(".maindiv > form").append('<div id="id'+uid+'"/>');
//								$("#id"+uid).append('<div class="headBoxType1 margin-top-10"><span class="plus" ><span class="h3Text margin-left-30" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/DeviceInfo/RouterName"/></span></div>');
//								var content = "";
//								content += '<div class="sysinfo">';
//								content += 	'<div class="boxType4 border-bottom-1">';
//								content += 		'<div class="h3Text orange" i18n="menuDiagnostic.infoSystemLAN"/>';
//								content += 		'<div class="clear"/>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.general.6.6">';
//								content += '<span dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/IPAddress"/>';
//								content += '</div>';
//								content += 	'</div>';
//		
//								content += '<div class="boxType5 border-bottom-1">';
//								content += '<div class="h2Text orange" i18n="page.diagnostic.infosystem.lan.red"/>';
//								content += '<div class="clear"/>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.red.6.8">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Red\']/Mode" i18nPrefix="data.diagnostic.infosystem.lan.ethernetportmode"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.red.6.9">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Red\']/Enable" i18nPrefix="data.diagnostic.infosystem.lan.ethernetportenable"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.red.6.10">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Red\']/Status" i18nPrefix="data.diagnostic.infosystem.lan.ethernetportstatus"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.red.6.11">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Red\']/AutoConfig" i18nPrefix="data.diagnostic.infosystem.lan.ethernetportautoconfig"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.red.6.12">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Red\']/MACAddress"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.red.6.13">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Red\']/MaxBitRate"/>&#160;Mb/s';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.red.6.14">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Red\']/DuplexMode" i18nPrefix="data.diagnostic.infosystem.lan.ethernetport.duplexmode"/>';
//								content += '</div>';
//								content += '</div>';
//		
//								content += '<div class="boxType5 border-bottom-1">';
//								content += '<div class="h2Text orange" i18n="page.diagnostic.infosystem.lan.yellow"/>';
//								content += '<div class="clear"/>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.yellow.6.15">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Yellow\']/Mode" i18nPrefix="data.diagnostic.infosystem.lan.ethernetportmode"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.yellow.6.16">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Yellow\']/Enable" i18nPrefix="data.diagnostic.infosystem.lan.ethernetportenable"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.yellow.6.17">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Yellow\']/Status" i18nPrefix="data.diagnostic.infosystem.lan.ethernetportstatus"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.yellow.6.18">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Yellow\']/AutoConfig" i18nPrefix="data.diagnostic.infosystem.lan.ethernetportautoconfig"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.yellow.6.19">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Yellow\']/MACAddress"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.yellow.6.20">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Yellow\']/MaxBitRate"/>&#160;Mb/s';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.yellow.6.21">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Yellow\']/DuplexMode" i18nPrefix="data.diagnostic.infosystem.lan.ethernetport.duplexmode"/>';
//								content += '</div>';
//								content += '</div>';
//		
//								content += '<div class="boxType5 border-bottom-1">';
//								content += '<div class="h2Text orange" i18n="page.diagnostic.infosystem.lan.green"/>';
//								content += '<div class="clear"/>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.green.6.22">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Green\']/Mode" i18nPrefix="data.diagnostic.infosystem.lan.ethernetportmode"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.green.6.23">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Green\']/Enable" i18nPrefix="data.diagnostic.infosystem.lan.ethernetportenable"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.green.6.24">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Green\']/Status" i18nPrefix="data.diagnostic.infosystem.lan.ethernetportstatus"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.green.6.25">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Green\']/AutoConfig" i18nPrefix="data.diagnostic.infosystem.lan.ethernetportautoconfig"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.green.6.26">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Green\']/MACAddress"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.green.6.27">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Green\']/MaxBitRate"/>&#160;Mb/s';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.green.6.28">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'Green\']/DuplexMode" i18nPrefix="data.diagnostic.infosystem.lan.ethernetport.duplexmode"/>';
//								content += '</div>';
//								content += '</div>';
//		
//								content += '<div class="boxType5 border-bottom-3">';
//								content += '<div class="h2Text orange" i18n="page.diagnostic.infosystem.lan.white"/>';
//								content += '<div class="clear"/>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.white.6.29">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'White\']/Mode" i18nPrefix="data.diagnostic.infosystem.lan.ethernetportmode"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.white.6.30">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'White\']/Enable" i18nPrefix="data.diagnostic.infosystem.lan.ethernetportenable"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.white.6.31">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'White\']/Status" i18nPrefix="data.diagnostic.infosystem.lan.ethernetportstatus"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.white.6.32">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'White\']/AutoConfig" i18nPrefix="data.diagnostic.infosystem.lan.ethernetportautoconfig"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.white.6.33">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'White\']/MACAddress"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.white.6.34">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'White\']/MaxBitRate"/>&#160;Mb/s';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.lan.white.6.35">';
//								content += '<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANPorts/EthernetPort[@name=\'White\']/DuplexMode" i18nPrefix="data.diagnostic.infosystem.lan.ethernetport.duplexmode"/>';
//								content += '</div>';
//								content += '</div>';
//		
//								content += '</div>';
//								$("#id"+uid).append(content);
//							}
//						}
//					}
//				});
		}
		infoSystem_preParse();
	},
	postParse: function() {
		$("#help").bind("click",function() {
			helpPopup("html/main/help_infoSystem.html");
		});
		infoSystem_postParse("#infoSystemLAN");
	}
};