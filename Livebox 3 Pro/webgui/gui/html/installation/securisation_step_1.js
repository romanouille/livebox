jQuery.orange.config.areacontent.securisation_step_1 = {
	postParse: function(area) {
	},
	postLoad: function() {
		$(".myInfo").simpletooltip({ showEffect: "fadeIn", hideEffect: "fadeOut" });
		$("#jump2installation_step_4").bind('click',function(){
			$("#global").orangeLoad(menu.mapping.installation_step_4);
		});

		var onClickNext = function(){
			var id2value = {};		
			var userlogin = "admin";
			var XPassword = "Device/UserAccounts/ManagedUsers/ManagedUser[Login='"+userlogin+"']/Password"; 
			var hashPass = jQuery.orange.config.api.client.hashPassword( $("#newPassword")[0].getDataValue() );
			id2value[XPassword] = hashPass;
			jQuery.orange.config.api.crud.update(id2value);
			
			$("#global").orangeLoad(menu.mapping.securisation_step_2);
		};
		
		var validationDisable = function(){
			$("#jump2securisation_step_2").addClass("disabled");
			$("#jump2securisation_step_2").unbind('click');
			$("#jump2securisation_step_2 img").attr('src','theme/webCorporate/image/installation/btn_etape_suivante_off.gif');			
		};
		
		var validationEnable = function(){
			$("#jump2securisation_step_2").removeClass("disabled");
			$("#jump2securisation_step_2").unbind('click');
			$("#jump2securisation_step_2").bind('click', onClickNext);
			$("#jump2securisation_step_2 img").attr('src','theme/webCorporate/image/installation/btn_etape_suivante.gif');
		};
		
		var password_checkCurrent = function(hasFocus) {
			var oldHashPassword = jQuery.orange.config.api.client.getPassword();
			var password = $("#oldPassword input[type='password']").val();
			var hashPassword = jQuery.orange.config.api.client.hashPassword(password);
			
			var isCorrect = hashPassword == oldHashPassword;
			
			if (hasFocus != undefined) {
				if(isCorrect || hasFocus || password == "") {
					$("#errorcurrent").hide();
					$("#oldPassword").removeClass('errorInput');
				} else {
					$("#errorcurrent").show();
					$("#oldPassword").addClass('errorInput');
				}
			}
			
			return isCorrect;
		};

		var password_checkNew = function (hasFocus) {

			var newpasswordValue = $("#newPassword input[type='password']").val();
			var isCorrect = newpasswordValue != "" && 4 <= newpasswordValue.length && newpasswordValue.length <= 32;
			
			if (hasFocus != undefined) {
				if (isCorrect || newpasswordValue == "") {
					// Never display an error if field is empty
					$("#newPassword").removeClass('errorInput');
					$("#erroronsize").hide();
				} else {
					if (hasFocus && newpasswordValue.length < 4) {
						// Do not display an error while typing
					} else {
						$("#newPassword").addClass('errorInput');
						$("#erroronsize").show();
					}
				}
			}
			
			return isCorrect;
		};

		var  password_checkConfirm = function (hasFocus) {
			var newpasswordValue = $("#newPassword input[type='password']").val();
			var confirmValue = $("#confirmPassword input[type='password']").val();
			var isCorrect = (newpasswordValue == confirmValue);
			
			if (hasFocus != undefined) {
				if (isCorrect || confirmValue == "" || newpasswordValue == "" || hasFocus && newpasswordValue.startsWith(confirmValue)) {
					$("#erroronsamepass").hide();
					$("#confirmPassword").removeClass('errorInput');
				} else {
					$("#erroronsamepass").show();
					$("#confirmPassword").addClass('errorInput');
				}
			}
			
			return isCorrect;
		};
		
		var password_enableDisableWigets = function() {
			var allCorrect = password_checkCurrent() && password_checkNew() && password_checkConfirm();

			if (allCorrect) {
				validationEnable();
			} else {
				validationDisable();
			}
		};
		
		$("#oldPassword input[type='text']").bind("blur", function() {
			password_checkCurrent(false);
		});
		
		$("#oldPassword").bind('change keyup', function() {
			password_checkCurrent(true);
			password_enableDisableWigets();
		});

		$("#newPassword").bind('keyup', function() {
			password_checkNew(true);
			password_checkConfirm(true);
			password_enableDisableWigets();
		});

		$("#newPassword input[type='text']").bind('blur', function(event) {
			password_checkNew(false);
		});

		$("#confirmPassword").bind('keyup', function() {
			password_checkConfirm(true);
			password_enableDisableWigets();
		});

		$("#confirmPassword input[type='text']").bind('blur', function() {
			password_checkConfirm(false);
		});
		
		// Grosse astuce pour avoir un évènement sur perte de focus à la fois sur le nouveau mot de passe et sur la confirmation
		$("#oldPassword input[type='text']").bind('focus', function() {
			password_checkConfirm(false);
		});
		customizeInstallForm();
	}
};