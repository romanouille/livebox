function password_checkCurrent(hasFocus) {
	var oldHashPassword = jQuery.orange.config.api.client.getPassword();
	var password = $("#currentpassword input[type='password']").val();
	var hashPassword = jQuery.orange.config.api.client.hashPassword(password);
	
	var isCorrect = hashPassword == oldHashPassword;
	
	if (hasFocus != undefined) {
		if(isCorrect || hasFocus || password == "") {
			$("#errorMsgCurrentDiff").hide();
			$("#currentpassword").removeClass('errorInput');
		} else {
			$("#errorMsgCurrentDiff").show();
			$("#currentpassword").addClass('errorInput');
		}
	}
	
	return isCorrect;
}

function password_checkNew(hasFocus) {

	var newpasswordValue = $("#newpassword input[type='password']").val();
	var isCorrect = newpasswordValue != "" && 4 <= newpasswordValue.length && newpasswordValue.length <= 32;
	
	if (hasFocus != undefined) {
		if (isCorrect || newpasswordValue == "") {
			// Never display an error if field is empty
			$("#newpassword").removeClass('errorInput');
			$("#errorMsgLength").hide();
		} else {
			if (hasFocus && newpasswordValue.length < 4) {
				// Do not display an error while typing
			} else {
				$("#newpassword").addClass('errorInput');
				$("#errorMsgLength").show();
			}
		}
	}
	
	return isCorrect;
}

function password_checkConfirm(hasFocus) {
	var newpasswordValue = $("#newpassword input[type='password']").val();
	var confirmValue = $("#newpasswordconfirm input[type='password']").val();
	var isCorrect = (newpasswordValue == confirmValue);
	
	if (hasFocus != undefined) {
		if (isCorrect || confirmValue == "" || newpasswordValue == "" || hasFocus && newpasswordValue.startsWith(confirmValue)) {
			$("#errorMsgNewDiff").hide();
			$("#newpasswordconfirm").removeClass('errorInput');
		} else {
			$("#errorMsgNewDiff").show();
			$("#newpasswordconfirm").addClass('errorInput');
		}
	}
	
	return isCorrect;
}

function password_secretanswerFocus() {
	$("#secretanswer")[0].setDataValue("");
	$(this).unbind('focus', password_secretanswerFocus);
	password_enableDisableWigets();
}

function password_checkSecretAnswer() {
	var secretAnswer = $("#secretanswer")[0].getDataValue();
	var isCorrect = secretAnswer.length > 0;
	return isCorrect;
}

function password_enableDisableWigets() {
	var allPasswordsCorrect = password_checkCurrent() && password_checkNew() && password_checkConfirm();
	var secretquery = $("#secretquery")[0].getDataValue();
	var secretqueryCorrect = false;
	
	if (secretquery.length > 0) {		
		secretqueryCorrect =  true;
	}
	
	var secretanswer = $("#secretanswer")[0].getDataValue();
	var secretanswerCorrect= false;
	
	if (password_checkSecretAnswer()){
		secretanswerCorrect= true;
	}
	
	var allCorrect = allPasswordsCorrect && secretanswerCorrect && secretqueryCorrect; //&& password_checkSecretAnswer() 
	
	if (allPasswordsCorrect) {
		$("#secretquery").setDisabled(false);
		$("#secretanswer").setDisabled(false);
	} else {
		$("#secretquery").setDisabled(true);
		$("#secretanswer").setDisabled(true);
	}
	
	if (allCorrect) {
		$('#btnSave').setDisabled(false);
	} else {
		$('#btnSave').setDisabled(true);
	}

	if($("#currentpassword input[type='password']").val() != ""
		|| $("#newpassword input[type='password']").val() != ""
		|| $("#newpasswordconfirm input[type='password']").val() != "") {
		$('#btnCancel').setDisabled(false);
	} else {
		$('#btnCancel').setDisabled(true);
	}
}

