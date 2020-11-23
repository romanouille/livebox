jQuery.orange.config.areacontent.customEquipmentTHD = {
		postParse: function() {
			var XpathDevice = $('#customEquipmentTHD span:eq(0)').text();
			var url = $('#customEquipmentTHD span:eq(1)').text();


			var Rooms = "Device/UserInterface/Rooms/Room";
			jQuery.orange.config.api.crud.read(
					[Rooms],
					function (result) {
						if(result[Rooms].nb == 0) {
							$("#location").replaceWith($('<span/>').attr('i18n', 'page.myEquipments.userEquipment.filtre.location.none'));
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

			$("#btnEject").click(function(){			
				openConfirmationPopup('popup.eject.title', 'popup.eject.text',
						function() {
					jQuery.orange.config.api.rpc.eject(
							false,
							XpathDevice,
							function(error, reply) {
								// TODO vérifier code erreur et afficher la popup correspondante
								//openErrorPopup('popup.ejectinuse.title', 'popup.ejectinuse.text');
								openErrorPopup();
							}
					);
				});			
			});
		},
		postLoad: function() {
			var XpathDevice = $('#customEquipmentTHD span:eq(0)').text();
			
			$("#help").bind("click",function() {
				helpPopup("html/main/help_customEquipmentTHD.html");
			});

			var url = $('#customEquipmentTHD span:eq(1)').text();

			var Icons = XpathDevice+"/Icon";
			jQuery.orange.config.api.crud.read(
					[Icons],
					function (result) {
						if(result[Icons].values[Icons] == undefined || result[Icons].values[Icons] == "" || result[Icons].values[Icons] == null ) {
							if(url!=null){
//							$("#equicon")[0].setDataValue(url);
//							}else{
							$("#equicon")[0].setDataValue("ico_devices_livephone.png");
							}						
							$("#equicon").orangeParse();

							var form = $("#customEquipmentTHD form")[0];
							var oldState = jQuery.orange.widget.Form.getState.call(form);
							form.dataKO=[];
							form.modifsOK=[];
							var newState = jQuery.orange.widget.Form.getState.call(form);
							if (newState != oldState){
								jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
							}
						}
					});

			$("#btnBack").bind('click', function() {
				jQuery.orange.widget.MenuItem.setCurrent('m3.m31.m310');
			});

			//Suppression 
			$("#btnDelete").click(function(){
				openConfirmationPopup('popup.deletedevice.title', 'popup.deletedevice.text', function() {
					jQuery.orange.config.api.rpc.unpair(XpathDevice,function(result){
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
			
			var name = XpathDevice + "/Name";
			
			jQuery.orange.config.api.crud.read(
					[name],
					function (result) {
						if(result[name].values[name] != undefined){
							$("#phoneName").val(result[name].values[name]);
						}
					});
			$("select", "#selectType")[0].disabled = true;
			$("select", "#selectType")[0].selectedIndex = 2;
			
			// Save Action
			$("#btnSave").click(function(){
				var id2value = {};
				id2value[name] = $("#phoneName").val();
				jQuery.orange.config.api.crud.update(id2value, function() {
					// Display Saved Popup for 4s
					$("#saved_popup").dialog('open');
					setTimeout("$('#saved_popup').dialog('close')", 4000);
				});
			});
			
			// Disable "Location" SelectBox if it exists.
//			var locDiv = $("select", "#location")[0];
//			if (locDiv != undefined) {
//				locDiv.disabled = true;
//			}
		}
};