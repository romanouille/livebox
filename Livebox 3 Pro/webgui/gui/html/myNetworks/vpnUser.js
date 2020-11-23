function vpnUser_addToDataKO(node) {
	var form = $("#vpnUser form")[0];
	
	// Look for an existing error for this field
	var indexDataKO = arrayIndexOf2(form.dataKO, node);
	
	if (indexDataKO == -1) {
		var oldState = jQuery.orange.widget.Form.getState.call(form);
		form.dataKO.push(node);
		var newState = jQuery.orange.widget.Form.getState.call(form);
		if (newState != oldState){
			jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
		}
	}
	console.log("vpnUser_addToDataKO(): node=" + $(node).attr("id"));
}

function vpnUser_showError(jFieldInError, jErrorMsg) {
	jFieldInError.addClass('errorInput');
	jErrorMsg.show();
}

function vpnUser_removeFromDataKO(node) {
	var form = $("#vpnUser form")[0];
	
	// Look for an existing error for this field
	var indexDataKO = arrayIndexOf2(form.dataKO, node);
	if (indexDataKO != -1) {
		var oldState = jQuery.orange.widget.Form.getState.call(form);
		form.dataKO.splice(indexDataKO, 1);
		var newState = jQuery.orange.widget.Form.getState.call(form);
		if (newState != oldState){
			jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
		}
	}
	console.log("vpnUser_removeFromDataKO(): node=" + $(node).attr("id"));
}

function vpnUser_hideError(jFieldInError, jErrorMsg) {
	jFieldInError.removeClass('errorInput');
	jErrorMsg.hide();
}

function vpnUser_checkPassword(hasFocus) {

	var passwordValue = $("#userpass input[type='password']").val();
	var isCorrect = passwordValue != undefined && passwordValue != "" && passwordValue.length >= 8;
	
	// Handle form state
	if (isCorrect) {
		vpnUser_removeFromDataKO($("#userpass")[0]);
	} else {
		vpnUser_addToDataKO($("#userpass")[0]);
	}
	
	// handle error messages
	if (isCorrect || passwordValue == "") {
		// Never display an error if field is empty
		vpnUser_hideError($("#userpass"), $("#errorMsgLength"));
	} else {
		if (hasFocus && passwordValue.length < 8) {
			// Do not display an error while typing
		} else {
			vpnUser_showError($("#userpass"), $("#errorMsgLength"));
		}
	}
	
	console.log("vpnUser_checkPassword(): isCorrect=" + isCorrect);
	return isCorrect;
}

function vpnUser_checkPasswordConfirm(hasFocus) {
	return true;
	var passwordValue = $("#userpass input[type='password']").val();
	var confirmValue = $("#userpassconfirm input[type='password']").val();
	var isCorrect = (passwordValue == confirmValue);
	
	if (isCorrect || confirmValue == "" || passwordValue == "" || hasFocus && passwordValue.startsWith(confirmValue)) {
		vpnUser_hideError($("#userpassconfirm"), $("#errorMsgDiff"));
	} else {
		vpnUser_showError($("#userpassconfirm"), $("#errorMsgDiff"));
	}
	
	return isCorrect;
}

