jQuery.orange.config.areacontent.simplereboot_oninstall = {
		postLoad: function() {
			// Wait for end of reboot
			waitForRebootAndReload();
		}
};