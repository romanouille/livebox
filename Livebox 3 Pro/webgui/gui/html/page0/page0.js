jQuery.orange.config.areacontent.page00 = {
	preParse: function() {
		page0_toggleDisplay(false);
	},
	postParse: function(area) {
		area.popupOnUnsubmitted = false;
		$("#installoption span:eq(0)").after('<div i18n="page.page0.step0.installoption.FIRSTINSTALL.info"/>');
		$("#installoption span:eq(1)").after('<div i18n="page.page0.step0.installoption.REINSTALL.info"/>');
		$("#installoption").orangeParse();
	},
	postLoad: function(area) {

		//$("#installoption").attr("dataId", 'installoption');
		
		$("#installoption")[0].dataValueRef = "FIRSTINSTALL";
		$("#installoption")[0].setDataValue("FIRSTINSTALL");

		$("form", area)[0].setButtonsDisabled = function(newState) {
			var notModif = true;
			$("[dataId]", this).each(function() {
				if (this.getDataValue() != this.dataValueRef)
					notModif = false;
			});
			$("#b1", this).setDisabled(notModif);
		};
		
		$("#installoption").bind('change', function(event,newvalue) {
			if(newvalue!=undefined){
				$("#b1").setDisabled($("#installoption")[0].dataValueRef==newvalue);
				if(newvalue == 'REINSTALL') {
					if( !( $("#memoryCardStatus").val() == 'VALID' 
							|| $("#memoryCardStatus").val() == 'VALID_SECURE' 
							|| $('#memoryCardStatus').val() == 'VALID_LOCK') ) {
						$("#b2").setDisabled(true);
					}
					else {
						$("#b2").setDisabled(false);
					}
				}
				else if(newvalue == 'FIRSTINSTALL') {
					$("#b2").setDisabled(false);
				}
			}
		});
		
		$("#b2").bind('click', function() {
			dest = $("#installoption")[0].getDataValue();
			if(dest == "FIRSTINSTALL"){
				// Force the admin login for the very first install
				$("#global").orangeLoad(menu.mapping.pagezero_step1);
			}else if(dest == "REINSTALL"){
				if( $("#memoryCardStatus").val() == "VALID" ) { // should never happen because the box reboots
					$("#global").orangeLoad("html/page0/page01load.xml");
				}
				else if( $("#memoryCardStatus").val() == "VALID_SECURE" ) { // should never happen because the box reboots
					$("#global").orangeLoad("html/page0/page0password.xml");
				}
				else if( $("#memoryCardStatus").val() == "VALID_LOCK" ) {
					$("#global").orangeLoad("html/page0/page0password.xml");
				}
			}
		});
		
		//$("#memoryCardStatus").bind('change', function(event) {
		$(".ieChangeable").bind('change', function(event) {
			var newValue = event.target.value;
			if (newValue == 'VALID_LOCK') {
				// Activate the 'validate' button
				$("#b2").setDisabled(false);
			} else if (newValue == 'VALID' || newValue == 'VALID_SECURE') {
				// Here the box should reboot automatically
				// so go to the waiting page
				$("#global").orangeLoad("html/page0/page01load.xml");
			} else {
				$("#b2").setDisabled(true);
			}
		});
	}
};

jQuery.orange.config.areacontent.page01 = {
		postParse: function(area) {
			area.popupOnUnsubmitted = false;
			$("#b2").bind("click",function() {
				var adslEnable = "Device/Networks/WAN[@name='WAN']/WANPorts/DSL/Enable";
				var id2value = {};
				id2value[adslEnable] = $("#adslradio")[0].getDataValue();
				jQuery.orange.config.api.crud.update(id2value);

				var ftthEnable = "Device/Networks/WAN[@name='WAN']/WANPorts/FTTH/Enable";
				var id2value = {};
				id2value[ftthEnable] = $("#ftthradio")[0].getDataValue();
				jQuery.orange.config.api.crud.update(id2value);
				
				if( $("#selectChangeWarning").css('display') == 'block' ){
					$("#global").orangeLoad("html/page0/page01ftth.xml");
				}else{
					$("#global").orangeLoad(menu.mapping.pagezero_step2);
				}
			});

			//$('#enuminput2-0').attr('title', jQuery.orange.config.i18n.map['data.connectiontype.ENABLE.tip']);
			//$('#enuminput3-0').attr('title', jQuery.orange.config.i18n.map['data.connectiontype.DISABLE.tip']);
			$('#enuminput2-0').attr('title', jQuery.orange.config.i18n.map['data.connectiontype.1.tip']);
			$('#enuminput3-0').attr('title', jQuery.orange.config.i18n.map['data.connectiontype.0.tip']);
		},
		postLoad: function() {			
			$("#adslradio").bind("change",function(event, newvalue) {
				if (newvalue == "ENABLE") {					
					$("#ftthradio")[0].setDataValue('DISABLE');
				}
				if(newvalue!=undefined) {
					if( $("#adslradio")[0].dataValueRef != $("#adslradio")[0].getDataValue() || $("#ftthradio")[0].dataValueRef != $("#ftthradio")[0].getDataValue()) {
						$("#selectChangeWarning").show();
					}
					else {
						$("#selectChangeWarning").hide();
					}
				}
			});
			
			$("#ftthradio").bind("change",function(event, newvalue) {
				if (newvalue == "ENABLE") {
					$("#adslradio")[0].setDataValue('DISABLE');
				}
				if( $("#adslradio")[0].dataValueRef != $("#adslradio")[0].getDataValue() || $("#ftthradio")[0].dataValueRef != $("#ftthradio")[0].getDataValue()) {
					$("#selectChangeWarning").show();
				}
				else {
					$("#selectChangeWarning").hide();
				}
			});
		}
	};

