var authenticationFailed = false;

jQuery.orange.config.areacontent.installation_step_2 = {
	preParse: function() {
	},
	postParse: function(area) {
		$("#jump2installation_step_1").bind('click',function(){
			$("#global").orangeLoad(menu.mapping.installation_step_1);
		});
		
		var onClickNext = function(){
			var pppUser = "Device/Networks/WAN[@name='WAN']/PPP/Username";
			var id2value = {};
			var newInternalUsername = $("#username")[0].getDataValue();
			if (newInternalUsername.substring(0, 4) != "fti/") {
				newInternalUsername = "fti/" + newInternalUsername;
			}
			id2value[pppUser] = newInternalUsername;
			jQuery.orange.config.api.crud.update(id2value);
			var pppPaswword = "Device/Networks/WAN[@name='WAN']/PPP/Password";
			var id2value = {};
			id2value[pppPaswword] = $("#password")[0].getDataValue();
			jQuery.orange.config.api.crud.update(id2value);
			
			$("#global").orangeLoad(menu.mapping.installation_step_3);
		};
				
		//gestion lettre exemple
		$("#letter_std").dialog({
			autoOpen: false,
			modal: true,
			minHeight: "586px",
			width:"681px",
			marginTop:"70px",
			marginBottom:"70px",
			border:"1px solid #F60",
			open: function() {
				$('.close').blur();
			}
		});
		$("#letter_link").bind("click",function(){
			$('#letter_std').dialog('open');
		});
		$("#letter_std a").bind("click",function(){
			$("#letter_std").dialog('close');
		});
		
		//gestion du formulaire (bouton active/desactive)
		$("#username").add($("#password")).bind('change keyup', function(){
			var userlength = $("#username").val().length;
			
			if ($("#username").val().substring(0, 4) == "fti/") {
				userlength = userlength - 4;
			}
			
			if( userlength < 4 
					|| userlength > 64
					||  $("#password input[type='password']").val().length < 4
					||  $("#password input[type='password']").val().length > 29 ) {
				$("#jump2installation_step_3").addClass("disabled");
				$("#jump2installation_step_3").unbind('click');
				$("#jump2installation_step_3 img").attr('src','theme/webCorporate/image/installation/btn_etape_suivante_off.gif');
			}else{
				$("#jump2installation_step_3").removeClass("disabled");
				$("#jump2installation_step_3").unbind('click');
				$("#jump2installation_step_3").bind('click', onClickNext);
				$("#jump2installation_step_3 img").attr('src','theme/webCorporate/image/installation/btn_etape_suivante.gif');
			}
		});
		
		if($("#container").data('detectedStatus') == "PPP_AUTHENTICATION_FAILED"){
			$("#ppperror").css('display','block');
			authenticationFailed = true;
		}
		else {
			authenticationFailed = false;
		}
	},
	postLoad: function(area) {
		if (authenticationFailed){
			$("#username").addClass('errorInput');
			$("#password").addClass('errorInput');
		}
	}
};