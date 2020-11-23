var TABLE_MAX_MACADDRESS_FILTER = 1000;
function wificonfiguration_enableDisableAll() {
	var noWifiAtAll = ($("#boxList input:checked").length <= 0);
	var securityMode = $('#SecurityMode')[0].getDataValue();
	var wpsMode = $("#WPSModeValue")[0].getDataValue();
	var activateWPS = $("#ActivateWPS")[0].getDataValue();
	var macFilteringEnabled = $("#MACAddressControlEnabled2")[0].getDataValue();
	$(".desactivable input, .desactivable select, #password").setDisabled(noWifiAtAll);
	
	if (securityMode == "NONE"
		|| securityMode == "WPA_ENTERPRISE"
		|| securityMode == "WPA2_ENTERPRISE"
		|| securityMode == "WPA_WPA2_ENTERPRISE"
		|| noWifiAtAll) {
		$("#password").setDisabled(true);
	} else {
		$("#password").setDisabled(false);
	}
	
	var radiusItems = $("#radiusserver").add("#radiusport").add("#radiuspassword");
	if (securityMode == "NONE"
		|| securityMode == "WEP128"
		|| securityMode == "WPA_PERSONAL"
		|| securityMode == "WPA2_PERSONAL"
		|| securityMode == "WPA_WPA2_PERSONAL" 
		|| noWifiAtAll) {
		radiusItems.setDisabled(true);
	} else {
		radiusItems.setDisabled(false);
	}

	if (wpsMode == "MODE_EQP_PIN") {
		$("#WPSPassword").setDisabled(false);
	} else if (wpsMode == "MODE_LIVEBOX_PIN") {
		$("#WPSPassword").setDisabled(true);
	}


	if ( securityMode == "WPA_PERSONAL"
		|| securityMode == "WPA2_PERSONAL"
		|| securityMode == "WPA_WPA2_PERSONAL") {
		if(activateWPS){			
			$("#MACAddressControlEnabled2")[0].setDataValue(false);
		}
	}

	$("#ActivateWPS").setDisabled(macFilteringEnabled || noWifiAtAll);
	$("#MACAddressControlEnabled2").setDisabled(activateWPS || noWifiAtAll);

	$("#wifiConfigurationTable tr:not([class*='table-delete'])").setDisabled(!macFilteringEnabled);
	$("#wifiConfigurationTable").setDisabled(noWifiAtAll);

	//	changer le src de l'image de la table wifiConfigurationTable en fonction macFilteringEnabled
	var src = jQuery.orange.config.i18n.map["page.myNetwork.wifi.configuration.add."+!macFilteringEnabled+".img"];
	$("#wifiConfigurationTable .table-add-button").setDisabled(!macFilteringEnabled);
}

function wificonfiguration_checkckAll() {

	var MeshEnable = "Device/MESH/Enable";
	jQuery.orange.config.api.crud.read(
			[MeshEnable],
			function (result) {
				MeshEnable = result[MeshEnable].values[MeshEnable];
			});

	var nbAPDevice = 0;
	if(MeshEnable == true){
		var APDevice = "Device/MESH/AccessPoints/AccessPoint[Alias!='GWC']";
		jQuery.orange.config.api.crud.read(
				[APDevice],
				function (result) {
					nbAPDevice = result[APDevice].nb;
				}
		);
	}

	if ($("#boxList input:checked").length > 0){
		$("#WpsWiFiDisabledLabel2").hide();
		$("#WpsWiFiDisabledLabel").hide();
	}else {
		$("#WpsWiFiDisabledLabel").show();
		jQuery.orange.config.api.crud.read(
				["Device/Networks/LAN[@name='LAN']/LANPorts/HotspotWiFiPort/HotspotStatus"],
				function (result) {
					for(r in result["Device/Networks/LAN[@name='LAN']/LANPorts/HotspotWiFiPort/HotspotStatus"].values) {
						if (r != null && result["Device/Networks/LAN[@name='LAN']/LANPorts/HotspotWiFiPort/HotspotStatus"].values[r] == 'ENABLED') { //&& $("#ckAll").checke
							$("#WpsWiFiDisabledLabel2").show();
						}else{
							$("#WpsWiFiDisabledLabel2").hide();
						}
					}
				}
		);
	}

	if ($("#ckAll")[0].getAttribute("checked") == 'checked'){
		var HotspotStatus = "Device/Networks/LAN[@name='LAN']/LANPorts/HotspotWiFiPort/HotspotStatus";
		jQuery.orange.config.api.crud.read(
			[HotspotStatus],
			function (result) {
				for(r in result[dataId].values) {
					if (r != null && status == 'DISABLED') {
						$("#WpsWiFiDisabledLabel").show();
					}else{
						$("#WpsWiFiDisabledLabel").hide();
					}
				}
				
			}
		);
	}else {
		$("#WpsWiFiDisabledLabel").hide();
	}
	
	if ($("#boxList input:checked").length == nbAPDevice+1) {
		$("#ckAll").attr('checked', 'checked');
		$("#ckAll").attr('title', jQuery.orange.config.i18n.map['page.myNetwork.wifi.configuration.activatewifi.all.true.tip']);
	} else {
		$("#ckAll").removeAttr('checked');
		$("#ckAll").attr('title', jQuery.orange.config.i18n.map['page.myNetwork.wifi.configuration.activatewifi.all.false.tip']);
	}

	if ($("#boxList input:checked").length == 0) {
		$("#noWifi").css('display', 'block');
		var wpsEnabled = $("#ActivateWPS")[0].getDataValue();
		if (wpsEnabled) {
			$("#WpsWiFiDisabledLabel").css('display', 'inline');
		} else {
			$("#WpsWiFiDisabledLabel").css('display', 'none');
		}
	} else {
		$("#noWifi").css('display', 'none');
		$("#WpsWiFiDisabledLabel").css('display', 'none');
	}
	wificonfiguration_enableDisableAll();
}

function wificonfiguration_displayWifiScanChannel(element) {
	//if ($("#id"+element+"_autochannelDataValue").attr('checked') == false) {
	if ($("#id"+element+"_autochannelDataValue")[0].checked == false) {
		$("#id"+element+'_wifiChannel').val($("#id"+element+"_channelDataValue").val());
		$("#id"+element+"_wifiAutoChannel").css('display', 'none');
		$("#id"+element+"_wifiAutoChannelScan").css('display', 'none');
	} else {
		$("#id"+element+'_wifiChannel').val('AUTO');
		$("#id"+element+"_wifiAutoChannel").css('display', 'inline');
		$("#id"+element+"_wifiAutoChannelScan").css('display', 'inline-block');
	}
}

function wificonfiguration_displayWifiBoxName(uid,dnsName){
	$("#id"+uid+'_wifiChannelLabel > label').text(jQuery.orange.config.i18n.map["page.myNetwork.wifi.configuration.techparams.channel_mesh"]+ " " + dnsName);
}

