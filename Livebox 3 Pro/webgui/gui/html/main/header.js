function header_displayPopup(callback) {
	var hasModif = false;
	$('#content form').each(function () {
		if(this.modifsOK.length > 0 || this.dataKO.length > 0) {
			hasModif = true;
		}
	});
	if(hasModif) {
		var PopupStatus = "Device/UserInterface/WebUI/PopupStatus";
		jQuery.orange.config.api.crud.read(
			[PopupStatus],
			function (result) {
				if (result[PopupStatus].values[PopupStatus] == true) {
					openConfirmationPopup('popup.cancelmodif.title', 'popup.cancelmodif.text',
						function() {
							$('#content')[0].popupOnUnsubmitted = false;
							callback();
							$('#content')[0].popupOnUnsubmitted = true;
						},
						function() {
							$("#levelSelector")[0].setDataValue('expert');
						});
				} else {
					callback();
				}
			}
		);
	}
	else {
		callback();
	}
}

jQuery.orange.config.areacontent.header = {
	postParse: function() {
		$("#headerLogo").bind('click', function(){
			if(jQuery.orange.widget.MenuItem.current != undefined)
				jQuery.orange.widget.MenuItem.setCurrent('m0');
		});
		
		$("#icoHelp").attr('title', jQuery.orange.config.i18n.map['data.help.standard']);
		$("#levelSelector")[0].setDataValue('standard');	
		$("#levelSelector").bind("change",function(event, newvalue) {			
			if (newvalue == "standard") {
				if(jQuery.orange.widget.MenuItem.current in { 
					"m2.m22":1,
					"m2.m23":1,
					"m2.m24":1,
					"m2.m25":1,
					"m2.m26":1,
					"m2.m27":1,
					"m2.m28":1,
					"m2.m29":1,
					"m2.m30":1 }) {
					header_displayPopup(function() { jQuery.orange.widget.MenuItem.setCurrent('m2.m20'); });
				}
				else if(jQuery.orange.widget.MenuItem.current == "m3.m32") {
					header_displayPopup(function() { jQuery.orange.widget.MenuItem.setCurrent('m3.m30'); });
				}
				else if(jQuery.orange.widget.MenuItem.current in { 
					"m4.m42":1,
					"m4.m42.m420":1,
					"m4.m42.m421":1,
					"m4.m43":1,
					"m4.m44":1}) {
					header_displayPopup(function() { jQuery.orange.widget.MenuItem.setCurrent('m4.m40'); });
				}
				else if(jQuery.orange.widget.MenuItem.current == "m5.m52") {
					header_displayPopup(function() { jQuery.orange.widget.MenuItem.setCurrent('m5.m50'); });
				}
			}
			if (newvalue != "standard"){
				$("#icoHelp").attr('title', jQuery.orange.config.i18n.map['data.help.avance']);
			}else{
				$("#icoHelp").attr('title', jQuery.orange.config.i18n.map['data.help.standard']);
			}
		});


		if ( (!jQuery.orange.config.api.authorization.isConnected())
				|| jQuery.orange.config.api.authorization.userlogin == 'guest') {
			$('#isConnected').hide();
		}

		$("#langSelector").bind("change",function(event, newvalue) {
			if (newvalue != undefined) {
				jQuery.orange.config.i18n.language = newvalue;
				jQuery.orange.init.i18n.load(function() {
					try {
						//alert(newvalue);
						$("HTML").attr("lang",newvalue);
					} catch (err) {
					//	alert("" + err);
					}
				});
			}
		});
		
		// Hide the trick to preload the runnerbar background
		$("#preloadRunnerBar").hide();
		
		// TODO Merge B8 : probablement � reproduire dans le header de la B9
		var meshEnabled = "Device/MESH/Enable";
		jQuery.orange.config.api.crud.read([meshEnabled],function(result){
			if(result["Device/MESH/Enable"].values["Device/MESH/Enable"] == true){
				$("#meshEnabled").val("true");
			}
			else {
				$("#meshEnabled").val("false");
			}
		});
		
		if (window.location.protocol == "https:") {
			$("#menuserviceinternet").val("false");
		}
		else {
			$("#menuserviceinternet").val("true");
		}
	},
	
	postLoad: function() {
		$("#langSelector").children()[0].setAttribute('id',$("#langSelector").attr("id") + "select");
		$("#levelSelector").children()[0].setAttribute('id',$("#levelSelector").attr("id") + "select");
	}	
};