jQuery.orange.config.areacontent.page01ftth = {
	preParse: function() {
	},
	postLoad: function(){

		//jQuery.orange.config.api.rpc.reboot();
	}
};

jQuery.orange.config.areacontent.page01load = {
		preParse: function() {
		},
		postLoad: function(){
			waitForRebootAndReload();
		}
	};

jQuery.orange.config.areacontent.page02 = {
	preParse: function() {
	},
	postParse: function(area) {
		area.popupOnUnsubmitted = false;
		$("#connectionWait").css("display","none");
		$("#toStep1").bind("click",function() {
			$("#global").orangeLoad(menu.mapping.pagezero_step1);
		});
		$("#letter_std").dialog({
			autoOpen: false,
			modal: true,
			minHeight: "586px",
			width:"681px",
			border:"1px solid #F60",
			open: function() {
				$('.close').blur();
			}
		});
		$("#succes_display").dialog({
			autoOpen: false,
			modal: true,
			width: "350px",
			minHeight: 90,
			open: function() {
				$('#home input').blur();
			}
		});

		
		$("#username").add($("#password")).bind('change keyup', function(){
			$("#page02cancel").setDisabled(false);
			
			var userlength = $("#username").val().length;
			
			if ($("#username").val().substring(0, 4) == "fti/") {
				userlength = userlength - 4;
			}
			
			if( userlength < 4 
				|| userlength > 64
				||  $("#password input[type='password']").val().length < 4
				||  $("#password input[type='password']").val().length > 29 ) {
				$("#page02valid").setDisabled(true);
			}else{
				$("#page02valid").setDisabled(false);
			}
			
			if( $("#username").val() == '' &&  $("#password input[type='password']").val() == ''){
				$("#page02cancel").setDisabled(true);	
			}
		});
		
		$("#page02valid").bind("click",function() {
			$(".errorConn").css("display","none");
			connectionProcess();
		});
		
		$("#page02cancel").bind("click",function() {
			$(".errorConn").css("display","none");
			//Reinit du formulaire dans tous les cas
			$("#username").val("");
			$("#username").trigger('valueChange');
			$("#password")[0].setDataValue("");
			$("#password").trigger('valueChange');
			$("#page02cancel").setDisabled(true);
			$("#page02valid").setDisabled(true);
		});
		$("#letter_thumbnail").bind("click",function(){
			$('#letter_std').dialog('open');
		});
		$("#letter_std a").bind("click",function(){
			$("#letter_std").dialog('close');
		});

		$("#home").bind("click",function() {
			$('#succes_display').dialog('close');
			page0_clickOnThisLink();
		});
		
		$("#secure").bind("click",function() {
			$('#succes_display').dialog('close');
			page0_toggleDisplay(true);
			jQuery.orange.widget.MenuItem.setCurrent('m5.m50');
		});
		
		$(".errorConn").css("display","none");
		
		$("#page02cancel").setDisabled(true);
		$("#page02valid").setDisabled(true);
	}
};

function page0_clickOnThisLink() {
	jQuery.orange.config.api.authorization.login("guest", "guest");
	page0_toggleDisplay(true);
	jQuery.orange.widget.MenuItem.setCurrent('m0');
}

page0_toggleDisplay = function(showHeader){
	if(showHeader) {
		//$("#displayMode").addClass("bordered");
		$("#mainMenu").show();
		$("#footer").show();
		$("#displayMode .forminput:eq(0)").show();
		$("#connectionManagement").removeClass("hidden");
		jQuery.orange.widget.Form.alignFormInputs.call( $("#displayMode form")[0] );
	}
	else {
		$("#displayMode").removeClass("bordered");
		$("#mainMenu").hide();
		$("#footer").hide();
		$("#displayMode .forminput:eq(0)").hide();
		$("#connectionManagement").addClass("hidden");
		jQuery.orange.widget.Form.alignFormInputs.call( $("#displayMode form")[0] );		
	}	
	jQuery.orange.init.i18n.load();
};