function wificonfiguration_wifiChannelValueChange(element, newValue) {
	if (newValue == "AUTO") {
		$("#id"+element+"_autochannelDataValue").attr('checked', 'checked');

		$("#id"+element+"_autochannelDataValue").trigger('valueChange');

		$("#id"+element+"_wifiAutoChannel").css('display', 'inline');
		$("#id"+element+"_wifiAutoChannelScan").css('display', 'inline-block');
	} else {
		$("#id"+element+"_autochannelDataValue").removeAttr('checked');
		$("#id"+element+"_channelDataValue").val(newValue);

		$("#id"+element+"_autochannelDataValue").trigger('valueChange');
		$("#id"+element+"_channelDataValue").trigger('valueChange');

		$("#id"+element+"_wifiAutoChannel").css('display', 'none');
		$("#id"+element+"_wifiAutoChannelScan").css('display', 'none');
	}
}

function wificonfiguration_wifiChannelDoBinds(element) {
	$("#id"+element+'_wifiChannel').bind("valueChange", function(event, newValue) {
		wificonfiguration_wifiChannelValueChange(element, newValue);
	});

	$("#id"+element+"_channelDataValue").bind("change", function(event, newValue) {
		$("#id"+element+'_wifiChannel').val(newValue);
		$("#id"+element+"_wifiAutoChannel").css('display', 'none');
		$("#id"+element+"_wifiAutoChannelScan").css('display', 'none');
	});

	$("#id"+element+"_autochannelDataValue").bind("valueChange", function(event, newValue) {
		wificonfiguration_displayWifiScanChannel(element);
	});

	$("#id"+element+"_wifiAutoChannelScan").bind("click", function() {
		wificonfiguration_autoScan(element);
	});
}

function wificonfiguration_autoScan(element){
	var XAutoScan = "Device/Networks/LAN[@name='LAN']/LANPorts/LANWiFiPort/AutoChannelEnable";
	if(element != "master"){
		XAutoScan = "Device/MESH/AccessPoints/AccessPoint[@uid=\'"+element+"\']/Ports/LANWiFiPort/AutoChannelEnable";
	}
	var id2value = {};
	id2value[XAutoScan] = true;	
	jQuery.orange.config.api.crud.update(id2value, function(){});
}

function wificonfiguration_OperatingStandardsChange(newValue) {
	if (newValue == "BGN") {

		// furthermore, in case c3 was previously set to one on these
		// unavailable modes, it must be reset to WPA/WPA2-Personal (in
		// case of WEP or WPA-Personnal) or WPA/WPA2-Enterprise (in case
		// of WPA-Entreprise).
		var oldSelection = $('#SecurityMode')[0].getDataValue();
		if (   oldSelection == "WEP128"
			|| oldSelection == "WPA_PERSONAL") {
			$('#SecurityMode')[0].setDataValue("WPA_WPA2_PERSONAL");
		} else if (oldSelection == "WPA_ENTERPRISE") {
			$('#SecurityMode')[0].setDataValue("WPA_WPA2_ENTERPRISE");
		}

		// When the mode 802.11b+g+n gets selected, the modes WEP and WPA-* are not available and displayed grayed in the list
		$('#SecurityMode option[i18n$="NONE"]').removeAttr('disabled');
		$('#SecurityMode option[i18n$="WEP128"]').attr('disabled', 'disabled');
		$('#SecurityMode option[i18n$="WPA_PERSONAL"]').attr('disabled', 'disabled');
		$('#SecurityMode option[i18n$="WPA2_PERSONAL"]').removeAttr('disabled');
		$('#SecurityMode option[i18n$="WPA_WPA2_PERSONAL"]').removeAttr('disabled');
		$('#SecurityMode option[i18n$="WPA_ENTERPRISE"]').attr('disabled', 'disabled');
		$('#SecurityMode option[i18n$="WPA2_ENTERPRISE"]').removeAttr('disabled');
		$('#SecurityMode option[i18n$="WPA_WPA2_ENTERPRISE"]').removeAttr('disabled');

	} else {
		$('#SecurityMode option').removeAttr('disabled');
	}

	// Permet de griser les options disabled sur IE7
	grayDisabledOptionsIE7('SecurityMode');
}

function wificonfiguration_SecurityModeChange(newValue) {

	if (newValue == undefined) 
		return;

	//
	if (newValue == "NONE"){
		$('#t16').css('height', '0');
		$('#t16').css('display', 'none');
		$('#t16').css('overflow', 'hidden');
	}else{
		$('#t16').css('height', 'auto');
		$('#t16').css('display', 'block');
		$('#t16').css('overflow', 'visible');
		$('#t16').addClass('forminput');
	}

	// Impact gui pour T10 et T11
	if (newValue == "NONE"
		|| newValue == "WPA_ENTERPRISE"
		|| newValue == "WPA2_ENTERPRISE"
		|| newValue == "WPA_WPA2_ENTERPRISE") {
		// debut contournement bug affichage lors du r�affichage de ces champs, sinon, calcul des marges non prises en comptes.
		$('#t10, #t11').css('height', '0');
		$('#t10, #t11').css('overflow', 'hidden');
		// fin du contournement
		$('#t10, #t11').css('display', 'none');
		$('#t10, #t11').removeClass('forminput');
	} else {
		$('#t10, #t11').css('height', 'auto');
		$('#t10, #t11').css('overflow', 'visible');
		$('#t10, #t11').css('display', 'block');
		$('#t10, #t11').addClass('forminput');
	}


	var radiusItems = $("#radiusserver").add("#radiusport").add("#radiuspassword");

	// Impact gui pour T13 et T14 et T15
	if (newValue == "NONE"
		|| newValue == "WEP128"
		|| newValue == "WPA_PERSONAL"
		|| newValue == "WPA2_PERSONAL"
		|| newValue == "WPA_WPA2_PERSONAL") {
		$('#t13, #t14, #t15').css('height', '0');
		$('#t13, #t14, #t15').css('overflow', 'hidden');
		$('#t13, #t14, #t15').removeClass('forminput');
//		radiusItems.removeAttr('required');
		radiusItems.setDisabled(true);
	} else {
		$('#t13, #t14, #t15').css('height', 'auto');
		$('#t13, #t14, #t15').css('overflow', 'visible');
		$('#t13, #t14, #t15').addClass('forminput');
//		radiusItems.attr('required', 'true');
		radiusItems.setDisabled(false);
	}

	// Impact gui pour la zone WPS
	if (newValue == "NONE"
		|| newValue == "WEP128"
		|| newValue == "WPA_ENTERPRISE"
		|| newValue == "WPA2_ENTERPRISE"
		|| newValue == "WPA_WPA2_ENTERPRISE") {
		if(!$.browser.msie) {
			$('#wpsZone').css('height', '0');
			$('#wpsZone').css('overflow', 'hidden');
			$('#wpsZone').removeClass('border-bottom-1');
			$('#wpsZone').removeClass('padding-20');
		}else{
			$('#wpsZone').css('display','none');
		}
	} else {
		$('#wpsZone').addClass('border-bottom-1');
		$('#wpsZone').addClass('padding-20');
		if(!$.browser.msie) {
			$('#wpsZone').css('height', 'auto');
			$('#wpsZone').css('overflow', 'visible');
		}else{
			$('#wpsZone').css('display','block');
		}

	}

	// Regular expression that allow all ASCII chars
	var asciiRegex = "[A-Za-z0-9\\ \\!\"#\\$%&'\\(\\)\\*\\+\\,\\-\\.\\/:;<=>\\?@\\[\\\\\\]\\^_`\\{\\}\\|~]+";
	// Regular expression that allow exactly 26 hex digits
	var wepHexaRegex = '[0-9a-fA-F]{26}';

	// Impact sur la nature des champs eux m�mes.
	if (newValue == "WEP128") {
		$("#password").attr('regex', wepHexaRegex);
		$("#password").attr('minlength', '0');
		$("#password input").attr('maxlength', '26');
		$("#password").attr('required', 'true');		
		$("#password").attr('i18n', 'page.myNetwork.wifi.configuration.securityparams.wifikey.WEP');
		$("#password").parent().prev().attr('i18n', 'page.myNetwork.wifi.configuration.securityparams.wifikey.WEP');
		$("#password").attr('i18nError', 'page.myNetwork.wifi.configuration.securityparams.wifikey.WEP.error');
		$("#password").parent().parent().orangeParse();
	}
	else if (newValue == "WPA_PERSONAL"
			|| newValue == "WPA2_PERSONAL"
			|| newValue == "WPA_WPA2_PERSONAL") {
		$("#password").attr('regex', asciiRegex);
		$("#password").attr('minlength', '8');
		$("#password input").attr('maxlength', '63');
		$("#password").attr('required', 'true');		
		$("#password").attr('i18n', 'page.myNetwork.wifi.configuration.securityparams.wifikey.WPA');
		$("#password").parent().prev().attr('i18n', 'page.myNetwork.wifi.configuration.securityparams.wifikey.WPA');
		$("#password").attr('i18nError', 'page.myNetwork.wifi.configuration.securityparams.wifikey.WPA.error');
		$("#password").parent().parent().orangeParse();
	}

	$("#password")[0].setDataValue($("#password")[0].dataValueRef);
	$("#radiusserver")[0].setDataValue($("#radiusserver")[0].dataValueRef);
	$("#radiusport")[0].setDataValue($("#radiusport")[0].dataValueRef);
	$("#radiuspassword")[0].setDataValue($("#radiuspassword")[0].dataValueRef);
	$("#radiuspassword").attr('minlength', '8');
	$("#radiuspassword").attr('maxlength', '128');
	$("#radiuspassword").attr('regex', asciiRegex);
	
	// Correctifs pr?par?s pour #595
//	if (newValue == "NONE"
//		|| newValue == "WEP128"
//		|| newValue == "WPA_ENTERPRISE"
//		|| newValue == "WPA2_ENTERPRISE"
//		|| newValue == "WPA_WPA2_ENTERPRISE") {
//	
//		$("#ActivateWPSbyBox")[0].setDataValue(false);
//	}else {
//		
//		$("#ActivateWPSbyBox")[0].setDataValue(true);
//	}

	wificonfiguration_enableDisableAll();
	jQuery.orange.widget.Form.alignFormInputs.call( $("#wifiConfiguration form")[0] );
}

