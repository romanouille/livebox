function firmware_upgrade_inprogress_goToError() {
	try {
		fr.orange.livebox.gui.pages.installation.InstallationController.displayFirmwareUpgradeFailed();
	} catch (err) {
		alert(err);
	}
}

jQuery.orange.config.areacontent.firmware_upgrade_inprogress = {
	postLoad: function() {
		try {
			fr.orange.livebox.gui.pages.installation.InstallationController.displayFirmwareUpgradeInProgress();
		} catch (err) {
			alert(err);
		}
		jQuery.orange.config.api.rpc.requestDownload("Device",
			function(isUpdateInProgress) {
				if (isUpdateInProgress) {
				} else {
					firmware_upgrade_inprogress_goToError();
				}
			},
			function(error, reply) {
				firmware_upgrade_inprogress_goToError();
			}
		);
	}
};