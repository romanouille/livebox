jQuery.orange.config.areacontent.infoSystemUSB = {
	preParse: function() {
		var Xuid_USB1 = "Device/Networks/LAN[@name='LAN']/LANPorts/USBPort[@Name='Front']/@uid";
		jQuery.orange.config.api.crud.read(
				[Xuid_USB1],
				function (result) {
					for(var uid in result[Xuid_USB1].values){
						uid_USB1 = result[Xuid_USB1].values[uid];
					}
					var linkedDevices = "Device/Networks/LAN[@name='LAN']/LANPorts/USBPort[HUBPort='"+uid_USB1+"']";
					jQuery.orange.config.api.crud.read(
							[linkedDevices],
							function (result2) {
								if(result2[linkedDevices] != undefined) {
									var device;
									var i=4;
									for(device in result2[linkedDevices].values) {
										$("#gwc_usb1").append('<br/><div widgetType="FormInput"><span dataId="'+device+'/Status" i18nPrefix="data.diagnostic.infosystem.usb.linkstatus"/></div>');
										$("#gwc_usb1").append('<div widgetType="FormInput"><span dataId="'+device+'/DeviceClass" i18nPrefix="data.diagnostic.infosystem.usb.function"/></div>');
										$("#gwc_usb1").orangeParse();
										$('[dataid="'+device+'/Status"]').parent().prev().html("7."+i+"&#160;<span i18n='page.diagnostic.infosystem.usb.usb.linkstatus'/>");
										i++;
										$('[dataid="'+device+'/DeviceClass"]').parent().prev().html("7."+i+"&#160;<span i18n='page.diagnostic.infosystem.usb.usb.function'/>");
										i++;
										$("#gwc_usb1").orangeParse();
									}
								}
							});
				});
		
		var Xuid_USB2 = "Device/Networks/LAN[@name='LAN']/LANPorts/USBPort[@Name='Left']/@uid";
		jQuery.orange.config.api.crud.read(
				[Xuid_USB2],
				function (result) {
					for(var uid2 in result[Xuid_USB2].values){
						uid_USB2 = result[Xuid_USB2].values[uid2];
					}
					var linkedDevices = "Device/Networks/LAN[@name='LAN']/LANPorts/USBPort[HUBPort='"+uid_USB2+"']";
					jQuery.orange.config.api.crud.read(
							[linkedDevices],
							function (result2) {
								if(result2[linkedDevices] != undefined) {
									var device;
									var i=4;
									for(device in result2[linkedDevices].values) {
										$("#gwc_usb2").append('<br/><div widgetType="FormInput"><span dataId="'+device+'/Status" i18nPrefix="data.diagnostic.infosystem.usb.linkstatus"/></div>');
										$("#gwc_usb2").append('<div widgetType="FormInput"><span dataId="'+device+'/DeviceClass" i18nPrefix="data.diagnostic.infosystem.usb.function"/></div>');
										$("#gwc_usb2").orangeParse();
										$('[dataid="'+device+'/Status"]').parent().prev().html("8."+i+"&#160;<span i18n='page.diagnostic.infosystem.usb.usb.linkstatus'/>");
										i++;
										$('[dataid="'+device+'/DeviceClass"]').parent().prev().html("8."+i+"&#160;<span i18n='page.diagnostic.infosystem.usb.usb.function'/>");
										i++;
										$("#gwc_usb2").orangeParse();
									}
								}
							});
				});
		
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
//								content += 	'<div class="h2Text orange" i18n="page.diagnostic.infosystem.usb.usb1"/>';
//								content += 	'<div class="clear"/>';
//								content += 	'<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.usb.usb1.8.1">';
//								content += 	'<span class="margin-left-100" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/USBPort[@Name=\'Front\']/Enable" i18nPrefix="data.diagnostic.infosystem.usb.enable"/>';
//								content += 	'</div>';
//								//content += 	'<br/>';
//								content += 	'<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.usb.usb1.8.1.1">';
//								content += 	'<span dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/USBPort[@Name=\'Front\']/Status" i18nPrefix="data.diagnostic.infosystem.usb.linkstatus"/>';
//								content += 	'</div>';
//								content += 	'<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.usb.usb1.8.2">';
//								content += 	'<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/USBPort[@Name=\'Front\']/DeviceClass" i18nPrefix="data.diagnostic.infosystem.usb.function"/>';
//								content += 	'</div>';
//								content += 	'<div id="id'+uid+'_usb1"/>';
//								content += 	'</div>';
//								content += 	'<div class="boxType5 border-bottom-3">';
//								content += 	'<div class="h2Text orange" i18n="page.diagnostic.infosystem.usb.usb2"/>';
//								content += 	'<div class="clear"/>';
//								content += 	'<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.usb.usb2.8.2">';
//								content += 	'<span class="margin-left-100" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/USBPort[@Name=\'Left\']/Enable" i18nPrefix="data.diagnostic.infosystem.usb.enable"/>';
//								content += 	'</div>';
//								//content += 	'<br/>';
//								content += 	'<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.usb.usb2.8.2.1">';
//								content += 	'<span class="margin-left-100" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/USBPort[@Name=\'Left\']/Status" i18nPrefix="data.diagnostic.infosystem.usb.linkstatus"/>';
//								content += 	'</div>';
//								content += 	'<div class="margin-leftInfSys-30" widgetType="FormInput" widgetArg="{\'align\':\'left\'}" i18n="page.diagnostic.infosystem.usb.usb2.8.2.2">';
//								content += 	'<span class="margin-left-100 bold_font" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/USBPort[@Name=\'Left\']/DeviceClass" i18nPrefix="data.diagnostic.infosystem.usb.function"/>';
//								content += 	'</div>';
//								content += 	'<div id="id'+uid+'_usb2"/>';
//								content += 	'</div>';
//								content += '</div>';
//								$("#id"+uid).append(content);
//								
//								var uid_USB1 = "Device/MESH/AccessPoints/AccessPoint[@uid='"+uid+"']/Ports/USBPort[@Name='Front']/@uid";
//								jQuery.orange.config.api.crud.read(
//									[uid_USB1],
//									function (result) {
//										uid_USB1 = result[uid_USB1].values[uid_USB1];
//										var linkedDevices = "Device/MESH/AccessPoints/AccessPoint[@uid='"+uid+"']/Ports/USBPort[HUBPort='"+uid_USB1+"']";
//										jQuery.orange.config.api.crud.read(
//												[linkedDevices],
//												function (result2) {
//													if(result2[linkedDevices] != undefined) {
//														var device;
//														var i=4;
//														for(device in result2[linkedDevices].values) {
//															$("#id"+uid+"_usb1").append('<br/><div widgetType="FormInput"><span dataId="'+device+'/Status" i18nPrefix="data.diagnostic.infosystem.usb.linkstatus"/></div>');
//															$("#id"+uid+"_usb1").append('<div widgetType="FormInput"><span dataId="'+device+'/DeviceClass" i18nPrefix="data.diagnostic.infosystem.usb.function"/></div>');
//															$("#id"+uid+"_usb1").orangeParse();
//															$('[dataid="'+device+'/Status"]').parent().prev().html("7."+i+"&#160;<span i18n='page.diagnostic.infosystem.usb.usb.linkstatus'/>");
//															i++;
//															$('[dataid="'+device+'/DeviceClass"]').parent().prev().html("7."+i+"&#160;<span i18n='page.diagnostic.infosystem.usb.usb.function'/>");
//															i++;
//															$("#id"+uid+"_usb1").orangeParse();
//														}
//													}
//												});
//									});
//								
//								var uid_USB2 = "Device/MESH/AccessPoints/AccessPoint[@uid='"+uid+"']/Ports/USBPort[@Name=\'Left\']/@uid";
//								jQuery.orange.config.api.crud.read(
//									[uid_USB2],
//									function (result) {
//										uid_USB2 = result[uid_USB2].values[uid_USB2];
//										var linkedDevices = "Device/MESH/AccessPoints/AccessPoint[@uid='"+uid+"']/Ports/USBPort[HUBPort='"+uid_USB2+"']";
//										jQuery.orange.config.api.crud.read(
//												[linkedDevices],
//												function (result2) {
//													if(result2[linkedDevices] != undefined) {
//														var device;
//														var i=4;
//														for(device in result2[linkedDevices].values) {
//															$("#id"+uid+"_usb2").append('<br/><div widgetType="FormInput"><span dataId="'+device+'/Status" i18nPrefix="data.diagnostic.infosystem.usb.linkstatus"/></div>');
//															$("#id"+uid+"_usb2").append('<div widgetType="FormInput"><span dataId="'+device+'/DeviceClass" i18nPrefix="data.diagnostic.infosystem.usb.function"/></div>');
//															$("#id"+uid+"_usb2").orangeParse();
//															$('[dataid="'+device+'/Status"]').parent().prev().html("8."+i+"&#160;<span i18n='page.diagnostic.infosystem.usb.usb.linkstatus'/>");
//															i++;
//															$('[dataid="'+device+'/DeviceClass"]').parent().prev().html("8."+i+"&#160;<span i18n='page.diagnostic.infosystem.usb.usb.function'/>");
//															i++;
//															$("#id"+uid+"_usb2").orangeParse();
//														}
//													}
//												});
//									});
//							}
//						}
//					}
		}
		infoSystem_preParse();
	},
	postParse: function() {
		$("#help").bind("click",function() {
			helpPopup("html/main/help_infoSystem.html");
		});
		infoSystem_postParse("#infoSystemUSB");
	}
};