function wificonfiguration_displayWPSElements() {
	var display = $("#ActivateWPS")[0].getDataValue();
	var newValue = $("#WPSMode")[0].getDataValue();

	wificonfiguration_stopTimer();
	if (display) {
		$(".wps").css('display', 'block');
		if (newValue == "MODE_WPS_BUTTON") {
			$("#device_box_pin").hide();
			$("#b6 label").attr('i18n', 'page.myNetwork.wifi.configuration.wps.softpushlabel');
			$("#b6").orangeParse();
			$("#b6").css('height', 'auto');
			$("#b6").css('overflow', 'visible');
			$("#b6").addClass('forminput');
			$("#WPSPassword").parent().parent().css('height', '0');
			$("#WPSPassword").parent().parent().css('overflow', 'hidden');
			$("#WPSPassword").parent().parent().removeClass('forminput');
		} else if (newValue == "MODE_EQP_PIN") {
			$("#device_box_pin").show();
			$("#device_box_pin label").attr('i18n', 'page.myNetwork.wifi.configuration.wps.devicepinlabel');
			$("#device_box_pin").orangeParse();
			$("#device_box_pin").css('padding-bottom', '8px');
			$("#b6").css('height', '0');
			$("#b6").css('overflow', 'hidden');
			$("#b6").removeClass('forminput');
			$("#WPSPassword").parent().parent().css('height', 'auto');
			$("#WPSPassword").parent().parent().css('overflow', 'visible');
			$("#WPSPassword").parent().parent().css('padding-left', '0');
			$("#WPSPassword").parent().parent().css('clear', 'none');
			$("#WPSPassword").parent().parent().addClass('forminput');
			$("#WPSPassword").attr("maxlength", "8");
//			$("#WPSPassword").val("");
			$("#b7").css('display', 'inline-block');
			$("#b8").css('display', 'none');
			$("#WPSPassword").setDisabled(false);
		} if (newValue == "MODE_LIVEBOX_PIN") {
			$("#device_box_pin").show();
			$("#device_box_pin label").attr('i18n', 'page.myNetwork.wifi.configuration.wps.liveboxpinlabel');
			$("#device_box_pin").orangeParse();
			$("#device_box_pin").css('padding-bottom', '8px');
			$("#b6").css('height', '0');
			$("#b6").css('overflow', 'hidden');
			$("#b6").removeClass('forminput');
			$("#WPSPassword").parent().parent().css('height', 'auto');
			$("#WPSPassword").parent().parent().css('overflow', 'visible');
			$("#WPSPassword").parent().parent().css('padding-left', '0');
			$("#WPSPassword").parent().parent().css('clear', 'none');
			$("#WPSPassword").parent().parent().addClass('forminput');
			$("#WPSPassword").removeAttr("maxlength");
//			$("#WPSPassword").val("");
			$("#b7").css('display', 'none');
			$("#b8").css('display', 'inline-block');	
			$("#WPSPassword").setDisabled(true);
		}
	} else {
		$(".wps").css('display', 'none');
	}
	jQuery.orange.widget.Form.alignFormInputs.call( $("#wifiConfiguration form")[0] );
}

var wificonfiguration_timeoutId;
var wificonfiguration_seconds;
function wificonfiguration_updateTimerWPS() {
	if (wificonfiguration_seconds >= 0) {
		$("#InfoDeviceConnecting #timer").empty();
		$("#InfoDeviceConnecting #timer").append(wificonfiguration_seconds+'s...');

		wificonfiguration_timeoutId = setTimeout("wificonfiguration_updateTimerWPS()",1000);
		wificonfiguration_seconds-=1;
	} else {
		// A definir comment savoir si device ajout� ou non.
		var hasBeenAdded=false;
		if(hasBeenAdded){
			wificonfiguration_stopTimer();
			$("#InfoDeviceConnecting").css('display', 'block');
			$("#InfoDeviceConnecting").empty();
			$("#InfoDeviceConnecting").append('<span class="okStatus" i18n="page.myNetwork.wifi.configuration.wps.addingdevicetimeout"/>');
			$("#InfoDeviceConnecting").orangeParse();
			$("#InfoDeviceConnecting").orangeTranslate();
		}else{
			wificonfiguration_stopTimer();
			$("#InfoDeviceConnecting").css('display', 'block');
			$("#InfoDeviceConnecting").empty();
			$("#InfoDeviceConnecting").append('<span class="error" i18n="page.myNetwork.wifi.configuration.wps.wpsBtnfail"/>');
			$("#InfoDeviceConnecting").orangeParse();
			$("#InfoDeviceConnecting").orangeTranslate();			
		}
	}
}

