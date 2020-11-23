function auth_grayBtn() {
	$('#btnAuth').setDisabled($('#uLogin').val() == "" || $('#uPassword').val() == "");
}

jQuery.orange.config.areacontent.auth = {
	postParse: function() {
		if( $.cookie("orangeliveboxauth") != null) {
			var obj = jQuery.parseJSON($.cookie("orangeliveboxauth"));
			$('#uLogin').val(obj.login);
			$('#uPassword').val(obj.password);
			$("#rememberpassword")[0].checked = true;
		}
		auth_grayBtn();

		$("#auth>a.close").bind("click",function() {
			$("#authDialog").dialog('close');
			if (typeof targetMenuIdAfterLogin != "undefined") {
				delete targetMenuIdAfterLogin;
				delete targetSubstitutionsAfterLogin;
			}

			/*if (typeof simultRingValueAfterLogin != "undefined")
				delete simultRingValueAfterLogin;*/

			jQuery.orange.widget.MenuItem.setCurrent("m0");
		});

		$('#uLogin').focus();

		$('#uLogin').add($('#uPassword')).bind('keyup change', function() {
			auth_grayBtn();
		});

		$('#uLogin').add($('#uPassword')).bind('keypress', function(e) {
			var keycode = (e.keyCode ? e.keyCode : e.which);
			if(keycode==13 && ($('#btnAuth').attr('disabled') == undefined || $('#btnAuth').attr('disabled') == false)) {
				$('#btnAuth').trigger('click');
			}
		});


		$('#btnAuth').bind("click",function() {
			jQuery.orange.config.areacontent.auth.authenticate();
			if (window.location.hash.indexOf("m2.m2112") != -1  || window.location.hash.indexOf("m2.m2113") != -1  ){
				setTimeout(function () {jQuery.orange.widget.MenuItem.setCurrent('m2.m211');},1000);
			}
		});
		
		$("#forgetPassword").bind("click",function() {
			var SecretQuery = "Device/UserAccounts/ManagedUsers/ManagedUser[Login='admin']/SecretQuery";
			jQuery.orange.config.api.crud.read(
				[SecretQuery],
				function (result) {
					if (result[SecretQuery]) {
						$('#authDialog').dialog('close');
						//$("#global").orangeLoad(menu.mapping.forgetPassword, {LOGIN: $("#uLogin").val()});
						/* open forget password dialog*/
						$("#authDialog").orangeLoad(menu.mapping.forgetPassword,{LOGIN: $("#uLogin").val()});
						$("#authDialog").dialog({
							autoOpen: true,
							modal: true,
							width: "500px",
							minHeight: "200px",
							open: function() {
							jQuery.orange.widget.Form.alignFormInputs.call( $("#forgetPassword1 form")[0] );
							}
						});
					}
				}
			);
		});
	},
	authenticate: function() {
		uLogin = $("#uLogin").val();
		uPassword = $("#uPassword").val();
		jQuery.orange.config.api.authorization.login(
			uLogin,
			uPassword,
			function(connected) {
				if (! connected) {
					$("#failedAuthMsg").removeClass('hidden');
					$("errAuth").show();
					$("#uLogin").addClass('errorInput');
					$("#uPassword").addClass('errorInput');
					jQuery.orange.config.api.authorization.login("guest", "guest");
					return;
				}
				if( $("#rememberpassword")[0].checked ){
					$.cookie("orangeliveboxauth", '{"login":"'+uLogin+'", "password":"'+uPassword+'"}', { expires: 365 });
				}else{
					$.cookie("orangeliveboxauth", null);
				}
				$("#uLogin").removeClass('errorInput');
				$("#uPassword").removeClass('errorInput');
				$("#authDialog").dialog('close');
				$('#isConnected').show();
				$("#authenticationPanel").hide();
				if (typeof targetMenuIdAfterLogin != "undefined") {
					jQuery.orange.widget.MenuItem.setCurrent(targetMenuIdAfterLogin, targetSubstitutionsAfterLogin);
					delete targetMenuIdAfterLogin;
					delete targetSubstitutionsAfterLogin;
				}

				/*if (typeof simultRingValueAfterLogin != "undefined") {
					$("#simultRingRadio")[0].setDataValue(simultRingValueAfterLogin);
					delete simultRingValueAfterLogin;
				}*/

				lastActionTime = new Date().getTime();
			}
		);
	}
};