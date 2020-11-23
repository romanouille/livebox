/**
 * Update the progress bar widget
 * 
 * @param percentage
 *            a percentage between 0.0 and 1.0
 */
function updateInProgress_onProgressChange(percentage) {
	if (percentage < 0.0) percentage = 0.0;
	if (percentage > 1.0) percentage = 1.0;
	$('#completeStatus')[0].setDataValue(percentage * 100);
	$(".progressbar-text").html(percentage * 100 + "%");
}

/**
 * Function to call when the box starts to reboot
 */
function updateInProgress_onRebooting() {
	var liveboxName = $('#updateInProgress h1 span:eq(1)').text();
	showRebootPage(liveboxName);
	// Starts the detection of the end of the reboot
	onRebootDone(function() {
		// Reload the full application once the box is back online
		window.location="index.html";
	});
}

jQuery.orange.config.areacontent.updateInProgress = {
	postParse: function() {
		$('#completeStatus').attr('maxvalue', '100');
		
		var internatStatusSurveyRequest = jQuery.orange.config.api.client.newRequest();
		internatStatusSurveyRequest.onPeriodicValue(
			"Device/DeviceInfo/UpdateStatus", 
			function(newvalue) {
				// first check if the page is still active (i.e. the user did not change page)
				if ($('#completeStatus')[0] != undefined) {
					// Update the progress bar
					updateInProgress_onProgressChange(newvalue);
					
					// If the update is finished, redirect to the 'Please wait for reboot' page
					if (newvalue >= 1.0) {
						updateInProgress_onRebooting();
					}
				}
			}, 
			function() {
				//respFunc
			}, 
			function() {
				//errFunc
			}, 
			{timer:5} //options : timer in seconds --> NO EFFECT at this time 07/12/2011
		);
		internatStatusSurveyRequest.send();
		
		// Start the detection of the reboot of the box to display the 'Please wait for reboot' page
		onRebootStart(updateInProgress_onRebooting);
	}
};