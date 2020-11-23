function auth_grayBtn() {
	var grayBtn = $('#uLogin').val() == "" || $('#uPassword').val() == "";
	$('#btnAuth').setDisabled(grayBtn);
	
	if(grayBtn){		
		$('#btnAuth > img ').attr('src','theme/webCorporate/image/fr/btn_seconnecter_off.gif');
	}else{
		$('#btnAuth > img ').attr('src','theme/webCorporate/image/fr/btn_seconnecter.gif');
	}
}

function authentificationRemoteInit(callback) {
	
		auth_grayBtn();
	
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
			authenticate(callback);
		});
}

function authenticate(callback) {
	uLogin = $("#uLogin").val();
	uPassword = $("#uPassword").val();
	jQuery.orange.config.api.authorization.login(
		uLogin,
		uPassword,
		function(connected) {
			if (! connected) {	
				$('#failedAuthMsg').removeClass('hidden');
				return false;
			}else{
				$('#failedAuthMsg').removeClass('hidden');
			}

			callback(true)	;
			$("#authDialog").dialog('close');
			lastActionTime = new Date().getTime();
		}
	);
};
