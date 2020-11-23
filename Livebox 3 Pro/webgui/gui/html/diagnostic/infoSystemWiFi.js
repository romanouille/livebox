jQuery.orange.config.areacontent.infoSystemWiFi = {
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
//								content += 	'<div class="boxType4 border-bottom-3">';
//							//	content += 		'<div class="h3Text orange" i18n="menuDiagnostic.infoSystemWiFi"/>';
//								content += 		'<div class="clear"/>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.wifi.5.1">';
//								content += '<span class="bold_font"  dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANWiFiPort/Enable"  i18nPrefix="data.diagnostic.infosystem.wifi.status"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.wifi.5.2">';
//								content += '<span class="bold_font"  dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANWiFiPort/Status"  i18nPrefix="data.diagnostic.infosystem.wifi.linkstatus"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.wifi.5.3">';
//								content += '<span class="bold_font"  dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANWiFiPort/MACAddress"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.wifi.5.4">';
//								content += '<span class="bold_font"  dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANWiFiPort/SSID"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.wifi.5.6">';
//								content += '<span class="bold_font"  dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANWiFiPort/AutoChannelEnable" i18nPrefix="data.diagnostic.infosystem.wifi.autochannelenable"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.wifi.5.7">';
//								content += '<span class="bold_font"  dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANWiFiPort/Channel"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.wifi.5.13">';
//								content += '<span class="bold_font"  dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANWiFiPort/BytesSent"/>';
//								content += '</div>';
//								content += '<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.wifi.5.14">';
//								content += '<span class="bold_font"  dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANWiFiPort/BytesReceived"/>';
//								content += '</div>';
//								content += 	'</div>';
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
		infoSystem_postParse("#infoSystemWiFi");
	}
};