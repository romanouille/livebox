jQuery.orange.config.areacontent.restore = {
	postParse: function(area) {
		$("#selectedfile").parent().hide();
		$("#btnRestore").setDisabled(true);
		$("#saveFileChooser").bind('change', function(event) {
			var GOOD = fr.orange.livebox.gui.api.ProgressiveRegexp.GOOD;
			$("#saveFileChooser")[0].setFocus(false); // force the error message to always be displayed
			var ok = jQuery.orange.widget.Form.verifyConstraints($("#saveFileChooser")[0], true) == GOOD;
			if (ok) {
				$("#selectedfile").html($("#saveFileChooser").val());
				$("#selectedfile").parent().show();
			} else {
				$("#selectedfile").parent().hide();
			}
			$("#btnRestore").setDisabled(!ok);
		});

		$("#btnRestore").click(function(){
			var boxName = $("#restore h1 span:eq(1)").text();
			openConfirmationPopup('popup.restore.title', 'popup.restore.text',
				function() {
					var req = jQuery.orange.config.api.client.newRequest();
		            req.uploadFile("Device/DeviceInfo/VendorConfigFile", '#saveFileChooser',
		                function () {
		            		//TODO workaround en attendant Que sagem ne reboot pas la boite avant la callback
		                },
		                function () {
		                  alert("Erreur de restauration");
		                });
		            req.send();
		            showRebootPage(boxName);
				});
		});
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_restore.html");
		});
	}
};