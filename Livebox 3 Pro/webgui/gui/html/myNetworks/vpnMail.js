jQuery.orange.config.areacontent.vpnMail = {
		preParse: function() {
			var userRef = $("#content").data('selectedUserName');
			if(userRef == undefined){
				userRef = "";
			}
			
			$("#userRef").attr("ref",userRef);
		  	$("#destinationmail").attr("dataid","Device/Networks/WAN[@name='WAN']/VPN/VPNUsers/VPNUser[@Login='"+userRef+"']/Email");

		  	$("#content").removeData('selectedUserName');
		},
		postParse: function() {
		},
		postLoad: function(area){
			
			$("#help").bind("click",function() {
				helpPopup("html/main/help_vpnMail.html");
			});
			
			// Since we cannot create an user without email, we have provided a fake one that we must now remove
			if($("#destinationmail")[0].getDataValue() == "email@domain.com"){
				$("#destinationmail")[0].setDataValue("");
				$("#destinationmail").trigger('valueChange');
			}else{
				$("#destinationmail").trigger('valueChange');
				$("#sendMail").setDisabled(false);
				$("#validMail").setDisabled(false);
			}
			
			// Remove any regex that comes from the box because they are not good enough
			$("#sourcemail").removeAttr("regex");
			$("#destinationmail").removeAttr("regex");
			
			
			//positionnning tooltips
			$("#sourcemail").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnMail.sourcemail.tip"]);
			$("#destinationmail").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnMail.destinationmail.tip"]);
			$("#validMail").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnMail.valid"]);
			$("#backToUserVpn").attr('title',jQuery.orange.config.i18n.map["page.myNetwork.vpn.vpnMail.return"]);

			$("#sendMail").bind('click',function(){
				openConfirmationPopup('popup.vpn.mail.title', 'popup.vpn.mail.text',
					function() {
						$("#vpnMail form").submit();
					});
				});
			
			$("#vpnMail form")[0].crudCallDelegate = function(crudExec) {
				crudExec();
				area.popupOnUnsubmitted = false;
				jQuery.orange.widget.MenuItem.setCurrent('m2.m27');
			};

			$("#backToUserVpn").bind("click",function(){
				$("#content").data("selectedUserName",$("#userRef").attr("ref"));
				jQuery.orange.widget.MenuItem.setCurrent('m2.m273');
			});
			
			$("#userForm")[0].setButtonsDisabled = function(newState) {
				jQuery.orange.widget.Form.setButtonsDisabled.call(this, newState);
				$("#sendMail").setDisabled(newState == jQuery.orange.widget.Form.STATE_KO);
				// The 'validate' button must be available even if there are no modifs
				$("#validMail").setDisabled(newState == jQuery.orange.widget.Form.STATE_KO);
			};
			var currentState = jQuery.orange.widget.Form.getState.call($("#userForm")[0]);
			$("#userForm")[0].setButtonsDisabled(currentState);
		}
};