jQuery.orange.config.areacontent.vpnUser = {
		onReset: function() {
			//appel fonction onReset par defaut
			$("#userForm")[0].onReset = undefined;
			var resetresult = jQuery.orange.widget.Form.onReset.call(this);
			$("#userForm")[0].onReset = jQuery.orange.config.areacontent.vpnUser.onReset;
			
			//traitement cas de test
			var form = this;
			if($("#vpnUser form").attr('creation')){
				$("[dataId]", this).each(function() {
					var node = this;
					if(arrayIndexOf($("[widgetType='Button'] input"), node) == -1){
							var valueStatus = jQuery.orange.widget.Form.verifyConstraints(this,false); 
							if(valueStatus == fr.orange.livebox.gui.api.ProgressiveRegexp.WRONG
									|| valueStatus == fr.orange.livebox.gui.api.ProgressiveRegexp.NOT_GOOD_NOT_WRONG){
								form.dataKO.push(node);
							}
						}
				});
				jQuery.orange.widget.Form.setButtonsDisabled.call($("#vpnUser form")[0], jQuery.orange.widget.Form.STATE_ONCREATE);
			}
			
			//retour de la fonction standard
			return resetresult;
		},
		onDataChange: function(node, showErrorMsg) {
			//appel fonction onDataChange par defaut
			$("#userForm")[0].onDataChange = undefined;
			jQuery.orange.widget.Form.onDataChange.call(this, node, showErrorMsg);
			$("#userForm")[0].onDataChange = jQuery.orange.config.areacontent.vpnUser.onDataChange;
			
			var jForm = $("#vpnUser form");

			//Cas creation : traitement de l'ensemble du formulaire pour definir et positionner état des boutons en fonction des dataValueRef
			if(jForm.attr('creation')){
				var modified=false;
				$("[dataId]", this).each(function() {
					var node = this;
					if(arrayIndexOf($("[widgetType='Button'] input"), node) == -1){
						if(node.dataValueRef != undefined){
							if(node.getDataValue() != node.dataValueRef){
								if(!modified){
									modified=true;
								}
							}
						}
					}
				});
				var currentState = jQuery.orange.widget.Form.getState.call(this);
				if (currentState == jQuery.orange.widget.Form.STATE_KO) {
					jQuery.orange.widget.Form.setButtonsDisabled.call(jForm[0], jQuery.orange.widget.Form.STATE_KO);				
				} else if (modified){
					jQuery.orange.widget.Form.setButtonsDisabled.call(jForm[0], jQuery.orange.widget.Form.STATE_MODIF_OK);				
				} else {
					jQuery.orange.widget.Form.setButtonsDisabled.call(jForm[0], jQuery.orange.widget.Form.STATE_NO_MODIF);					
				}
			}
		},
		preParse: function() {
			
			$("#userForm")[0].onReset = jQuery.orange.config.areacontent.vpnUser.onReset; 
			$("#userForm")[0].onDataChange = jQuery.orange.config.areacontent.vpnUser.onDataChange; 
			
			var userRef = $("#content").data('selectedUserName');

			//Positionnement prealable a toute action...
			if(userRef == undefined){
				$("#vpnUser form").attr('creation',true);
			}
			
			if(userRef == undefined){
				userRef = "";
				$("#deleteUserVpn").css("display","none");
				$("#saveUserVpn").css("display","none");
				$("#createUserVpn").css("display","");
				// Data ids
				$("#userenable").attr("dataid", "Enable");
				$("#username").attr("dataid", "Login");
				$("#userpass").attr("dataid", "Password");
				$("#hiddengroup").attr("dataid", "Group");
//				$("#useremail").attr("dataid", "Email");
				
			} else {
				$("#createUserVpn").remove(); // prevent the form to be submitted via the enter key with crud='create'
				$("#connectedNomade").attr("dataid","Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser[@Login='"+userRef+"']/ConnectionStatus");
				$("#userenable").attr("dataid","Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser[@Login='"+userRef+"']/Enable");
				$("#username").attr("dataid","Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser[@Login='"+userRef+"']/@Login");
				$("#userpass").attr("dataid","Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser[@Login='"+userRef+"']/Password");
				$("#hiddengroup").attr("dataid","Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser[@Login='"+userRef+"']/Group");
//				$("#useremail").attr("dataid","Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser[@Login='"+userRef+"']/Email");
			}
			
			var Xgroups = "Device/Networks/WAN[@name='WAN']/VPN/RoadWarriorVPNs/RoadWarriorVPN";
			jQuery.orange.config.api.crud.read([Xgroups],function(result){
				var dynamicEnum="";
				for (group in result[Xgroups].values) {
					var groupname = result[Xgroups].values[group]["Name"];
					if(groupname != undefined
							&& groupname != ""){
						//$("#userprofil select").append("<option value='"+groupname+"'>"+groupname+"</option>");
						dynamicEnum+="'"+groupname+"',";
					}
				}
				$("#userprofil").attr("enumerated","["+dynamicEnum.substring(0, dynamicEnum.length - 1)+"]");
			});
		},
		postParse: function() {
			$("#backTovpn").bind("click",function(){
				jQuery.orange.widget.MenuItem.setCurrent('m2.m27');
			});
			
//			$("#saveUserVpn").bind("click",function(){
//				jQuery.orange.widget.MenuItem.setCurrent('m2.m27');
//			});
			var maxWidth = 0;
			
			$('.forminput-label').each(function(index) {
			    if($(this).width() > maxWidth)
			    	maxWidth=$(this).width();
				});

		},
		postLoad: function(area){
						
			$("#help").bind("click",function() {
				helpPopup("html/main/help_vpnUser.html");
			});
			
			//positionnement des valeurs par defaut
			$("#userpassconfirm input[type='password']").val($("#userpass input[type='password']").val());
			$("#userpassconfirm input[type='text']").val($("#userpass input[type='text']").val());
			if($("#content").data('selectedUserName') == undefined){
				
				$("#userenable")[0].setDataValue(true);
				$("#userenable")[0].dataValueRef=true;
				$("#userenable").trigger('valueChange');
				$("#userenable").setDisabled(false);
				/*
				$("#userenable")[0].setDataValue(false);
				$("#userenable")[0].dataValueRef=false;
				$("#userenable").trigger('valueChange');
				$("#userenable").setDisabled(true);
				*/
			}
			
			//positionning tooltips
			/*if($("#userenable")[0].getDataValue()){
				$("#userenable").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnUser.activate.true.tip"]);
			}else{
				$("#userenable").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnUser.activate.false.tip"]);
			}
			$("#userenable").bind('valueChange',function(event){
				if(event.target.checked){
					$("#userenable").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnUser.activate.true.tip"]);
				}else{
					$("#userenable").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnUser.activate.false.tip"]);
				}
			});*/
			$("#username").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnUser.username.tip"]);
			$("#userpass").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnUser.password.tip"]);
			$("#userpassconfirm").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnUser.confirm.tip"]);

			$("#userprofil select").bind("valueChange",function(event,newvalue){
				$("#hiddengroup")[0].setDataValue(event.target.currentValue);
				$("#hiddengroup").trigger('valueChange');
			});
			
			/*
			$("#createUserVpn input[type='submit']")[0].crudCallback = function() {
				$("#content").data("selectedUserName",$("#username")[0].getDataValue());
				jQuery.orange.widget.Form.onReset.call($("#vpnUser form")[0]);
				jQuery.orange.widget.MenuItem.setCurrent('m2.m274');
			};
			*/
			
			$("#vpnUser form")[0].crudCallDelegate = function(crudExec) {
				crudExec();
				$("#content").data("selectedUserName",$("#username")[0].getDataValue());
				area.popupOnUnsubmitted = false;
				//jQuery.orange.widget.Form.onReset.call($("#vpnUser form")[0]);
				jQuery.orange.widget.MenuItem.setCurrent('m2.m27');
			};
			
			
			$("#deleteUserVpn").bind('click',function(){
				openConfirmationPopup('popup.confirm.title', 'popup.confirm.text',
					function() {
						var Xdelete = "Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser[@Login='"+$("#username")[0].getDataValue()+"']";
						jQuery.orange.config.api.crud.del(Xdelete,function(result){
							jQuery.orange.widget.MenuItem.setCurrent('m2.m27');
						});
					});
			});

			$("#cancelUserVpn").bind('activateButton',function(){
				var form = $("#vpnUser form")[0];
				var userpassNode = $("#userpass input[type='password']");
				var userpassconfirmNode = $("#userpassconfirm input[type='password']");
				var userpassVisibleNode = $("#userpass input[type='text']");
				var userpassVisibleconfirmNode = $("#userpassconfirm input[type='text']");
				var userProfilNode = $("#userprofil select");
				
				userProfilNode.val($("#hiddengroup")[0].dataValueRef); 
				$("#userpassconfirm")[0].setDataValue($("#userpass")[0].dataValueRef);
				
				$("#errorMsgLength").css('display', 'none');
				$("#errorMsgDiff").css('display', 'none');
				userpassVisibleNode.removeClass('errorInput');
				userpassVisibleconfirmNode.removeClass('errorInput');
				
				var oldState = jQuery.orange.widget.Form.getState.call(form);
				
				form.dataKO.splice( arrayIndexOf2(form.dataKO, userpassNode), 1 );
				form.dataKO.splice( arrayIndexOf2(form.dataKO, userpassconfirmNode), 1 );
				
				var newState = jQuery.orange.widget.Form.getState.call(form);
				if (newState != oldState){
					jQuery.orange.widget.Form.onStateChange.call(form, oldState, newState);
				}
			});
			
			$("#userpass").bind('keyup change valueChange input propertyChange blur', function(event) {
				// Check also the password confirmation
				var form = $("#vpnUser form")[0];
				var node = $("#userpassconfirm")[0];
				var showError = !this.hasFocus();
				jQuery.orange.widget.Form.onDataChange.call(form, node, showError);
			});

			$("#userpass input[type='text']").bind('input propertyChange blur', function(event) {
				$("#userpass").trigger("change");
			});
			
			var confirmPasswordError = "";
			$("#userpassconfirm")[0].validate = function() {
				var GOOD = fr.orange.livebox.gui.api.ProgressiveRegexp.GOOD;
				var WRONG = fr.orange.livebox.gui.api.ProgressiveRegexp.WRONG;
				var NOT_GOOD_NOT_WRONG = fr.orange.livebox.gui.api.ProgressiveRegexp.NOT_GOOD_NOT_WRONG;
				
				var passwordValue = $("#userpass input[type='password']").val();
				var confirmValue = $("#userpassconfirm input[type='password']").val();
				var isCorrect = (passwordValue == confirmValue);
				
				if (isCorrect) {
					confirmPasswordError = "";
					return GOOD;
				} else if (passwordValue.startsWith(confirmValue)) {
					confirmPasswordError = "identpassserror";
					return NOT_GOOD_NOT_WRONG;
				} else {
					confirmPasswordError = "identpassserror";
					return WRONG;
				}
			};
			$("#userpassconfirm")[0].getError = function() {
				return confirmPasswordError;
			};
			
		var userRef = $("#content").data('selectedUserName');
		if(userRef == undefined){
			$("#hiddengroup")[0].dataValueRef='default';
			$("#hiddengroup")[0].setDataValue('default');
			$("#userprofil")[0].setDataValue('default');
//			$("#useremail")[0].dataValueRef='email@domain.com';
//			$("#useremail")[0].setDataValue('email@domain.com');
			$("#userpass")[0].setDataValue("");
			$("#userpass")[0].dataValueRef = "";
			$("#userpassconfirm")[0].setDataValue("");
			$("#userpassconfirm")[0].dataValueRef = "";
			jQuery.orange.widget.Form.setButtonsDisabled.call($("#vpnUser form")[0], jQuery.orange.widget.Form.STATE_ONCREATE);
		}else{
			var Xuserprofil = "Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser[@Login='"+$("#username")[0].getDataValue()+"']/Group";
			jQuery.orange.config.api.crud.read([Xuserprofil],function(result){
				for(userprofil in result[Xuserprofil].values){
					$("#hiddengroup")[0].dataValueRef=result[Xuserprofil].values[userprofil];
					$("#userprofil")[0].setDataValue(result[Xuserprofil].values[userprofil]);
				}
			});
		}
		$("#content").removeData('selectedUserName');
	}
};