function wificonfiguration_updateTimerB7() {
	if (wificonfiguration_seconds>=0) {
		wificonfiguration_timeoutId = setTimeout("wificonfiguration_updateTimerB7()",1000);
		wificonfiguration_seconds-=1;
	} else {
		wificonfiguration_stopTimer();
		$("#valmsg").remove();
		$("#InfoDeviceConnecting_BoxPin").append('<span class="error" i18n="page.myNetwork.wifi.configuration.wps.addingdevicetimeout"/>');
		$("#InfoDeviceConnecting_BoxPin").orangeParse();
		$("#InfoDeviceConnecting_BoxPin").orangeTranslate();
	}
}

function wificonfiguration_stopTimer() {
	clearTimeout(wificonfiguration_timeoutId);
	$("#InfoDeviceConnecting").empty();
	$("#InfoDeviceConnecting").css('display', 'none');
}

function wificonfiguration_WPSBtnClick() {
	var id2value = {};		
	var WPSMode = $("#WPSModeValue").attr("dataId");
	id2value[WPSMode] = $("#WPSModeValue").val();
	// Update du mode WPS
	jQuery.orange.config.api.crud.update(id2value, function(errors) {
		// Verifie sur l'update est ok
		var isError = false;
		for(var e in errors) {
			if(e != undefined && e == WPSMode) {
				isError = true;
			}
		}

		// Si update OK
		if(!isError) {
			// Lance l'appel RPC
			jQuery.orange.config.api.rpc.startWPS("LAN",function() {
				clearTimeout(wificonfiguration_timeoutId);
				wificonfiguration_seconds = 120;
				$("#InfoDeviceConnecting").css('display', 'block');
				$("#InfoDeviceConnecting").empty();
				$("#InfoDeviceConnecting").append('<span class="orangeStatus" i18n="page.myNetwork.wifi.configuration.wps.timeremaining"/>&#160;<span class="orangeStatus" id="timer"/>');
				$("#InfoDeviceConnecting").orangeParse();
				$("#InfoDeviceConnecting").orangeTranslate();

				wificonfiguration_updateTimerWPS();
			});
		}
	});
}

function wificonfiguration_b7BtnClick() {	
	canSaveWPSPassword = false;
	clearTimeout(wificonfiguration_timeoutId);
	wificonfiguration_seconds = 120;
	$("#InfoDeviceConnecting_BoxPin").css('display', 'block');
	$("#InfoDeviceConnecting_BoxPin").empty();
	if( $("#WPSPassword").val().length == 8 ){
		if( ValidateChecksum($("#WPSPassword").val()) ) {
			canSaveWPSPassword = true;
		}
		else {
			$("#InfoDeviceConnecting_BoxPin").append('<span id="valmsg" class="error" i18n="page.myNetwork.wifi.configuration.wps.errorchecksum"/>');
			$("#InfoDeviceConnecting_BoxPin").orangeParse();
			$("#InfoDeviceConnecting_BoxPin").orangeTranslate();
		}
	}
	else if( $("#WPSPassword").val().length == 4 ) {
		canSaveWPSPassword = true;
	}
	else {
		$("#InfoDeviceConnecting_BoxPin").append('<span id="valmsg" class="error" i18n="page.myNetwork.wifi.configuration.wps.errorpinsize"/>');
		$("#InfoDeviceConnecting_BoxPin").orangeParse();
		$("#InfoDeviceConnecting_BoxPin").orangeTranslate();
	}

	if(canSaveWPSPassword) {
		var id2value = {};		
		var WPSMode = $("#WPSModeValue").attr("dataId");
		var WPSPassword = $("#WPSPassword").attr("dataId");
		id2value[WPSMode] = $("#WPSModeValue").val();
		id2value[WPSPassword] = $("#WPSPassword").val();

		// Trick to reevaluate the modifsOK because the box changes the WPSModeValue in
		// the datamodel and the new value is already present in the GUI. So
		// insert a fake empty value before the box retreive the new one.
		//$("#WPSModeValue").val("");

		// Update du WPSMode et WPSPassword
		jQuery.orange.config.api.crud.update(id2value, function(errors) {
			// Verifie sur l'update est ok
			var isError = false;
			for(var e in errors) {
				if(e != undefined && (e == WPSMode || e == WPSPassword)) {
					isError = true;
				}
			}

			// r��value l'�tat du formulaire global
			$("#WPSModeValue").trigger("change");
			$("#WPSPassword").trigger("valueChange");

			// Si update OK
			if(!isError) {
				$("#InfoDeviceConnecting_BoxPin").append('<span id="valmsg" class="okStatus" i18n="page.myNetwork.wifi.configuration.wps.addingdevice"/>');					
				$("#InfoDeviceConnecting_BoxPin").orangeParse();
				$("#InfoDeviceConnecting_BoxPin").orangeTranslate();

				wificonfiguration_updateTimerB7();
			}
		});
	}
}

function wificonfiguration_btnGeneratePinCodeClick() {
	var id2value = {};		
	var WPSMode = $("#WPSModeValue").attr("dataId");
	id2value[WPSMode] = $("#WPSModeValue").val();
	// Update du WPSMode
	jQuery.orange.config.api.crud.update(id2value, function(errors) {
		// Verifie sur l'update est ok
		var isError = false;
		for(var e in errors) {
			if(e != undefined && e == WPSMode) {
				isError = true;
			}
		}

		// Si update OK
		if(!isError) {
			// Lance l'appel RPC
			jQuery.orange.config.api.rpc.generatePinCode("LAN",setWPSLiveBoxPINCode);
		}
	});
}

function setWPSLiveBoxPINCode(newLBPinCode){
	$("#WPSPassword")[0].setDataValue(newLBPinCode);
}

