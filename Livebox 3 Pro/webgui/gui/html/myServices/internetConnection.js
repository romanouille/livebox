/*function disablePassword() {
	var DHCPEnable = "Device/Networks/LAN[@name='LAN']/DHCPEnable";
	jQuery.orange.config.api.crud.read(
		[DHCPEnable],
		function (result) {
			if(result[DHCPEnable].values[DHCPEnable] == false)
				$("#password").setDisabled(false);
			else
				$("#password").setDisabled(true);
		});
}*/

function password_focus() {
	$("#password")[0].setDataValue("");
	$(this).unbind('focus', password_focus);
}

jQuery.orange.config.areacontent.internetConnection = {
	postParse: function() {
		// Synchronize the PPP username from displayed value to internal representation
		$("#visibleUsername").keyup(function(event) {
			var newInternalUsername = $("#visibleUsername")[0].getDataValue();
			// Check if the username already have the 'fti/' prefix. If not, add it.
			if (newInternalUsername.substring(0, 4) != "fti/") {
				newInternalUsername = "fti/" + newInternalUsername;
			}
			if ($("#internalUsername")[0].getDataValue() != newInternalUsername) {
				$("#internalUsername")[0].setDataValue(newInternalUsername);
			}
		});
		
		// Synchronize the PPP username from internal representation to displayed value
		$("#internalUsername").change(function(event) {
			// Check if the internal user name already have the 'fti/' prefix. If yes, remove it.
			var newVisibleUserName = $("#internalUsername")[0].getDataValue();
			if (newVisibleUserName.substring(0, 4) == "fti/") {
				newVisibleUserName = newVisibleUserName.substring(4);
			}
			if ($("#visibleUsername")[0].getDataValue() != newVisibleUserName) {
				$("#visibleUsername")[0].setDataValue(newVisibleUserName);
			}
		});
	},
	postLoad: function() {
		
		$("#visibleUsername").attr("title",jQuery.orange.config.i18n.map["page.myServices.internet.ident.login.tip"]);
		var form = $("#internetConnection form")[0];
		var passwordNode = $("#password");
		
		$("#password")[0].dataValueRef = "aaaaaaa";
		$("#password")[0].setDataValue(passwordNode[0].dataValueRef);
		$("#password input[type='text']").bind("focus", password_focus);
		
		jQuery.orange.widget.Form.onStateChange.call(form, 0, 3);
		$("#password").attr("dataId","Device/Networks/WAN[@name='WAN']/PPP/Password");


		
		$("#internalUsername").bind("keyup change", function() {
			if($("#password")[0].getDataValue() == ""){
				if( arrayIndexOf2($("#internetConnection form")[0].dataKO, $("#password")[0]) == -1 ){
					$("#internetConnection form")[0].dataKO.push(passwordNode[0]);
				}
			}
		});
		
		$("#cancelButton").bind("click", function() {
			$("#password input[type='password']").val("");
			$("#password").trigger('change');
			jQuery.orange.widget.Form.onStateChange.call(form, 0, 3);
		});
				
		$("#help").bind("click",function() {
			helpPopup("html/main/help_internet.html");
		});
		
		$("#radioDSL").bind("change", function(event, newValue) {
			if(newValue != undefined) {
				//disablePassword();
				var radioDSL = $("#radioDSL input[type='radio']").attr('checked');
				if(radioDSL == true)
					$("#FTTHval input[type='text']").val('DISABLE');
				else
					$("#FTTHval input[type='text']").val('ENABLE');
				/*
				if(radioDSL == true)
					$("#FTTHval input[type='text']").val(0);
				else
					$("#FTTHval input[type='text']").val(1);
				*/
			}
		});
		
		$("#internetConnection form")[0].crudCallDelegate = function(crudExec) {
			
			var ref = $("#radioDSL")[0].dataValueRef;
			var cur = $("#radioDSL")[0].getDataValue();
			var password =  $("#password")[0].getDataValue();

			var passwordGui = "Device/Networks/WAN[@name='WAN']/PPP/Password";
			var id2value = {};
			
			
			if(password !="aaaaaaa" && password.length >0 ){
				id2value[passwordGui] = $("#password")[0].getDataValue();
			}
			
			jQuery.orange.config.api.crud.update(id2value);
			if(ref != cur ){
				openConfirmationPopup('popup.rebootlivebox.title', 'popup.rebootlivebox.text',
					function() {
						crudExec();
						jQuery.orange.widget.MenuItem.setCurrent('m3.m30.m302', {XpathRouter: 'Device/DeviceInfo'});
					},
					function() {
						$("#internetConnection form")[0].reset();
					});
			}else{
				crudExec();
			}
		};

		var CurrentlyRemoteAccess = "Device/UserAccounts/ManagedUsers/ManagedUser[Login='"+jQuery.orange.config.api.authorization.getLogin()+"']/CurrentlyRemoteAccess";
		jQuery.orange.config.api.crud.read(
			[CurrentlyRemoteAccess],
			function (result) {
				if(result[CurrentlyRemoteAccess].values[CurrentlyRemoteAccess] == true)
				{					
					$("#btnReboot").setDisabled(true);
					$("#radioDSL").setDisabled(true);
					$("#visibleUsername").setDisabled(true);
					$("#password").setDisabled(true);
				}
				else
				{
					$("#btnReboot").setDisabled(false);
					$("#radioDSL").setDisabled(false);
					$("#visibleUsername").setDisabled(false);
					$("#password").setDisabled(false);
				}
			});

		$('#btnReboot').click(function(){
			jQuery.orange.config.api.rpc.restartConnection(function(){
				$("#additionalPPPinfo").orangeParse();
				$("#additionalPPPinfo").orangeLoad();
				$("#additionalPPPinfo").orangeTranslate();
			});
		});

		var internatStatusSurveyRequest = jQuery.orange.config.api.client.newRequest();
		internatStatusSurveyRequest.onPeriodicValue(
				"Device/Networks/WAN[@name='WAN']/PPP/UpTime", 
				//"Device/DeviceInfo/UpTime",
				function(newvalue){
					if($("#PPPUptime")[0] != undefined){
						$("#PPPUptime")[0].updateOnPeriodic(newvalue);
						$("#PPPUptime")[0].orangeTranslate();
					}
				}, 
				function(){
					//respFunc
					//alert("into respFunc");
				}, 
				function(){
					//errFunc
					//alert("into errFunc");
				}, 
				{timer:5} //options : timer in seconds --> NO EFFECT at this time 07/12/2011
				);
		internatStatusSurveyRequest.send();
	}
};