connectionProcess = function(){
	$("#connectionWait").css("display","block");
	$("#toStep1").setDisabled(true);
	$("#page02valid").setDisabled(true);
	
	var pppUser = "Device/Networks/WAN[@name='WAN']/PPP/Username";
	var id2value = {};
	var newInternalUsername = $("#username")[0].getDataValue();
	// Check if the username already have the 'fti/' prefix. If not, add it.
	if (newInternalUsername.substring(0, 4) != "fti/") {
		newInternalUsername = "fti/" + newInternalUsername;
	}
	id2value[pppUser] = newInternalUsername;
	jQuery.orange.config.api.crud.update(id2value);

	var pppPaswword = "Device/Networks/WAN[@name='WAN']/PPP/Password";
	var id2value = {};
	id2value[pppPaswword] = $("#password")[0].getDataValue();
	jQuery.orange.config.api.crud.update(id2value);
	
	var timeoutId = window.setTimeout(newStatusCheck, 15000);
	var t0 = new Date().getTime();
	$("#bdConnectionStatus").bind('change', function(event, newValue) {
		var dt = new Date().getTime() - t0;
		// Filters out some intermediate values while the box is connecting
		if (newValue == "MODEM_CONNECTED" || dt > 15000) {
			window.clearTimeout(timeoutId);
			newStatusCheck();
		}
	});
};

/**
 * Returns the first value in the JSON result
 */
var extractValue = function(xpath, crudReadResult) {
	var value = "";
	for (transformedXPath in crudReadResult[xpath].values) {
		value = crudReadResult[xpath].values[transformedXPath];
	}
	return value;
};

newStatusCheck = function(){
	var detectedStatus = $("#bdConnectionStatus")[0].getDataValue();
	$("#connectionWait").css("display","none");
	console.log(detectedStatus);
	if(detectedStatus=="MODEM_CONNECTED"){
		$("#errorPrincipal").css("display","none");
		$("#authError").css("display","none");
		$("#synchroError").css("display","none");
		$("#otherError").css("display","none");
		$("#contactError").css("display","none");
		if ($("#smartCardStatus")[0].getDataValue() == "VALID") {
			$('#succes_display').dialog('open');
		} else {
			page0_clickOnThisLink();
		}
	// "ADSL_LINE_NOT_SYNCHRONISED", "ATM_CONFIGURATION", "BAS_NOT_REPLY", "MODEM_CONNECTED", "MODEM_NOT_CONFIGURED", "PPP_AUTHENTICATION_FAILED", "UNKNOWN_ERROR"
	}else if(detectedStatus=="PPP_AUTHENTICATION_FAILED"){
		$("#toStep1").setDisabled(false);
		$("#page02valid").setDisabled(false);
		
		$("#errorPrincipal").css("display","block");
		$("#authError").css("display","block");
		$("#synchroError").css("display","none");
		$("#otherError").css("display","none");
		$("#contactError").css("display","none");
	}else if(detectedStatus=="ADSL_LINE_NOT_SYNCHRONISED"){
		$("#toStep1").setDisabled(false);
		$("#page02valid").setDisabled(false);
		
		$("#errorPrincipal").css("display","block");
		$("#authError").css("display","none");
		$("#synchroError").css("display","block");
		$("#otherError").css("display","none");
		$("#contactError").css("display","block");		
	}else{
		$("#toStep1").setDisabled(false);
		$("#page02valid").setDisabled(false);
		
		$("#errorPrincipal").css("display","block");
		$("#authError").css("display","none");
		$("#synchroError").css("display","none");
		$("#otherError").css("display","block");
		$("#contactError").css("display","block");		
	}
	//Reinit du formulaire dans tous les cas
	$("#username").val("");
	$("#password")[0].setDataValue("");
	$("#password").trigger('valueChange');
	$("#page02cancel").setDisabled(true);
	$("#page02valid").setDisabled(true);
};

/**
 * Page that display the old login/old password before restoring the old parameters
 */
