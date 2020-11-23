jQuery.orange.config.areacontent.infoSystemMeshSynchro = {
	postParse: function() {
		$("#help").bind("click",function() {
			helpPopup("html/main/help_infoSystem.html");
		});
	},
	postLoad: function() {
		jQuery.orange.config.api.rpc.syncNetwork(function(success) {
			if (success) {
				waitForRebootAndReload();
			} else {
				openErrorPopup();
				$("#error_popup").bind("closePopup", function() {
					jQuery.orange.widget.MenuItem.setCurrent("m4.m40.m407");
				});
			}
		});
	}
};