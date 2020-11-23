jQuery.orange.config.areacontent.securisation_step_2 = {
		postParse: function(area) {
		},
		postLoad: function() {
			$(".myInfo").simpletooltip({ showEffect: "fadeIn", hideEffect: "fadeOut" });
			
			// Initialise la question secrète si elle est vide
			try {
				var XsecretQuery = "Device/UserAccounts/ManagedUsers/ManagedUser[Login=\'"+jQuery.orange.config.api.client.user+"\']/SecretQuery";
				if ($("#sQuery")[0].dataValueRef == "") {
					var id2value = {};
					id2value[XsecretQuery] = jQuery.orange.config.i18n.map["page.myAccount.password.secretquery.defaultcontent"];
					jQuery.orange.config.api.crud.update(id2value);
				}
			} catch (err) {
			}
			
			
			$("#jump2securisation_step_1").bind('click',function(){
				$("#global").orangeLoad(menu.mapping.securisation_step_1);
			});
			var onClickNext = function(){
				var id2value = {};
				var userlogin = $("#userlogin")[0].getDataValue();
				var XsAnswer = "Device/UserAccounts/ManagedUsers/ManagedUser[Login='"+userlogin+"']/SecretAnswer"; 
				var sAnswer = $("#sAnswer")[0].getDataValue();
				id2value[XsAnswer] = sAnswer;
				jQuery.orange.config.api.crud.update(id2value);
				
				$("#global").orangeLoad(menu.mapping.securisation_step_3);
			};
			
			$("#sAnswer").bind('keyup blur',function(event){
				$("#emptySecretAnswer").hide();
				$("#sAnswer").removeClass('errorInput');
				$("#jump2securisation_step_3").removeClass("disabled");
				$("#jump2securisation_step_3").unbind('click');
				$("#jump2securisation_step_3").bind('click', onClickNext);
				$("#jump2securisation_step_3 img").attr('src','theme/webCorporate/image/installation/btn_etape_suivante.gif');
				if(event.type="blur" && $("#sAnswer")[0].getDataValue()==""){
					$("#emptySecretAnswer").show();
					$("#sAnswer").addClass('errorInput');
					$("#jump2securisation_step_3").addClass("disabled");
					$("#jump2securisation_step_3").unbind('click');
					$("#jump2securisation_step_3 img").attr('src','theme/webCorporate/image/installation/btn_etape_suivante_off.gif');
				}
			});
			customizeInstallForm();
		}
	};