jQuery.orange.config.areacontent.password = {
	preParse: function() {
        // récupêrer l'utilisateur
		$("#username").html(jQuery.orange.config.api.client.user);
		$("#secretquery").attr('dataId', 'Device/UserAccounts/ManagedUsers/ManagedUser[Login=\''+jQuery.orange.config.api.client.user+'\']/SecretQuery');
		
		var XsecretQuery = "Device/UserAccounts/ManagedUsers/ManagedUser[Login=\'"+jQuery.orange.config.api.client.user+"\']/SecretQuery";
		jQuery.orange.config.api.crud.read(
			[XsecretQuery],
			function (result) {
				for(var secretQ in result[XsecretQuery].values){
					if(result[XsecretQuery].values[secretQ]==""
						|| result[XsecretQuery].values[secretQ]==undefined
						|| result[XsecretQuery].values[secretQ]==null){
						var id2value = {};
						id2value[XsecretQuery] = jQuery.orange.config.i18n.map["page.myAccount.password.secretquery.defaultcontent"];
						jQuery.orange.config.api.crud.update(id2value);
					}
				}
			});
	},
	postParse: function() {
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_password.html");
		});
		
		$("#secretquery").setDisabled(true);
		$("#secretanswer").setDisabled(true);
		
		$("#secretanswer").bind("keydown",function(){
			$("#secretanswer").attr("required",true);
			$("#secretanswer").orangeParse();
			$("#secretanswer").orangeTranslate();
		});

		$("#currentpassword input[type='text']").bind("blur", function() {
			password_checkCurrent(false);
		});
		
		$("#currentpassword").bind('valueChange', function() {
			password_checkCurrent(true);
			password_enableDisableWigets();
		});

		$("#newpassword").bind('valueChange', function() {
			password_checkNew(true);
			password_checkConfirm(true);
			password_enableDisableWigets();
		});

		$("#newpassword input[type='text']").bind('blur', function(event) {
			password_checkNew(false);
		});

		$("#newpasswordconfirm").bind('valueChange', function() {
			password_checkConfirm(true);
			password_enableDisableWigets();
		});

		$("#newpasswordconfirm input[type='text']").bind('blur', function() {
			password_checkConfirm(false);
		});
		
		// Grosse astuce pour avoir un évènement sur perte de focus à la fois sur le nouveau mot de passe et sur la confirmation
		$("#currentpassword input[type='text']").bind('focus', function() {
			password_checkConfirm(false);
		});
		
		$("#currentpassword, #newpassword, #newpasswordconfirm").bind('valueChange', function() {
			if (   $("#currentpassword input[type='text']").val() != "" 
				|| $("#newpassword input[type='text']").val() != "" 
				|| $("#newpasswordconfirm input[type='text']").val() != ""  
					){
				$("#saveOkNoSecure").css('display','none');
				$("#saveOkSecure").css('display','none');
			}
		});

		$("#secretanswer").bind('valueChange change keyup', function() {
			password_checkSecretAnswer();
			password_enableDisableWigets();
		});
		
		$("#secretquery").bind('valueChange change keyup', function() {
			password_enableDisableWigets();
		});
		
		$("#secretanswer input[type='text']").bind('focus', password_secretanswerFocus);

		$('#btnSave').bind('click', function() {
			// grise le bouton annuler
			$('#btnCancel').setDisabled(true);
			
			$("#secretanswer input[type='text']").bind('focus', password_secretanswerFocus);
		});
		
		$('#btnCancel').bind('click', function() {
			$("#currentpassword input[type='password']").val("");
			$("#currentpassword input[type='text']").val("");

			$("#newpassword input[type='password']").val("");
			$("#newpassword input[type='text']").val("");

			$("#newpasswordconfirm input[type='password']").val("");
			$("#newpasswordconfirm input[type='text']").val("");

			$("#secretanswer input[type='text']").bind('focus', password_secretanswerFocus);

			$("#saveOkNoSecure").hide();
			$("#saveOkSecure").hide();

			$("#errorMsgNewDiff").hide();
			$("#errorMsgCurrentDiff").hide();
			$("#errorMsgLength").hide();

			$("#currentpassword").removeClass('errorInput');
			$("#newpassword").removeClass('errorInput');
			$("#newpasswordconfirm").removeClass('errorInput');
			
			$("#errorMsgLength").hide();
			$("#errorMsgNewDiff").hide();
			$("#errorMsgCurrentDiff").hide();

			$("#secretquery").setDisabled(true);
			$("#secretanswer")[0].setDataValue("");
			$("#secretanswer").setDisabled(true);
			
			$('#btnCancel').setDisabled(true);
			$('#btnSave').setDisabled(true);
		});
        //pour enregistré , crudCallDelegate pour faire des controles sur les champs avant d'exicuter le save (crudExec)

		//pour enregistrer
		$("#password form")[0].crudCallDelegate = function(crudExec) {
			var id2value = {};		
			var Password = 'Device/UserAccounts/ManagedUsers/ManagedUser[Login=\''+jQuery.orange.config.api.client.user+'\']/Password';
			var hashPass = jQuery.orange.config.api.client.hashPassword( $("#newpassword input[type='password']").val() );
			// récupére le mot de passe puis crypté et champs la valeur de mot de passe
			id2value[Password] = hashPass;

			var xpathSecretAnswer = 'Device/UserAccounts/ManagedUsers/ManagedUser[Login=\''+jQuery.orange.config.api.client.user+'\']/SecretAnswer';
			if ($("#secretanswer")[0].getDataValue()!='aaaaaaaaaaaaaaa') {
				id2value[xpathSecretAnswer] = $("#secretanswer")[0].getDataValue();		
			}
			// Update du mot de passe
			jQuery.orange.config.api.crud.update(id2value, function(errors) {
				// Verifie sur l'update du password est ok
				var isError = false;
				for(var e in errors) {
					if(e != undefined && e == Password) {
						isError = true;
					}
				}
				
				// Si update OK
				if(!isError) {
					// on affecte au gui client son nouveau mot de passe
					jQuery.orange.config.api.client._md5Pass = hashPass;
					
					if ( $("#memoryCardStatus")[0].getDataValue() != 'NOT_PRESENT' && $("#password_newpassword")[0].getDataValue() != "admin") {
						$("#saveOkSecure").css('display', 'block');
						$("#saveOkNoSecure").css('display', 'none');
					} else {
						$("#saveOkSecure").css('display', 'none');
						$("#saveOkNoSecure").css('display', 'block');
					}
				} else {
					alert("Erreur lors du changement de mot de passe");
				}
				
				$("#currentpassword input[type='text']").val("");
				$("#currentpassword input[type='password']").val("");

				$("#newpassword input[type='text']").val("");
				$("#newpassword input[type='password']").val("");

				$("#newpasswordconfirm input[type='text']").val("");
				$("#newpasswordconfirm input[type='password']").val("");

				$("#secretquery").setDisabled(true);
				$("#secretanswer").setDisabled(true);

				$("#errorMsgNewDiff").hide();
				$("#errorMsgCurrentDiff").hide();
				$("#errorMsgLength").hide();
				
				$("#currentpassword").removeClass('errorInput');
				$("#newpassword").removeClass('errorInput');
				$("#newpasswordconfirm").removeClass('errorInput');
				
				crudExec();
			});
		};

		$("#currentpassword input").attr('size', '36');
		$("#currentpassword input").css('width', '150px');
		$("#newpassword input").attr('size', '36');
		$("#newpassword input").css('width', '150px');
		$("#newpasswordconfirm input").attr('size', '36');
		$("#newpasswordconfirm input").css('width', '150px');
		
		$("#secretquery").attr('size', '73');
		$("#secretquery").css('width', '250px');
		
		$("#secretanswer input").attr('size', '73');
		$("#secretanswer input").css('width', '250px');
		$("#secretanswer")[0].setDataValue("aaaaaaaaaaaaaaa");
		$("#secretanswer input[type='text']").bind("focus", password_secretanswerFocus);
	}
};