jQuery.orange.config.areacontent.page0password = {
	preParse: function() {
	},
	postParse: function() {
		$("#jump2forget").bind("click",function(){
			$("#global").orangeLoad("html/page0/page0forget1.xml");
		});
		$("#toStep0").bind("click",function(){
			page0_toggleDisplay(false);
			$('#global').orangeLoad(menu.mapping.pagezero_step0);
		});	
		
		$("#page0passwordvalid").setDisabled(true);
		$("#resetPass").setDisabled(true);
		
		$("#memoryCardStatus").bind('change', function() {
			checkMemoryCardStatus();
		});
		
		$("#uPassword").bind("keyup",function(event){
			if( event.target.value != '') {
				$("#page0passwordvalid").setDisabled(false);
				$("#resetPass").setDisabled(false);
			} else {
				$("#resetPass").setDisabled(true);
			}
			checkMemoryCardStatus();
		});

		$("#resetPass").bind("click",function(){
			$("#uPassword").val('');
			$("#uPassword").trigger("keyup");
		});
		
		$("#page0passwordvalid").bind("click",function(){
			var password = $("#uPassword").val();
			$("#failedAuthMsg").addClass('hidden');
			var button = this;
			button.setDisabled(true); // gray out the button as soon as the user clicks on it
			jQuery.orange.config.api.rpc.unlockWithPassword(password, function(successful) {
				if (successful) {
					$("#global").orangeLoad("html/page0/page0secureload.xml");
				} else {
					$("#failedAuthMsg").removeClass('hidden');
					button.setDisabled(false); // allow the user to try again
				}
			});
		});
		
	}};

checkMemoryCardStatus = function(){
	if( !($("#memoryCardStatus").val() == 'VALID' || $("#memoryCardStatus").val() == 'VALID_SECURE' || $("#memoryCardStatus").val() == 'VALID_LOCK') ) {
			$("#page0passwordvalid").setDisabled(true);
			$("#failedMC").removeClass("hidden");
	}
	else {
		$("#failedMC").addClass("hidden");
		if($("#uPassword").val() != ""){
			$("#page0passwordvalid").setDisabled(false);
		}else {
			$("#page0passwordvalid").setDisabled(true);
		}
	}
};

jQuery.orange.config.areacontent.page0secureload = {
		preParse: function() {
		},
		postLoad: function() {
			// Wait for end of reboot
			waitForRebootAndReload();
		}
	};

jQuery.orange.config.areacontent.page0forget1 = {
	preParse: function() {
	},

	postParse: function() {
		$("#cancelBtn").add("#validateBtn").setDisabled(true);

		//$("#SecretAnswer").change(function() {
		$("#SecretAnswer").bind("change keyup", function() {
			$("#cancelBtn").add("#validateBtn").setDisabled($("#SecretAnswer").val() == "");
		});

		$("#backBtn").click(function() {
			$("#global").orangeLoad("html/page0/page0password.xml");
		});

		$("#cancelBtn").click(function() {
			$("#SecretAnswer").val("");
			$("#SecretAnswer").trigger("change");
			$(".error").hide();
		});

		$("#validateBtn").click(function() {
			var button = this;
			button.setDisabled(true);
			var secretAnswer = $("#SecretAnswer").val();
			$(".error").hide();
			jQuery.orange.config.api.rpc.unlockWithSecretAnswer(secretAnswer, function(successful) {
				if (successful) {
					// Here, according to the spec, we should display the 'type new password' page
					//$("#global").orangeLoad("html/page0/page0forget2.xml", {LOGIN: $("#login").val()});
					
					// But the box is rebooting...
					$("#global").orangeLoad("html/page0/page0secureload.xml");
				} else {
					$(".error").show();
					button.setDisabled(false); // allow the user to try again
				}
			});
		});
	}
};


jQuery.orange.config.areacontent.page0forget2 = {
	postParse: function() {
		$("#cancelBtn").add("#validateBtn").setDisabled(true);

		//$("#newPassword").change(function() {
		$("#newPassword").bind("change keyup", function() {
			if ($("#newPassword").val() != "") {
				$("#cancelBtn").setDisabled(false);
				forgetPassword_checkPassword();
			} else if ($("#newPassword").val() == "" && $("#confirmNewPassword").val() == "") {
				$("#cancelBtn").setDisabled(true);
				$("#validateBtn").setDisabled(true);
			}
		});

		//$("#confirmNewPassword").change(function() {
		$("#confirmNewPassword").bind("change keyup", function() {
			if ($("#confirmNewPassword").val() != "") {
				$("#cancelBtn").setDisabled(false);
				forgetPassword_checkPassword();
			} else if ($("#newPassword").val() == "" && $("#confirmNewPassword").val() == "") {
				$("#cancelBtn").setDisabled(true);
				$("#validateBtn").setDisabled(true);
			}
		});

		$("#backBtn").click(function() {
			$("#global").orangeLoad("html/page0/page0password.xml");
		});

		$("#cancelBtn").click(function() {
			$("#newPassword").val("");
			$("#confirmNewPassword").val("");
			$("#newPassword").trigger("change");
			$("#confirmNewPassword").trigger("change");
		});

		$("#validateBtn").click(function() {
			var Password = "Device/UserAccounts/ManagedUsers/ManagedUser[Login='"+$("#login").val()+"']/Password";
			var id2value = {};
			id2value[Password] = $("#confirmNewPassword").val();
			jQuery.orange.config.api.crud.update(id2value, function() {
				$("#global").orangeLoad("html/page0/page01load.xml");
			});
		});
		
	}
};
