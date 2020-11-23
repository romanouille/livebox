jQuery.orange.config.areacontent.liveboxEnvironment = {
	preParse: function() {
		try {
			fr.orange.livebox.gui.pages.engine.EquipmentPresenter.initWidget();
		} catch(err) {
			//alert(err);
		}
	}
};
