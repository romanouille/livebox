jQuery.orange.config.areacontent.forgetPassword1 = {
	preParse: function() {
		installation_toggleDisplay(false);
	},

	postParse: function() {
		$("#cancelBtn").add("#validateBtn").setDisabled(true);

		$("#SecretAnswer").bind("change keyup", function() {
			$("#cancelBtn").add("#validateBtn").setDisabled($("#SecretAnswer").val() == "");
		});

		$("#backBtn").click(function() {
			$("#global").orangeLoad(menu.mapping.home);
			installation_toggleDisplay(true);
		});

		$("#cancelBtn").click(function() {
			$("#SecretAnswer").val("");
			$("#SecretAnswer").trigger("change");
			$(".error").hide();
		});

		$("#validateBtn").click(function() {			
			jQuery.orange.config.api.rpc.checkSecretAnswer("admin", $("#SecretAnswer").val(), function(obj) {
				if(obj != undefined && obj.match == true) {
					$(".error").hide();
					$('#authDialog').dialog('close');
					jQuery.orange.config.api.authorization.login(
						"admin",
						"admin",
						function(connected) {
							if (connected){
								$("#authDialog").orangeLoad(menu.mapping.forgetPassword2, {LOGIN: "admin"});
								$("#authDialog").dialog({
									autoOpen: true,
									modal: true,
									width: "500px",
									minHeight: "200px",
									open: function() {
									jQuery.orange.widget.Form.alignFormInputs.call( $("#forgetPassword2 form")[0] );
									}
								});
							}
						});
				}
				else {
					$(".error").show();
				}
			});
			
		});
		
		/*close dialog*/
		$("#forgetPassword1>a.close").bind("click",function() {		
			$("#authDialog").dialog('close');
			$("#global").orangeLoad(menu.mapping.home);
			installation_toggleDisplay(true);
			
		});
	},
	postLoad: function() {
		$("#failedpassLenght").hide();
		$("#failedpassCheck").hide();
	}
};

function forgetPassword_checkPassword() {
	if (($("#newPassword").val().length >= 4
		&& $("#newPassword").val().length <= 32)
		&& $("#newPassword").val() == $("#confirmNewPassword").val())
	{
		$("#validateBtn").setDisabled(false);
	}
	else {
		$("#validateBtn").setDisabled(true);
	}
	
	if ($("#newPassword").val().length >= 4
		&& $("#newPassword").val().length <= 32)
	{
		$("#failedpassLenght").hide();
	} else {
		$("#failedpassLenght").show();
	}
	if ($("#newPassword").val() == $("#confirmNewPassword").val()){
		$("#failedpassCheck").hide();
	} else {
		$("#failedpassCheck").show();
	}
}

jQuery.orange.config.areacontent.forgetPassword2 = {
	postParse: function() {
		$("#cancelBtn").add("#validateBtn").setDisabled(true);

		$("#newPassword").bind("change keyup", function() {
			if ($("#newPassword").val() != "") {
				$("#cancelBtn").setDisabled(false);
				forgetPassword_checkPassword();
			} else if ($("#newPassword").val() == "" && $("#confirmNewPassword").val() == "") {
				$("#cancelBtn").setDisabled(true);
				$("#validateBtn").setDisabled(true);
			}
		});

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
			$("#global").orangeLoad(menu.mapping.home);
			installation_toggleDisplay(true);
		});

		$("#cancelBtn").click(function() {
			$("#newPassword").val("");
			$("#confirmNewPassword").val("");
			$("#newPassword").trigger("change");
			$("#confirmNewPassword").trigger("change");
		});

		$("#validateBtn").click(function() {
			var Password = "Device/UserAccounts/ManagedUsers/ManagedUser[Login='admin']/Password";
			var id2value = {};
			var hashPass = jQuery.orange.config.api.client.hashPassword( $("#confirmNewPassword").val() );
			id2value[Password] = hashPass;
			jQuery.orange.config.api.crud.update(id2value, function() {
					$('#authDialog').dialog('close');
					$('#isConnected').show();
					$("#global").orangeLoad(menu.mapping.home);
					installation_toggleDisplay(true);
				}
			);
		});
		
		/*close dialog*/
		$("#forgetPassword2>a.close").bind("click",function() {		
			$("#authDialog").dialog('close');
			$("#global").orangeLoad(menu.mapping.home);
			installation_toggleDisplay(true);
			
		});
	}
};