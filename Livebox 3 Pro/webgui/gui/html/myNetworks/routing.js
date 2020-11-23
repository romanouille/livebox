function routing_tableAddRow(id, attrs) {
	// this = widget node
	var tr;
	if (id != undefined) {
		currentId = "Device/RoutesInfo/RouteInfo[@uid='"+id+"']"; 
		tr = jQuery.orange.widget.Table.addRow.call(this, currentId, attrs);
	}else{
		tr = jQuery.orange.widget.Table.addRow.call(this, id, attrs);
		$("td:eq(4) input", tr).val("0");
		$("td:eq(5) input", tr)[0].setDataValue(true);
	}	
	return tr;
}

jQuery.orange.config.areacontent.routing = {
	postLoad: function() {
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_routing.html");
		});
		
		$("#routingTable .table-add-button img").attr('i18n', 'page.myNetwork.routing.add').parent().orangeParse();
		$("#routingTableErr").insertAfter($("#routingTable table"));
		
		$("#routingTable")[0].addRow = routing_tableAddRow;
	}
};