function wifiConfiguration_tableAddRow(id, attrs) {
	// this = widget node
	var unknown = jQuery.orange.config.i18n.map["page.myNetwork.wifi.configuration.table.unknown"];
	if (id != undefined) {
		// Si les attributs ne sont pas d�finis
		if (attrs.UserFriendlyName == undefined || attrs.IPAddress == undefined || attrs.Active == undefined) {
			// On va chercher si un equipement wifi correspond � l'adresse mac
			var dataId = "Device/Networks/LAN[@name='LAN']/ConnectedDevices/WiFiDevice[PhysAddress='" + attrs.PhysAddress + "']";
			jQuery.orange.config.api.crud.read([dataId], function(result) {
				if(result[dataId] != undefined) {
					for(r in result[dataId].values) {
						var equip = result[dataId].values[r];
						attrs.UserFriendlyName = equip.UserFriendlyName;
						attrs.IPAddress = equip.IPAddress;
						attrs.Active = equip.Active;
					}
				}
			});
		}

		if (attrs.UserFriendlyName == undefined)
			attrs.UserFriendlyName = unknown;
		if (attrs.IPAddress == undefined)
			attrs.IPAddress = unknown;
		if (attrs.Active == undefined)
			attrs.Active = "DISCONNECTED";
	}
	var tr = jQuery.orange.widget.Table.addRow.call(this, id, attrs);
	$(tr).attr("noAutoRefresh", "true");
	// definition getDataValue sur le TD pour la gestion des doublons
	$("td:eq(2)", tr)[0].getDataValue = function(){
		if($("input", this)[0] != undefined) {
			return $("input", this)[0].getDataValue();
		} else {
			return this.dataValueRef;
		}
	};

	if (id != undefined) {
		if (attrs.Active == "CONNECTED") {
			$("td:eq(4)", tr).attr("disabled", "disabled");
			$("td:eq(4)", tr).data("disabled", true);
			$("td:eq(4)", tr).attr("i18n", "page.myNetwork.wifi.configuration.allowed.cantdelete");
			$("td:eq(4)", tr).orangeTranslate();
		} else {
			$("td:eq(4)", tr).attr("i18n", "page.myNetwork.wifi.configuration.allowed.delete");
			$("td:eq(4)", tr).orangeTranslate();
		}
		return tr;
	}
	$("span,img", tr).removeAttr("dataId");
	$("span", tr).html(unknown);
	jQuery.orange.setDataValue($("img", tr)[0], "DISCONNECTED");
	return tr;
}
function wifiConfiguration_addWifiDevice(data){
	var this0 = this;

	var arrayMACAddress = new Array();

	for (var i in data.values) {
		if(data.values[i] != "") {
			arrayMACAddress = data.values[i].split(',');
		}
	}

	var dataId = "Device/Networks/LAN[@name='LAN']/ConnectedDevices/WiFiDevice";
	jQuery.orange.config.api.crud.read([dataId], function(result) {
		var devices = result[dataId];
		var builtData = {nb: data.nb, values: {}, constraints: data.constraints};
		if (devices != undefined) {
			// Ajoute ceux qui sont existants dans la liste des WifiDevice avec les bons dataId
			for (var i in devices.values) {
				var index = arrayIndexOf(arrayMACAddress, devices.values[i].PhysAddress);
				if (index != -1) {				
					builtData.values[i] = {PhysAddress: arrayMACAddress[index], UserFriendlyName: devices.values[i].UserFriendlyName, IPAddress: devices.values[i].IPAddress, Active: devices.values[i].Active};
					arrayMACAddress.splice(index, 1);
				}else{
					if (devices.values[i].PhysAddress != "" && devices.values[i].PhysAddress!= undefined){						
						//arrayMACAddress[arrayMACAddress.length] = devices.values[i].PhysAddress;
						arrayMACAddress.push(devices.values[i].PhysAddress);
					}	
				}
			}
		}

		// Ajoute le reste (ceux qui sont pas pr�sent dans la liste des WifiDevice)
		for (var i=0; i<arrayMACAddress.length; i++) {
			builtData.values[i] = {PhysAddress: arrayMACAddress[i]};
		}

		this0.onDataReadOri(builtData);
	});
}

function wifiConfiguration_tableOnDataRead(data) {	
	// this = widget node
	var this0 = this;

	var arrayMACAddress;
	for (var i in data.values) {
		if(data.values[i] != "") {
			arrayMACAddress = data.values[i].split(',');
		}
	}

	var dataId = "Device/Networks/LAN[@name='LAN']/ConnectedDevices/WiFiDevice";
	jQuery.orange.config.api.crud.read([dataId], function(result) {
		var devices = result[dataId];
		var builtData = {nb: data.nb, values: {}, constraints: data.constraints};
		var unknown = jQuery.orange.config.i18n.map["page.myNetwork.wifi.configuration.table.unknown"];

		if (devices != undefined) {
			// Ajoute ceux qui sont existants dans la liste des WifiDevice avec les bons dataId
			for (var i in devices.values) {
				var index = arrayIndexOf(arrayMACAddress, devices.values[i].PhysAddress);
				if (index != -1) {				
					builtData.values[i] = {PhysAddress: arrayMACAddress[index], UserFriendlyName: devices.values[i].UserFriendlyName, IPAddress: devices.values[i].IPAddress, Active: devices.values[i].Active};
					arrayMACAddress.splice(index, 1);
				}
			}
		}

		// Ajoute le reste (ceux qui sont pas pr�sent dans la liste des WifiDevice)
		for (var i=0; i<arrayMACAddress.length; i++) {
			builtData.values[i] = {PhysAddress: arrayMACAddress[i]};
		}

		this0.onDataReadOri(builtData);
	});
}

function wifiConfiguration_formGetActions(crudAction) {	

	var retActions = new Array();
	var dataIdToUpdate = $(this).parent().attr("dataid");
	var arrayMACAddress;

	jQuery.orange.config.api.crud.read([dataIdToUpdate], function(result) {
		for(r in result[dataIdToUpdate].values) {
			var oldValue = result[dataIdToUpdate].values[r];			
			arrayMACAddress = oldValue.split(',');
			break;
		}
	});		

	for(var i = 0 ; i<$("#wifiConfigurationTable tr").length-1;i++){
		var addressMac = $("td:eq(" + i + ").table-col-2")[0].getDataValue();	
		var index = arrayIndexOf(arrayMACAddress, addressMac);
		if (index == -1) {		
			//arrayMACAddress[arrayMACAddress.length] = addressMac;
			arrayMACAddress.push(addressMac);
		}
	}

	var actions = this.getActionsOri(crudAction);

	// Cas ou il y a un doublon
	if(actions === false)
		return false;

	for(a in actions) {
		if(actions[a].crud == "delete") {
			var addrToRemove = actions[a].node.dataValueRef.PhysAddress;			
			for (var i=0; i<arrayMACAddress.length; i++) {
				if(arrayMACAddress[i] == addrToRemove) {
					arrayMACAddress[i] = "";
				}
			}
		} else if(actions[a].crud == "create") {
			// V�rifie la limite de nombre de ligne
			if( $("table tbody tr", this).size() > TABLE_MAX_MACADDRESS_FILTER) {
				var widget = this.parentNode;
				jQuery.orange.errorMsgKey("tablefull", widget);
				$(widget).removeClass("errorInput");
				var parentform = getFirstParentWithNodeName(widget, "FORM");
				jQuery.orange.widget.Form.setButtonsDisabled.call(parentform, jQuery.orange.widget.Form.STATE_KO);
				return false;
			}
			var addrToAdd = actions[a].attrs.PhysAddress;
			var index = arrayIndexOf(arrayMACAddress, addrToAdd);
			if (index == -1) {		
				arrayMACAddress[arrayMACAddress.length] = addrToAdd;
			}			
		}
	}


	var newAllowedMACAddresses = "";
	for (var i=0; i<arrayMACAddress.length; i++) {
		if(arrayMACAddress[i] != "") {
			newAllowedMACAddresses +=  arrayMACAddress[i] + ",";
		}
	}
	newAllowedMACAddresses = newAllowedMACAddresses.substring(0, newAllowedMACAddresses.length-1);
	//.toLowerCase();

	// This is a trick: the engine needs absolutely a node to work on. But for MAC addresses, there
	// is no node, just a table
	var node = $("#DummyNode")[0];

	retActions.push({
		id: dataIdToUpdate,
		crud: "update",
		node: node,
		value: newAllowedMACAddresses
	});

	return retActions;
}

