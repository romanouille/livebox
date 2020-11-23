jQuery.orange.config.areacontent.distantAccess = {
	preParse: function(area) {
		
		area.popupOnUnsubmitted = true;
		$("#userremoteaccess").attr('dataId', 'Device/UserAccounts/ManagedUsers/ManagedUser[Login=\'remote\']/RemoteAccessMgt/UserRemoteAccess[@Service=\'HTTPS\']/Enabled');
		//$("#noneditablelogin").attr('dataId', 'Device/UserAccounts/ManagedUsers/ManagedUser[Login=\'remote\']/Login');
		//$("#login2").attr('dataId', 'Device/UserAccounts/ManagedUsers/ManagedUser[Login=\''+jQuery.orange.config.api.authorization.getLogin()+'\']/Login');
		//$("#userremoteaccessssh").attr('dataId', 'Device/UserAccounts/ManagedUsers/ManagedUser[Login=\''+jQuery.orange.config.api.authorization.getLogin()+'\']/RemoteAccessMgt/UserRemoteAccess[@protocol=\'SSH\']/Enabled');
	
		/*
		var form = $("#distantAccess form")[0];
		var loginNode = $("#login");
		$("#login").bind('change keyup', function(event){
			if(event.target.value == 'admin'
			|| event.target.value == 'support'
			|| event.target.value == 'root'
			|| event.target.value == '') {
				loginNode.addClass('supErrorInput');
				$("#loginCustomErrForbidden").show();
				var oldState = jQuery.orange.widget.Form.getState.call(form);
				
				if( arrayIndexOf2(form.dataKO, loginNode) == -1 )
					form.dataKO.push(loginNode);
				
				var newState = jQuery.orange.widget.Form.getState.call(form);
				if (newState != oldState)
					jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
			}
			else {
				loginNode.removeClass('supErrorInput');
				//loginNode.next().hide();
				$("#loginCustomErrForbidden").hide();
				var oldState = jQuery.orange.widget.Form.getState.call(form);
				
				form.dataKO.splice( arrayIndexOf2(form.dataKO, loginNode), 1 );
				
				var newState = jQuery.orange.widget.Form.getState.call(form);
				if (newState != oldState)
					jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
			}
		});
		*/
	},
	postParse: function() {
		
		$("#userremoteaccess").bind("change", function(event, newValue){
			if (newValue!=undefined)
				$("#port").setDisabled(!newValue);
		});
		$("#port").setDisabled( !$("#userremoteaccess input").attr('checked') );
/*
* Block a DECOMMENTER avec le retour de la fonctionnalite connection SSH
		
		$("#userremoteaccessssh").bind("valueChange", function(event, newValue){
			$("#portssh").setDisabled(!newValue);
		});
		$("#portssh").setDisabled( !$("#userremoteaccessssh input").attr('checked') );
/**/		
		var DynDNSEnable = "Device/DynamicDNS/DynDNS/Enable";
		jQuery.orange.config.api.crud.read(
			[DynDNSEnable],
			function (result) {
				$("#currenturl").empty();
				if(result[DynDNSEnable] != undefined && result[DynDNSEnable].values[DynDNSEnable] == true) {
					$("#currenturl").append('https://<span dataId="Device/DynamicDNS/DynDNS/Name"/>:<span dataId="Device/UserInterface/RemoteAccess/RemoteHTTPSPort"/>');
				}
				else {
					$("#currenturl").append('https://<span dataId="Device/Networks/WAN[@name=\'WAN\']/ExternalIPAddress"/>:<span dataId="Device/UserInterface/RemoteAccess/RemoteHTTPSPort"/>');
				}
			});
	},
	postLoad: function(area){	
		
		$("#port").bind("keyup change", function(event) {
			if(!$("#password")[0].getDataValue().length >=8){
				$("#btnSave").setDisabled(false);
			}
			else{
				$("#btnSave").setDisabled(true);
			}
		});
		
		$("#userremoteaccess").bind("change", function(event) {
			if ($("#userremoteaccess")[0].getDataValue() && $("#port").val().length < 6){
				$("#btnSave").setDisabled(true);
			}
		});
		
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_distantAccess.html");
		});
		
		$("#password").attr('dataId', 'Device/UserAccounts/ManagedUsers/ManagedUser[Login=\'remote\']/Password');
		$("#password").orangeParse();
		$("#password").orangeTranslate();
