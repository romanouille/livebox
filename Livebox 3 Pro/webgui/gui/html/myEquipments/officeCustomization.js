function officeCustomization_tableAddRow(id, attrs) {
	// this = widget node	
	var tr;
	if (attrs != undefined && attrs.uid != undefined) {
		currentId = $("#officeCustomizationTable").attr("dataid") + "[@uid='"+attrs.uid+"']"; 
		tr = jQuery.orange.widget.Table.addRow.call(this, currentId, attrs);
		
		var dataId = $("td:eq(0) input", tr).attr("dataid");
		dataId = dataId.replace("/Name", "/@Name");
		$("td:eq(0) input", tr).attr("dataid", dataId);
	}
	else if (id != undefined) {
		currentId = $("#officeCustomizationTable").attr("dataid") + "[@uid='"+id+"']"; 
		tr = jQuery.orange.widget.Table.addRow.call(this, currentId, attrs);
		
		var dataId = $("td:eq(0) input", tr).attr("dataid");
		dataId = dataId.replace("/Name", "/@Name");
		$("td:eq(0) input", tr).attr("dataid", dataId);
	}
	else{
		tr = jQuery.orange.widget.Table.addRow.call(this, id, attrs);
	}

	return tr;
}

jQuery.orange.config.areacontent.officeCustomization = {
	postParse: function() {
		$("#officeCustomizationTable")[0].addRow = officeCustomization_tableAddRow;
	},
	postLoad: function() {
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_officeCustomization.html");
		});
		
		$("#officeCustomizationTable .table-add-button img").attr('i18n', 'page.myEquipments.officeCustomization.add').parent().orangeParse();
		
		$("#officeCustomizationTableErr").insertAfter($("#officeCustomizationTable>form>table"));
	}
};