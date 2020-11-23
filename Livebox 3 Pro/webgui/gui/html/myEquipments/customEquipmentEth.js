jQuery.orange.config.areacontent.customEquipmentEth = {
	postParse: function() {
		var XpathDevice = $('#customEquipmentEth span:eq(0)').text();
		var i18n_title = $('#customEquipmentEth span:eq(1)').text();
		var XpathRouter = $('#customEquipmentEth span:eq(2)').text();
		var i18n_subtilte = $('#customEquipmentEth span:eq(3)').text();
		var url = $('#customEquipmentEth span:eq(4)').text();
		$("#content").data("title", i18n_title);
		$("#content").data("XpathRouter",XpathRouter);
		$("#content").data("i18n_subtilte",i18n_subtilte);
		$("#content").data("url",url);
		
		var Rooms = "Device/UserInterface/Rooms/Room";
		jQuery.orange.config.api.crud.read(
			[Rooms],
			function (result) {
				if(result[Rooms].nb == 0) {
					//$("#location").replaceWith($('<span/>').attr('i18n', 'page.myEquipments.userEquipment.filtre.location.none'));
				}
				else {
					var enum0 = "", room;
					for (room in result[Rooms].values) {
							enum0 += "'"+result[Rooms].values[room]["Name"]+"',";
					}
					enum0 = enum0.substr(0, enum0.length-1);
					$("#location").replaceWith('<span id="location" widgetType="EnumInput" widgetArg="\'select\'" dataId="'+XpathDevice+'/Location" enumerated="['+enum0+']" i18n="page.myEquipments.customEquipmentEth.config.location"/>');
				}
			});
		
		$("#location").parent().orangeParse();
	},
	postLoad: function(){	
		
		var isMine = false;
		//TODO Adapt isMine when find howto retreive local ip from browser
		if(isMine){
			$("#blacklisted").setDisabled(true);
		}
		
		var XpathDevice = $('#customEquipmentEth span:eq(0)').text();
		var url = $('#customEquipmentEth span:eq(4)').text();
		var Icons = XpathDevice+"/Icon";		
		var i18n_title = $('#customEquipmentEth span:eq(1)').text();
		
		$("#help").bind("click",function() {
			  if(i18n_title == "page.myEquipments.customEquipmentEth.title"){
				 // helpPopup("html/main/help_customEquipment.html?equipment= Ethernet ");
				  helpPopup("html/main/help_customEquipmentEth.html")
			  }else{
				  helpPopup("html/main/help_customEquipmentWifi.html");
				  //helpPopup("html/main/help_customEquipment.html?equipment= WiFi ");
			  }
			
		});
		
		jQuery.orange.config.api.crud.read(
				[Icons],
				function (result) {
					if(result[Icons].values[Icons] == undefined
							|| result[Icons].values[Icons] == ""
								|| result[Icons].values[Icons] == null ) {
						if(url!=null && url != ""){
							$("#equicon")[0].setDataValue(url);
						}else{
							$("#equicon")[0].setDataValue("ico_devices_desktop.png");
						}
						$("#equicon").orangeParse();
						
						var form = $("#customEquipmentEth form")[0];
						var oldState = jQuery.orange.widget.Form.getState.call(form);
						form.dataKO=[];
						form.modifsOK=[];
						var newState = jQuery.orange.widget.Form.getState.call(form);
						if (newState != oldState){
							jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
						}
					}
				});

		$("#customEquipmentEth form")[0].crudCallDelegate = function(crudExec) {
			crudExec();
			if( !$("#ckBlacklisted")[0].getDataValue() ){
				$("#restrictions").empty();
				$("#restrictions").append('<a id="linktorestrictions" href="javascript:;" class="orange" i18n="page.myEquipments.customEquipmentEth.inetaccess.restrictions.link" widgettype="MenuItem" widgetarg="{menu: \'m3.m31.m314\', subst: {XrestrictedDevice: \''+XpathDevice.replace(/\'/g,"\\\'")+'\'}}"></a>');
			}else{
				$("#restrictions").empty();
				$("#restrictions").append('<span class="disabled" i18n="page.myEquipments.customEquipmentEth.inetaccess.restrictions.link"/>');				
			}
			$("#restrictions").orangeParse();
		};
		
		$("#btnBack").bind('click', function() {
			jQuery.orange.widget.MenuItem.setCurrent('m3.m31.m310');
		});
		
		//Suppression 
		$("#btnDelete").click(function(){
			openConfirmationPopup('popup.deletedevice.title', 'popup.deletedevice.text',
				function() {
					jQuery.orange.config.api.crud.del(XpathDevice,function(result){
						jQuery.orange.widget.MenuItem.setCurrent('m3.m31.m310');
					});
				});	
		});
		
		$("#connectionstatuslabel").bind('change',function(){
			// grisé ou dégrisé le buton suppression
			var valueInForm = $("#connectionstatuslabel")[0].getDataValue();
			if(valueInForm == "CONNECTED"){
				$("#btnDelete").setDisabled(true);
			}else{
				$("#btnDelete").setDisabled(false);
			}
		});
		$("#connectionstatuslabel").trigger("change");
		
		$("#ckBlacklisted").bind('change', function(event, newvalue) {
			if(newvalue == undefined){
				newvalue = $("#ckBlacklisted")[0].getDataValue();
			}
			var isBlacklisted = newvalue;
			var wasBlacklisted = $("#ckBlacklisted")[0].dataValueRef;
			if(isBlacklisted != undefined) {
				if(isBlacklisted) {
					$("#restrictions").empty();
					$("#restrictions").append('<span class="disabled" i18n="page.myEquipments.customEquipmentEth.inetaccess.restrictions.link"/>');
				}else if (!isBlacklisted && (isBlacklisted == wasBlacklisted) ){
					$("#restrictions").empty();
					$("#restrictions").append('<a id="linktorestrictions"  class="orange" href="javascript:;" i18n="page.myEquipments.customEquipmentEth.inetaccess.restrictions.link" widgettype="MenuItem" widgetarg="{menu: \'m3.m31.m314\', subst: {XrestrictedDevice: \''+XpathDevice.replace(/\'/g,"\\\'")+'\'}}"></a>');
				}
				$("#restrictions").orangeParse();
			}
		});
		$("#ckBlacklisted").trigger('change');

		if((navigator.appName == 'Microsoft Internet Explorer') && (navigator.appName.indexOf("Explorer") >= 0) && (getInternetExplorerVersion()==8)) {
			// For IE8 don't add any accessibility tags because it empties the table
		} else {
			// Accessibilit�: am�nagement local(danhs la page concern�e) du widget EnumInput qui ne s'adapte pas aux contraintes d'acc�ssibilit�s
			$("<thead style=\"display:none;\">" +
					"<tr>" +
						"<th i18n=\"page.myEquipments.customEquipmentEth.selecteur.back\"></th>" +
						"<th i18n=\"page.myEquipments.customEquipmentEth.selecteur.icon\"></th>" +
						"<th i18n=\"page.myEquipments.customEquipmentEth.selecteur.next\"></th>" +
					"</tr>" +
				"</thead>").prependTo("#equicon>table");
			$("#equicon>table").attr("summary", "");
			$("#equicon>table").attr("widgetType", "I18nable");
			$("#equicon>table").attr("widgetArg", "{I18nable: {attribute: 'summary', i18n: 'page.myEquipments.customEquipmentEth.selecteur.summary'} }");
			$("<caption style='display:none' i18n='page.myEquipments.customEquipmentEth.selecteur.caption'/>").prependTo("#equicon>table");
			$("#equicon").orangeParse();
			$("#equicon").orangeTranslate();
		}
	}
};