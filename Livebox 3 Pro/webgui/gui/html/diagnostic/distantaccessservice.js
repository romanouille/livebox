var started=false;
var timeoutId;
var seconds=900;

function startTimer() {
	if(!started)
	{
		started=true;
		updateTimer();
	}
}

function updateTimer() {
	if(seconds>0) { 
		seconds-=1;
		$('#timer')[0].setDataValue($('#timer')[0].getDataValue() - 1);
    
		var minVar = Math.floor(seconds/60);
		var secVar = seconds%60;
		$(".progressbar-text").html( ((minVar < 10) ? "0" : "") + minVar + ((secVar < 10) ? "min 0" : "min ") + secVar + "s" );
    
		timeoutId = setTimeout("updateTimer()",1000);
	}
	else
	{
		timerEnd();
	}
}

function stopTimer() {
	started=false;
	clearTimeout(timeoutId);
	seconds=900;
	$('#timer').attr('maxvalue', '900');
	$('#timer')[0].setDataValue(900);
	$(".progressbar-text").html("15min 00s");
	$("#remain1").show();
	$("#remain2").hide();
}

function extendTimer() {
	if(seconds>0) {
		$("#remain1").hide();
		$("#remain2").show();
		seconds=7200;
		$('#timer').attr('maxvalue', '7200');
		$('#timer')[0].setDataValue(7200);
		$(".progressbar-text").html("120min 00s");
	}
}

function timerEnd() {
	started=false;
	clearTimeout(timeoutId);
	seconds=900;
	$('#timer').attr('maxvalue', '900');
	$('#timer')[0].setDataValue(900);
	$(".progressbar-text").html("15min 00s");
	$("#remain1").show();
	$("#remain2").hide();
	$("#btnGo img").removeAttr('disabled');	
	$("#btnStop img").attr('disabled', 'disabled');
	$("#btnExtend img").attr('disabled', 'disabled');;
}

jQuery.orange.config.areacontent.distantaccessservice = {
	postParse: function() {
		
		$("#help").bind("click",function() {
			helpPopup("html/main/help_distantaccessservice.html");
		});
	
		//initialiser l'état des buttons
		
		$("#btnGo").setDisabled(false);
		$("#btnStop").setDisabled(true);
		$("#btnExtend").setDisabled(true);
		
		$('#timer')[0].setDataValue(900);
		$('#timer').attr('maxvalue', '900');
		$(".progressbar-text").html("15min 00s");
	
		$("#btnStop img").attr('disabled', 'disabled');
		$("#btnExtend img").attr('disabled', 'disabled');
		
		$("#btnGo").bind("click", function(event) {
			startTimer();
			$("#btnGo").setDisabled(true);
			$("#btnStop").setDisabled(false);
			$("#btnExtend").setDisabled(false);

		});
		
		$("#btnStop").bind("click", function(event) {
			stopTimer();
			$("#btnGo").setDisabled(false);
			$("#btnStop").setDisabled(true);
			$("#btnExtend").setDisabled(true);
		});
		
		$("#btnExtend").bind("click", function(event) {
			extendTimer();
		});
	},
	postLoad: function() {
				
		$("#url").html('https://'+$("#ip").html()+':'+$("#port").html());
	}
};