function restrictions_ensureDatamodelIsInitialized() {
	var daysMap = {'MONDAY':1, 'TUESDAY':1, 'WEDNESDAY':1, 'THURSDAY':1, 'FRIDAY':1, 'SATURDAY':1, 'SUNDAY':1};
	var XpathDevice = $('#restriction span:eq(0)').text() + "/BlacklistedSchedule/ManagementDay";
	jQuery.orange.config.api.crud.read([ XpathDevice ], function(result) {
		for (var xpathKey in result) {
			for (var managementDayKey in result[xpathKey].values) {
				var managementDay = result[xpathKey].values[managementDayKey];
				if (daysMap[managementDay.DayIndex] != undefined) {
					daysMap[managementDay.DayIndex] = undefined;
				}
			}
		}
		// The days that are not already existing are added
		var actions = [];
		for (var day in daysMap) {
			if (daysMap[day] != undefined) {
				var attrs = {'DayIndex': day};
				for (var h = 0; h < 24; h++) {
					attrs["Hours" + h] = true;
				}
				actions.push({ crud: 'create', id: XpathDevice, attrs: attrs });
			}
		}
		if (actions.length > 0) {
			jQuery.orange.config.api.crud.exec(actions);
		}
	});
}

jQuery.orange.config.areacontent.restriction = {
	preParse: function() {
		restrictions_ensureDatamodelIsInitialized();
		
		var i18n_title = $("#content").data("title");
		var XpathRouter = $("#content").data("XpathRouter");
		var i18n_subtilte=$("#content").data("i18n_subtilte");
		var url=$("#content").data("url");
		
		var XpathDevice = $('#restriction span:eq(0)').text();
		$("#btnBackEquip").attr("widgetArg","{MenuItem: {menu: 'm3.m31.m311', subst: {i18n_title : '"+i18n_title+"',i18n_subtilte : '"+i18n_subtilte+"',XpathRouter : '"+XpathRouter+"', XpathDevice: '"+XpathDevice.replace(/\'/g,"\\\'")+"', url:'"+url+"'}}}");

		var days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY','FRIDAY', 'SATURDAY', 'SUNDAY'];
		for(var d in days) {
			for(var i=0;i<24;i++) {
				$('#restriction form').append('<input style="display:none" id="'+days[d]+'_Hours'+i+'" type="checkbox" dataId="'+XpathDevice+'/BlacklistedSchedule/ManagementDay[@DayIndex=\''+days[d]+'\']/Hours'+i+'">');
			}
		}
		
		$("#restriction input[type='button'][class!='allon'][class!='alloff']").each(function() {
			$(this).attr('i18n', 'page.myEquipments.restriction.hour');
		});
		
		$("#restriction input[type='button'][class='allon']").each(function() {
			$(this).attr('i18n', 'page.myEquipments.restriction.on');
		});
		
		$("#restriction input[type='button'][class='alloff']").each(function() {
			$(this).attr('i18n', 'page.myEquipments.restriction.off');
		});
	},
	postLoad: function() {
		
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_restriction.html");
		});
				
		$("#restriction input[type='button'][class='onetoggle']").each(function() {
			var associed_ck = $('#'+$(this).parent().parent().attr('id')+'_Hours'+$(this).val());

			if( associed_ck[0].checked ) {
				$(this).removeClass('active');
				$(this).addClass('deactive');
			}
			else {
				$(this).removeClass('deactive');
				$(this).addClass('active');
			}
			
			$(this).bind('click', function() {
				associed_ck[0].checked = !associed_ck[0].checked;
				associed_ck.trigger('valueChange');
			});
			
			associed_ck.bind('valueChange', function() {
				var id = this.id;
				var day = id.substring(0, id.indexOf('_'));
				var hour = id.substring(id.indexOf('_')+6, id.length);
							
				if(this.checked) {
					$("#restriction #"+day+" input[type='button'][value='"+hour+"']").removeClass('active');
					$("#restriction #"+day+" input[type='button'][value='"+hour+"']").addClass('deactive');
				}
				else {
					$("#restriction #"+day+" input[type='button'][value='"+hour+"']").removeClass('deactive');
					$("#restriction #"+day+" input[type='button'][value='"+hour+"']").addClass('active');
				}
			});
		});
		
		$("#restriction input[type='button'][class='allon']").each(function() {
			$(this).bind('click', function() {
				var input_list = $(this).parent().parent().children('td').children('input[class!="allon"][class!="alloff"]');
				input_list.each(function(){
					var associed_ck = $('#'+$(this).parent().parent().attr('id')+'_Hours'+$(this).val());
					associed_ck[0].checked = false;
					associed_ck.trigger('valueChange');
				});
			});
		});
		
		$("#restriction input[type='button'][class='alloff']").each(function() {
			$(this).bind('click', function() {
				var input_list = $(this).parent().parent().children('td').children('input[class!="allon"][class!="alloff"]');
				input_list.each(function(){
					var associed_ck = $('#'+$(this).parent().parent().attr('id')+'_Hours'+$(this).val());
					associed_ck[0].checked = true;
					associed_ck.trigger('valueChange');
				});
			});
		});
	}
};