/*
* Block a SUPPRIMER avec le retour de la fonctionnalite connection SSH
*/ 		
		// Affichage des cas erreurs
		$("#port").bind("keyup change blur", function(event) {
			var form = $("#distantAccess form")[0];

			var currentPortNode = $("#port");
			var currentPort = currentPortNode.val();

			$("#identicalPorterror").css('display', 'none');
				
			var oldState = jQuery.orange.widget.Form.getState.call(form);

			if(jQuery.orange.widget.Form.verifyConstraints(currentPortNode[0])){
				currentPortNode.removeClass('supErrorInput');
				form.dataKO.splice(arrayIndexOf2(form.dataKO, currentPortNode), 1);
			}
			var newState = jQuery.orange.widget.Form.getState.call(form);
			if (newState != oldState){
				jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
			}
		});	

/*
* Block a DECOMMENTER avec le retour de la fonctionnalite connection SSH
		
		//Gestion ports identiques
		// Recuperation du port hors page.
		var Xsrap = "Device/UserInterface/RemoteAccess/SupportRemoteAccessPort";
		var srap = "notdefined";
		jQuery.orange.config.api.crud.read(
			[Xsrap],
			function (result) {
				srap = result[Xsrap].values[Xsrap];
			});
		// Affichage des cas erreurs
		$("#port").add($("#portssh")).bind("keyup change", function(event) {
			var form = $("#distantAccess form")[0];

			var currentPortNode = $("#port");
			var currentPort = currentPortNode.val();
			var currentPortSSHNode = $("#portssh");
			var currentPortSSH = currentPortSSHNode.val();

			if((currentPortSSH == currentPort || srap == currentPortSSH || srap == currentPort)   
				&& jQuery.orange.widget.Form.verifyConstraints(currentPortNode[0])
				&& jQuery.orange.widget.Form.verifyConstraints(currentPortSSHNode[0])
				){
				
				if(event.target.id == 'port'){
					$("#identicalPorterror").css('display', 'block');
				}else{
					$("#identicalSSHPorterror").css('display', 'block');
				}
				
				currentPortNode.addClass('supErrorInput');
				currentPortSSHNode.addClass('supErrorInput');

				var oldState = jQuery.orange.widget.Form.getState.call(form);
				form.dataKO.push(currentPortNode);
				form.dataKO.push(currentPortSSHNode);

				var newState = jQuery.orange.widget.Form.getState.call(form);
				if (newState != oldState){
					jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
				}
			}else if(currentPortSSH != currentPort){
				$("#identicalPorterror").css('display', 'block');
				$("#identicalSSHPorterror").css('display', 'block');
				
				var oldState = jQuery.orange.widget.Form.getState.call(form);

				if(jQuery.orange.widget.Form.verifyConstraints(currentPortNode[0])){
					currentPortNode.removeClass('supErrorInput');
					form.dataKO.splice(arrayIndexOf2(form.dataKO, currentPortNode), 1);
				}
				if(jQuery.orange.widget.Form.verifyConstraints(currentPortSSHNode[0])){
					currentPortSSHNode.removeClass('supErrorInput');
					form.dataKO.splice(arrayIndexOf2(form.dataKO, currentPortSSHNode), 1);
				}

				var newState = jQuery.orange.widget.Form.getState.call(form);
				if (newState != oldState){
					jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
				}
			}
				
		});	
/**/

		$("#distantAccess form")[0].crudCallDelegate = function(crudExec) {
			//update standard du port
			crudExec();
			var id2value = {};		
			var Password = 'Device/UserAccounts/ManagedUsers/ManagedUser[Login=\'remote\']/Password';
			var hashPass = jQuery.orange.config.api.client.hashPassword( $("#password input[type='password']").val() );
			if ($("#password")[0].getDataValue()!='softeam.1') {
				id2value[Password] = hashPass;
			}
			// Update du mot de passe
			jQuery.orange.config.api.crud.update(id2value, function(errors){});
		};
		
		$("#annuler").bind('click',function(){
			area.popupOnUnsubmitted = false;
			$("#content").orangeLoad(menu.mapping.accountdistantAccess);
		});
//		$("#password")[0].setDataValue("softeam.1");
		
//		$("#password input[type='text']").bind("focus", function(){
//			$("#password")[0].setDataValue("");
////			$(this).unbind('focus', password_secretanswerFocus);
//		});
	}
};