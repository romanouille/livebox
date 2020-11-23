jQuery.orange.config.areacontent.userEquipment = {
	preParse: function() {
		try {
			fr.orange.livebox.gui.pages.engine.EquipmentPresenter.initWidget();
		} catch(err) {
			//alert(err);
		}
		$('#content').removeData('XDeviceRestriction');
	},
	postParse: function() {
	}
};
