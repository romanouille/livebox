<!-- vim: set fileencoding=utf-8 : -->
<div id="GUI-content-body"> 
		<div class="boxType4 margin-top-10">
		<h3 xmg="GUI_PROGRESSBAR_DESC">durée restante pour l'administration à distance</h3>
		<div class="waiting"> <img src="img/waiting.gif"></div>
		<div class="progressbar-body">
			<div id="progressBar">
			  <div class="label"></div>
			</div>
			0min <span style="display: inline-block; width: 26%"> </span> 10min <span style="display: inline-block; width: 26%">
			</span> 20min <span style="display: inline-block; width: 26%"> </span> 30min
		</div>
		<div id="enabled" xpath="Device/UserAccounts/Users/User[Login='supportssh']/RemoteAccesses/RemoteAccess[@uid='1']/Enabled"></div>
		<div id="expiration-enable" xpath="Device/UserAccounts/Users/User[Login='supportssh']/RemoteAccesses/RemoteAccess[@uid='1']/ExpirationEnable"></div>
		<div id="expiration-time" xpath="Device/UserAccounts/Users/User[Login='supportssh']/RemoteAccesses/RemoteAccess[@uid='1']/ExpirationTime"></div>
		<hr />
		</div>
		<div class="boxType5 border-bottom-3"></div>
		<div class="alignRight padding-top-10 ">
		<a href="#" class="margin-right-5 inlineblock annuler"> <img align="middle" title="annuler" alt="annuler"
		  src="img/btn_arreter_off.gif"> </a> <a href="#" class="inlineblock lancer"> <img align="middle"
		  title="lancer" alt="sauvegarder" src="img/btn_lancer.gif"> </a>
		</div>
		<div class="clear"></div>
		<span class="timeExp"/>
</div>
<style>
.ui-progressbar .ui-progressbar-value {
	background-image: url(img/ui-bg_orange.png);
}

#progressBar .label {
	float: left;
	margin-left: 45%;
	margin-top: 3px;
	text-shadow: 1px 1px 1px #fff;
}
.waiting {
	text-align : center;
}
.progressbar-body {
	display : none;
}
</style>
</div>
<script type="text/javascript">
jQuery(function ($) {
	// Set aliases
	var gui = $.gui;
	// create the new objset
	gui.rmsshObjset = $("body").guiObjset({client: gui.client});

	var User = "guest";
	var PassWd = ""
	gui.expirationTime = 0;
	gui.durationSSHTime = 60*30; // 30 min
	gui.sshStatus = false;


	var LogIn = function (usr, pwd) {
		gui.usr = usr;
		gui.pwd = pwd;
		// Make the authentication with xmo-server
		gui.client.authenticate(usr, pwd, function (reply) {
			$.gui.progressbarDisplay()
		}, function (reply) {
			console.log(" ------- login NOK! ------ ");
		});
	}

	gui.progressbarDisplay = function ( ) {
		$.gui.progressbarInit();
		$.gui.showExpirationTime();
	}

	gui.logOff = function ( ) {
		gui.client.closeSession(function(){});
	}

	gui.progressbarInit = function () {

		$('#progressBar').rsshprogressbar({
			value : 100,
			duration : gui.durationSSHTime
		});
		// Create the tree and trigger actions like click
		var  rmsReq = gui.client.newRequest();
		rmsReq.getValue("Device/UserAccounts/Users/User[Login='supportssh']/RemoteAccesses/RemoteAccess[@uid='1']/Enabled", 
			function(value) {
				$(".waiting").hide();
				$(".progressbar-body").show();
				if(value){
					$('.lancer img').attr("src", "img/btn_lancer_off.gif");
					$('.annuler img').attr("src", "img/btn_arreter.gif");
				} else {
					$('.lancer img').attr("src", "img/btn_lancer.gif");
					$('.annuler img').attr("src", "img/btn_arreter_off.gif");	
				}
			});
			
		//TODO
		rmsReq.getValue("Device/UserAccounts/Users/User[Login='supportssh']/RemoteAccesses/RemoteAccess[@uid='1']/ExpirationEnable", 
			function(value) {
				console.log("------- value Expiration Enabled SSH  = " + value);
			});
		// ---
		rmsReq.send();
	} 
	var tid = null;
	
	gui.showExpirationTime = function(){ 
		if($('#GUI-content-body').length == 0){
			clearTimeout(tid);
			return false;
		}
			
		var  rmsReq = gui.client.newRequest();
		rmsReq.getValue("Device/UserAccounts/Users/User[Login='supportssh']/RemoteAccesses/RemoteAccess[@uid='1']/ExpirationTime", 
			function(value) {
				gui.expirationTime = value;
			});
		rmsReq.send({
			synchronous : true
		});
		if(gui.expirationTime > 0) {
			/*$(".timeExp").html("<b>"+gui.expirationTime+"</b>");*/
			$('#progressBar').rsshprogressbar({value: (gui.expirationTime / gui.durationSSHTime) *100});
			$('#progressBar').rsshprogressbar("_refreshValue");
			tid = setTimeout(gui.showExpirationTime, 1000);
		} else {
			clearTimeout(tid);
		}
	}	

	LogIn(User, PassWd);
	
	//Lunch ProgressBar 
	$('.lancer').click(function() {
	
		//Start l'acces remote SSH 
		var  rmsReq = gui.client.newRequest();
		rmsReq.setValue("Device/UserAccounts/Users/User[Login='supportssh']/RemoteAccesses/RemoteAccess[@uid='1']/Enabled", true);
		rmsReq.setValue("Device/UserAccounts/Users/User[Login='supportssh']/RemoteAccesses/RemoteAccess[@uid='1']/ExpirationEnable", true);
		rmsReq.send({
			synchronous : true
		});
		gui.logOff();
		gui.refreshPage();
	});

	$('.annuler').click(function() {
		//Annuler l'acces remote SSH 
		$('#progressBar').rsshprogressbar("stop");
		clearTimeout(tid);
		
		var  rmsReq = gui.client.newRequest();
		rmsReq.setValue("Device/UserAccounts/Users/User[Login='supportssh']/RemoteAccesses/RemoteAccess[@uid='1']/Enabled", false);
		rmsReq.setValue("Device/UserAccounts/Users/User[Login='supportssh']/RemoteAccesses/RemoteAccess[@uid='1']/ExpirationEnable", false);
		rmsReq.send({
			synchronous : true
		});
		gui.logOff();
		gui.refreshPage();
	});		

});
</script>