function wifiConfiguration_formCrudCallback() {
	var widget = this.parentNode;

	for(var n in this.addPending) {
		var node = this.addPending[n];
		var attrs = {PhysAddress: $("[dataid='PhysAddress']", node).val().toLowerCase()};
		var result = {id: 1};				
		var tr = widget.addRow(result.id, attrs);
		$(node).after(tr).remove();
	}
	this.addPending = [];

	for(var n in this.deletePending) {
		var node = this.deletePending[n];
		var tbody = node.parentNode;
		tbody.removeChild(node);
	}
	this.deletePending = [];
}

jQuery.orange.config.areacontent.wifiConfiguration = {
	preParse: function() {
		var RouterName = "Device/DeviceInfo/RouterName";
		jQuery.orange.config.api.crud.read(
			[RouterName],
			function (result) {
				$("#boxList").append('<span i18nPrefix="page.myNetwork.wifi.configuration.activatewifi.masterlb" widgetType="Checkbox" widgetArg="[false, true]" dataId="Device/Networks/LAN[@name=\'LAN\']/LANPorts/LANWiFiPort/Enable"/><span>'+result[RouterName].values[RouterName]+'</span>');
				$("#boxList").append('&#160;&#160;');
			}
		);
		var MeshEnable = "Device/MESH/Enable";
		jQuery.orange.config.api.crud.read(
			[MeshEnable],
			function (result) {
				MeshEnable = result[MeshEnable].values[MeshEnable];
			});

		$("#boxList").addClass("hidden");
		$("#multiBox").addClass("hidden");
		if(MeshEnable == true){
			var APDevice = "Device/MESH/AccessPoints/AccessPoint[Alias!='GWC']";
			jQuery.orange.config.api.crud.read(
				[APDevice],
				function (result) {
					nbAPDevice = result[APDevice].nb;
					if (result[APDevice].nb > 0) {
						for (var box in result[APDevice].values) {
							var uid = result[APDevice].values[box]["uid"];
							var RouterName = "Device/MESH/AccessPoints/AccessPoint[@uid='"+uid+"']/DeviceInfo/RouterName";
							jQuery.orange.config.api.crud.read(
								[RouterName],
								function (result) {
									for(var routername in result[RouterName].values){
										$("#boxList").append('<span widgetType="Checkbox" widgetArg="[false, true]" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANWiFiPort/Enable" i18nPrefix="page.myNetwork.wifi.configuration.activatewifi.meshlb"/><span>'+result[RouterName].values[routername]+'</span>');
										$("#boxList").append('&#160;&#160;');

										var channelSelection = "";
										channelSelection += '<div id="id'+uid+'_wifiChannelLabel" class="desactivable w100px" widgetType="FormInput" i18n="page.myNetwork.wifi.configuration.techparams.channel_mesh">';
										channelSelection += '<select id="id'+uid+'_wifiChannel">';
										channelSelection += '<option value="AUTO">Auto</option>';
										channelSelection += '<option value="1">1</option>';
										channelSelection += '<option value="2">2</option>';
										channelSelection += '<option value="3">3</option>';
										channelSelection += '<option value="4">4</option>';
										channelSelection += '<option value="5">5</option>';
										channelSelection += '<option value="6">6</option>';
										channelSelection += '<option value="7">7</option>';
										channelSelection += '<option value="8">8</option>';
										channelSelection += '<option value="9">9</option>';
										channelSelection += '<option value="10">10</option>';
										channelSelection += '<option value="11">11</option>';
										channelSelection += '<option value="12">12</option>';
										channelSelection += '<option value="13">13</option>';
										channelSelection += '</select>';
										channelSelection += '<span class="wifiAutoChannel" id="id'+uid+'_wifiAutoChannel" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANWiFiPort/Channel"/>';
										channelSelection += '<div widgetType="ButtonContainer" class="inline">';
										channelSelection += '<span id="id'+uid+'_wifiAutoChannelScan" widgetType="ButtonImage" i18n="page.myNetwork.wifi.configuration.techparams.scan"/>'; // widgetType="Button" widgetArg="{type: \'simple\'}"
										channelSelection += '</div>';
										channelSelection += '<input style="display:none" id="id'+uid+'_channelDataValue" type="text" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANWiFiPort/Channel"/>';
										channelSelection += '<input style="display:none" id="id'+uid+'_autochannelDataValue" type="checkbox" dataId="Device/MESH/AccessPoints/AccessPoint[@uid=\''+uid+'\']/Ports/LANWiFiPort/AutoChannelEnable"/>';
										channelSelection += '</div>';
										$("#meshChannel").append(channelSelection);
									}
								}
							);	
						}
						$("#boxList").removeClass("hidden");
						$("#multiBox").removeClass("hidden");
					}
				}
			);
		} else {
			$("#boxList").removeClass("hidden");
			$("#multiBox").addClass("hidden");			
		}
	},
	postParse: function() {
		// TODO JALIZIER Mettre plutot un widget cach� pour lire/ecrire cette valeur
		var HotSpotWiFiPortEnableValue = false;
		var HotSpotWiFiPortEnable = "Device/Networks/LAN[@name='LAN']/LANPorts/HotspotWiFiPort[@Name='Hotspot']/Enable";
		jQuery.orange.config.api.crud.read(
			[HotSpotWiFiPortEnable],
			function (result) {
				for(resultValue in result[HotSpotWiFiPortEnable].values){
					console.log(result[HotSpotWiFiPortEnable].values[resultValue]["Enable"]);
					HotSpotWiFiPortEnableValue = result[HotSpotWiFiPortEnable].values[resultValue];
				}
			});

		//$("#boxList input").click(function(event) {
		$("#boxList input").bind('change', function(event) {
			if (! $(this).attr("checked")) {
				if(HotSpotWiFiPortEnableValue){
					$("#noWifiHotspot").css('display', 'block');
				}
			} else {
				$("#noWifiHotspot").css('display', 'none');
			}
		});

		$("#wifiConfiguration form").bind("reset", function() {
			$("#noWifiHotspot").css('display', 'none');
		});

		$("#boxList").bind("valueChange", function(event, newValue) {
			wificonfiguration_checkckAll();
		});

		$('#ckAll').bind("change", function(event, newValue) {
			if (newValue) {
				$("#boxList input").each(function() {
					$(this).removeAttr('disabled');
					$(this).attr('checked', 'checked');
					$(this).trigger("change", [true]);
				});
			} else if(newValue!=undefined) {
				$("#boxList input").each(function() {
					$(this).removeAttr('checked');
					$(this).attr('disabled', 'disabled');
					$(this).trigger("change", [false]);
				});
			}
		});
		if($('#ckAll').attr('checked')){
			$('#ckAll').attr('title', jQuery.orange.config.i18n.map["page.myNetwork.wifi.configuration.activatewifi.all.true.tip"]);
		}else{
			$('#ckAll').attr('title', jQuery.orange.config.i18n.map["page.myNetwork.wifi.configuration.activatewifi.all.false.tip"]);
		}

		$('#ckKeyReadable').bind("change", function(event, newValue) {
			if (newValue != undefined)
				$("#password")[0].mask(! newValue);
		});



		wificonfiguration_wifiChannelDoBinds("master");

		var MeshEnable = "Device/MESH/Enable";
		jQuery.orange.config.api.crud.read(
			[MeshEnable],
			function (result) {
				MeshEnable = result[MeshEnable].values[MeshEnable];
			});

		if(MeshEnable == true){
			var APDevice = "Device/MESH/AccessPoints/AccessPoint[Alias!='GWC']";
			jQuery.orange.config.api.crud.read(
				[APDevice],
				function (result) {
					nbAPDevice = result[APDevice].nb;
					if (result[APDevice].nb > 0) {
						for (var box in result[APDevice].values) {
							var uid = result[APDevice].values[box]["uid"];
							wificonfiguration_wifiChannelDoBinds(uid);

							var RouterName = "Device/MESH/AccessPoints/AccessPoint[@uid='"+uid+"']/DeviceInfo/RouterName";
							jQuery.orange.config.api.crud.read(
								[RouterName],
								function (result) {
									$("#id"+uid+"_wifiChannel").parent().prev().append(" "+result[RouterName].values[RouterName]);
								}
							);
						}
					}
				}
			);
		}

		
		var table = $("#wifiConfigurationTable")[0];
		table.onDataReadOri = table.onDataRead;
		table.onDataRead = wifiConfiguration_tableOnDataRead;
		table.addRow = wifiConfiguration_tableAddRow;
		var form = $("form", table)[0];
		form.getActionsOri = form.getActions;
		form.getActions = wifiConfiguration_formGetActions;
		form.crudCallback = wifiConfiguration_formCrudCallback;
		
		// Bind sur le changement de "Activer le filtrage d'adresses MAC"
		$("#MACAddressControlEnabled2").bind("valueChange change", function(event, newValue) {
			wificonfiguration_enableDisableAll();		
			if(newValue == false){
				table.onDataRead = wifiConfiguration_addWifiDevice ;
			}
		});

		// Bind sur le changement de "Mode de s�curite"
		$('#SecurityMode').bind("change", function(event, newValue) {
			wificonfiguration_SecurityModeChange(newValue);
		});

		// Bind sur le changement de "Mode" (BG, BGN)
		$('#OperatingStandards').bind("change", function(event, newValue) {
			wificonfiguration_OperatingStandardsChange(newValue);
		});

		// Binding aller/retour entre la valeur du datamodel WPSMode et les deux composants de l'IHM
		// DataModel -> IHM
		$("#WPSModeValue").bind('valueChange', function(event) {

			var newValue = $("#WPSModeValue")[0].getDataValue();
			if (newValue.startsWith("SOFTPUSH")) {
				$("#WPSMode")[0].setDataValue("MODE_WPS_BUTTON");
			} else if (newValue.startsWith("ENROLLEEPIN")) {
				$("#WPSMode")[0].setDataValue("MODE_EQP_PIN");
			} else if (newValue.startsWith("GATEWAYPIN")) {
				$("#WPSMode")[0].setDataValue("MODE_LIVEBOX_PIN");
			}

			if (newValue.endsWith("_HWPUSH")) {
				$("#ActivateWPSbyBox")[0].setDataValue(true);
			} else {
				$("#ActivateWPSbyBox")[0].setDataValue(false);
			}

		});

		// IHM -> datamodel		
		function wpsGui2Datamodel(event) {
			var wpsActivateWPSbyBox = $("#ActivateWPSbyBox")[0].getDataValue();
			var wpsMode = $("#WPSMode")[0].getDataValue();			
			var newDataModelValue = "";		
			switch (wpsMode) {
			case "MODE_WPS_BUTTON": newDataModelValue = "SOFTPUSH"; break;
			case "MODE_EQP_PIN": newDataModelValue = "ENROLLEEPIN"; break;
			case "MODE_LIVEBOX_PIN": newDataModelValue = "GATEWAYPIN"; break;
			}
			if (wpsActivateWPSbyBox) {
				newDataModelValue += "_HWPUSH";
			}				

			$("#WPSModeValue")[0].setDataValue(newDataModelValue);
		}

		$("#WPSMode").bind("change", wpsGui2Datamodel);
		$("#ActivateWPSbyBox").bind("change", wpsGui2Datamodel);
		$("#WPSMode").bind("valueChange", wpsGui2Datamodel);
		$("#ActivateWPSbyBox").bind("valueChange", wpsGui2Datamodel);

		// Synchonize the check/unchek of the checkbox upon
		$("#ActivateWPSbyBox").bind("valueChange", function(event, newValue) {
			if (newValue) {
				$("#WPSMode")[0].setDataValue("MODE_WPS_BUTTON");
			}
		});

		// Bind the visibility of WPS widgets
		$("#WPSModeValue").bind('valueChange change', function(event) {
			wificonfiguration_displayWPSElements();			
		});


		$("#ActivateWPS").bind("change valueChange", function(){			
			var wpsEnabled = $("#ActivateWPS")[0].getDataValue();
			wificonfiguration_displayWPSElements();
			if(wpsEnabled){
				$("#MACAddressControlEnabled2")[0].setDataValue(false);
			}
			wificonfiguration_enableDisableAll();

		});

		// Bind of some business rules (c4 in the specs) :
		//		When the user selects Soft Push Button in c4, cb4 gets checked
		//		When the user selects Device PIN Code in c4,�cb4 gets unchecked (if checked)
		//		When the user selects Livebox PIN Code in c4, cb4 gets unchecked (if checked)
		$("#WPSMode").bind("change", function() {
			var wpsMode = $("#WPSMode")[0].getDataValue();
			if (wpsMode == "MODE_WPS_BUTTON") {
				$("#ActivateWPSbyBox")[0].setDataValue(true);
			} else if (wpsMode == "MODE_EQP_PIN") {
				$("#ActivateWPSbyBox")[0].setDataValue(false);
			} else if (wpsMode == "MODE_LIVEBOX_PIN") {
				$("#ActivateWPSbyBox")[0].setDataValue(false);
			}
		});

		//mettre i18n pour le bottom table		
		$("#wifiConfigurationTable .table-add-button img").attr('i18n', 'page.myNetwork.wifi.configuration.add');
		$("#wifiConfigurationTable .table-add-button").orangeParse();
	},

	postLoad: function() {

		$("#help").bind("click",function() {
			helpPopup("html/main/help_wifiConfiguration.html");
		});

		if(!$("#multiBox").hasClass("hidden")){
			$("#boxList label").css('visibility','hidden');
		}

		if ($("#boxList input:checked").length == 0)
			$("#noWifi").css('display', 'block');

		wificonfiguration_checkckAll();
		wificonfiguration_displayWifiScanChannel("master");

		var MeshEnable = "Device/MESH/Enable";
		jQuery.orange.config.api.crud.read(
			[MeshEnable],
			function (result) {
				MeshEnable = result[MeshEnable].values[MeshEnable];
			});

		if(MeshEnable == true){
			var APDevice = "Device/MESH/AccessPoints/AccessPoint[Alias!='GWC']";
			jQuery.orange.config.api.crud.read(
				[APDevice],
				function (result) {
					nbAPDevice = result[APDevice].nb;
					if (result[APDevice].nb > 0) {
						nbAPDevice = result[APDevice].nb;
						if (result[APDevice].nb > 0) {
							$("#ckAll > span > input")[0].setAttribute('checked', 'checked');
							for (var box in result[APDevice].values) {
								var DNSName = result[APDevice].values[box]["DNSName"];
								var uid = result[APDevice].values[box]["uid"];
								wificonfiguration_displayWifiScanChannel(uid);
								wificonfiguration_displayWifiBoxName(uid,DNSName);
							}
						}
						else {
							$("#ckAll > span > input")[1].setAttribute('checked', 'checked');
						}
					}
				}
			);
		}
			
		var elem = $("#ckAll > span:first");
		var pere = $("#ckAll > span").parent();
		elem.remove();
		elem.appendTo(pere);

		var HotspotSSID = $("#hotspotSSID").val();
		if (HotspotSSID != "") {
			var lbname_tip = jQuery.orange.config.i18n.map["page.myNetwork.wifi.configuration.techparams.lbname.tip"];
			lbname_tip = lbname_tip.replace("HotspotWiFiPortSSID", HotspotSSID);
			$(".desactivable input:eq(0)").attr('title', lbname_tip);
			$(".desactivable input:eq(0)").parent().prev().attr('title', lbname_tip);

			// test de non equivalance SSID hotspot et lan
			$("#lanSSID").bind('keyup change',function(){
				var form = $("#wifiConfiguration form")[0];

				var currentlanSSIDNode = $("#lanSSID");
				var currentlanSSID = $("#lanSSID")[0].getDataValue();

				if(currentlanSSID == HotspotSSID && jQuery.orange.widget.Form.verifyConstraints(currentlanSSIDNode[0])) {					
					$("#identicalSSIDerror").css('display', 'inline');
					currentlanSSIDNode.addClass('supErrorInput');

					var oldState = jQuery.orange.widget.Form.getState.call(form);
					form.dataKO.push(currentlanSSIDNode);

					var newState = jQuery.orange.widget.Form.getState.call(form);
					if (newState != oldState){
						jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
					}
				}else if(currentlanSSID != HotspotSSID){
					$("#identicalSSIDerror").css('display', 'none');
					var oldState = jQuery.orange.widget.Form.getState.call(form);

					if(jQuery.orange.widget.Form.verifyConstraints(currentlanSSIDNode[0])){
						currentlanSSIDNode.removeClass('supErrorInput');
						form.dataKO.splice(arrayIndexOf2(form.dataKO, currentlanSSIDNode), 1);
					}

					var newState = jQuery.orange.widget.Form.getState.call(form);
					if (newState != oldState){
						jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
					}
				}
			});
		}

		// Pour r�aligner les �lements du formulaire
//		$("#wifiConfiguration form")[0].onParse();

		// Mise en place des tooltip sur "Canal"
		$("#master_wifiChannel").attr('title', jQuery.orange.config.i18n.map["page.myNetwork.wifi.configuration.techparams.channel.tip"]);

		// Mise en place des tooltip sur "Canal pour..."
		$("#meshChannel select").each(function() {
			$(this).attr('title', jQuery.orange.config.i18n.map["page.myNetwork.wifi.configuration.techparams.channel.tip"]);
		});

		// Bind sur le changement de "Mode" WPS
		$('#WPSMode').bind("change", function(event) {
			$("#InfoDeviceConnecting_BoxPin").css('display', 'none');
			jQuery.orange.widget.Form.alignFormInputs.call( $("#wifiConfiguration form")[0] );
		});

		// Tooltip du bouton Ajouter et PUSH pour la partie WPS
		$("#b7").attr('title', jQuery.orange.config.i18n.map["page.myNetwork.wifi.configuration.wps.add.tip"]);
		$(".wpsBtn").attr('title', jQuery.orange.config.i18n.map["page.myNetwork.wifi.configuration.wps.wpsBtn.tip"]);

		// Bind sur le clic sur WPS Button
		$(".wpsBtn").bind("click", function(event) {
			//jQuery.orange.config.api.rpc.startWPS("LAN",wificonfiguration_WPSBtnClick);
			wificonfiguration_WPSBtnClick();
		});

		// Bind sur le clic sur b7 --> associer selon Device PIN code.
		$("#b7").bind("click", function(event) {
			wificonfiguration_b7BtnClick();
		});

		// Bind sur le clic sur B8 --> generer un Livebox PIN code.
		$("#b8").bind("click", function(event) {
			wificonfiguration_btnGeneratePinCodeClick();
		});

		// Tooltip du bouton Ajouter pour le tableau filtrage d'adresses MAC
		$("#wifiConfigurationTable .table-add-button input").attr('title', jQuery.orange.config.i18n.map["page.myNetwork.wifi.configuration.allowed.add.tip"]);

		$("#password input").css('width', 'auto');
		$("#password input").attr('size', '38');
		$("#password").bind('paste',function(){
			$("#password").trigger('valueChange');
		});


		$("#WPSPassword").bind("keyup", function() {
			$("#valmsg").remove();
		});

		$("#wifiConfiguration form")[0].crudCallDelegate = function(crudExec) {

			var id2value = {};		

			var ActivateWPS = $("#ActivateWPS").attr("dataId");
			id2value[ActivateWPS] = $("#ActivateWPS")[0].getDataValue();

			var MACAddressControlEnabled2 = $("#MACAddressControlEnabled2").attr("dataId");
			id2value[MACAddressControlEnabled2] = $("#MACAddressControlEnabled2")[0].getDataValue();
			// Update du mode WPSEnable & MACAddressControlEnabled
			jQuery.orange.config.api.crud.update(id2value, function(errors) {
				// Verifie sur l'update est ok
				for(var e in errors) {
					if(e != undefined && ( e == ActivateWPS || e == MACAddressControlEnabled2)) {
						alert("wificonfiguration.js: "+ e);
					}
				}
			});
			
			crudExec();
		};
		
		wificonfiguration_SecurityModeChange($('#SecurityMode')[0].getDataValue());
		$("#wifiConfigurationTableErr").insertAfter($("#wifiConfigurationTable table"));
		
		// mettre le radio boutton sur le m�me alignement vertical avec les autres radio bouttons
		jQuery.orange.widget.Form.alignFormInputs.call( $("#wifiConfiguration form")[0] );
	}
	
};