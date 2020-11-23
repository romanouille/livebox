jQuery.orange.config.areacontent.reinitialisationAP = {
	postParse: function() {
		$("#btnReinitBox").click(function(){
			openConfirmationPopup('popup.reinitlivebox.title', 'popup.reinitlivebox.text',
				function() {
					var boxName = $("#reinitialisationAP h1 span:eq(1)").text();
					// TODO
				});
		});
	}
};