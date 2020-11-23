<!-- vim: set fileencoding=utf-8 : -->

<div id="connectionFrame" class="frame">
  <div class="title" xmsg="GUI_FIRSTCONNECTION_TITLE_LABEL"/>
    <div class="titleStep" xmsg="GUI_TYPECONNECTION_STEP2_LABEL"/>
    <img id="imgStep"/>
  <div class="content">
    <div id="pageInfo">
      <div>
      	<img id="puce3"/>
      	<div class="typeInfo1" xmsg="GUI_LOGIN_INFO_LABEL"/>
      </div>
    </div>
    <div class="loginInputs">
      <div id="userInput">
        <div id="inputUsr" xpath="">
          <div class="label" xmsg="GUI_LOGIN_USR_INPUT_LABEL"/>
        </div>
      </div>
      <div id="pwdInput">
        <div id="inputPwd" xpath="">
          <div class="label" xmsg="GUI_LOGIN_PWD_INPUT_LABEL"/>
        </div>
      </div>
    </div>
    <br>
    <br>
    <br>
    <div id="buttonBar3">
       <div class="previous" tabindex="0" xmsg="GUI_LOGIN_BTNPREVIOUS_LABEL"/>
       <div class="cancel" tabindex="0" xmsg="GUI_FIRSTCONNECTION_BUTTON_CANCEL_LABEL"/>
       <div class="submit" tabindex="0" xmsg="GUI_FIRSTCONNECTION_BUTTON_SUBMIT_LABEL"/>
    </div>
    <div id="waitBox">
      <div id="waitMsg">
        <div class="warnWait" xmsg="GUI_LOGIN_WAIT_LABEL"/>
      </div>
      <br>
      <img id="waiting"/>
    </div>
    <div id="error">
      <img id="iconErr"/>
      <div class="errorLabelTitle" xmsg="GUI_LOGIN_CONNECTIONFAIL_LABEL"/>
    </div>
    <div id="errorAuth">
      <div class="errorLabel" xmsg="GUI_LOGIN_AUTHFAIL_LABEL"/>
    </div>
    <div id="errorSync">
      <div class="errorLabel" xmsg="GUI_LOGIN_SYNCFAIL_LABEL"/>
    </div>
    <div id="errorServ">
      <div class="errorLabel" xmsg="GUI_LOGIN_SERVERFAIL_LABEL"/>
    </div>
    <br>
    <div id="Help3901">
      <div class="errorLabel" xmsg="GUI_LOGIN_HELP_LABEL"/>
    </div>
    <br>
  </div> 
  <div id="Status" xpath=""/>
  <div id="dslStatus" xpath="Device/DSL/Lines/Line[Alias='DSL0']/Status"/>
  <div id="lastErrors" xpath=""/>
  <div id="pppEnable" xpath=""/>
  <div id="connection-status" xpath=""/>
</div>

<div id="confirmContainer" style="display:none;">
  <div id="confirmLabel" xmsg="GUI_LOGIN_SUCCESS_LABEL"/>
</div>



<script type="text/javascript">
jQuery(function ($) {
        var gui = $.gui, target = gui.currentTarget;
        var client = gui.guiObjset.defaults.client;
        var objset = $('#connectionFrame', target).guiObjset({client: client});
        var request = "";
        var isConnecting = false;
        var currentState;
        //--Dynamic xpath--//
        if(gui.InterfaceType !== undefined){
          $("#inputUsr").attr("xpath", "Device/PPP/Interfaces/Interface[Alias='"+gui.alias+"']/Username");
          $("#inputPwd").attr("xpath", "Device/PPP/Interfaces/Interface[Alias='"+gui.alias+"']/Password");
          $("#Status").attr("xpath", "Device/PPP/Interfaces/Interface[Alias='"+gui.alias+"']/Status");
    	  $("#lastErrors").attr("xpath", "Device/PPP/Interfaces/Interface[Alias='"+gui.alias+"']/LastConnectionError");
    	  $("#pppEnable").attr("xpath", "Device/PPP/Interfaces/Interface[Alias='"+gui.alias+"']/Enable");
    	  $("#connection-status").attr("xpath", "Device/PPP/Interfaces/Interface[Alias='"+gui.alias+"']/ConnectionStatus");
        }
        //-- IMAGES --//
        $("#imgStep").attr("src", "img/etape2sur2.gif");
        $("#iconErr").attr("src", "img/ico_alert.gif");
        $("#iconSucc").attr("src", "img/ico_confirmation.gif");
        $("#puce3").attr("src", "img/square.png");
        $("#waiting").attr("src", "img/wait.gif");
        //-- ERROR MESSAGES --//
        hideAll();
        //-- INPUTS --//
        var User = $("#inputUsr").guiText({objset: objset, disabled: false, maxLength: 85});
        var PassWd = $("#inputPwd").guiText({objset: objset, disabled: false, inputType: "password", writeOnly: true, maxLength: 29});
        var ppEnable = $('#pppEnable', target).guiItem({objset: objset});
        function hideAll(){
          $("#waitBox").hide();
          $("#error").hide();
          $("#errorAuth").hide();
          $("#errorSync").hide();
          $("#errorServ").hide();
          $("#Help3901").hide();
        }
        var disableButtons = function(){
        cancel.guiButton("option", "disabled", true);
        submit.guiButton("option", "disabled", true);
        previous.guiButton("option", "disabled", true);
        }
        var enableButtons = function(){
          cancel.guiButton("option", "disabled", false);
          submit.guiButton("option", "disabled", false);
            if(gui.inactivePrevious){
                previous.guiButton("option", "disabled", true);
            }else{
                previous.guiButton("option", "disabled", false);
            }
        }
       	var previous = $('.previous', target).guiButton().click(function(){
       	  clearTimeout(gui.state);
       	  gui.setPage('typeconnection/typeconnection.gtpl');
	}).keydown(function (e){
          if (e.keyCode==13){
            previous.click();
	  }
        }).hover(function(){
          this.focus();
        }).mouseout(function(){
          this.blur();
        });
	var cancel = $('.cancel', target).guiButton({disabled: true}).click(function(){
		clearTimeout(gui.state);
		//gui.errorControler();
        //isConnecting = true;
        //objset.guiObjset('resetValues');
        cancel.guiButton("option", "disabled", true);
	}).keydown(function (e){
          if (e.keyCode==13){
            cancel.click();
	  }
        }).hover(function(){
          this.focus();
        }).mouseout(function(){
          this.blur();
        });
	var submit = $('.submit', target).guiButton({disabled: true}).click(function(){
        $('#pppEnable', target).guiItem("value", true);
        objset.guiObjset('postValues',function(){
          isConnecting = true;
          
          var request = client.newRequest();
			  request.getValue("Device/PPP/Interfaces/Interface[Alias='"+gui.alias+"']/ConnectionStatus", function (value) {
				  gui.connectionUp = value;
			  });
			  request.send({ synchronous: true });  
			// If box is already disconnected, there isn't gui_value change, so GUI check it on login
			if(gui.connectionUp === 'DISCONNECTED'){
				Automate("errorSync");
			}
        },
        function (error)
        {
			Automate("errorAuth");
		}, {synchronous: true});
	}).keydown(function (e){
        if (e.keyCode==13){
            submit.click();
	  	}
    }).hover(function(){
       this.focus();
    }).mouseout(function(){
       this.blur();
    });
	var hideFields = function () {
	   $("#inputUsr").guiText("option", "disabled", true);
           $("#inputPwd").guiText("option", "disabled", true);
	}
	var showFields = function () {
	   $("#inputUsr").guiText("option", "disabled", false);
           $("#inputPwd").guiText("option", "disabled", false);
	}
	var updateSubmit = function (){
	  submit.guiButton('option', 'disabled', ((User.guiText("value") === '')||(PassWd.guiText("value") === '')));
	}
	
	//if we came from the error page we disable previous page button
	previous.guiButton('option', 'disabled', gui.inactivePrevious);
	if(gui.inactivePrevious === true){
	  $('#Step').hide();
	}
	/*ajout d un handler pour les traitements
	 sur les valeurs aprés chargement leurs 
	 dans les widgets */
	User.add(PassWd).bind('gui_loaded', function () {
	  updateSubmit();
	}).change(function () {
	  updateSubmit();
        });
        // We check if Usr is loaded and set Pwd empty if Usr is so
    $("#inputUsr").guiText().bind('gui_loaded', 
       function (ev, ui) { 
	     if(ui.value){
	       $("#inputPwd").guiText("value", "000000");
	     }
	     else{
	      $('#pppEnable', target).guiItem("value", false);
          objset.guiObjset('postValues');
	     }
	});
        objset.change(function (modified) {
          cancel.guiButton("option", "disabled", !modified);
        });
        
      // We test if we are connected, connecting or failed
      var connectionStatus = $("#connection-status", target).guiItem({ objset: objset, readOnly: true, notify: true}).bind('gui_value', 	     
      function (ev, ui) {
        if(ui.value === 'CONNECTED'){
          Automate("connected");
          clearTimeout(gui.state);
        }
        else if((ui.value === 'AUTHENTICATING') || (ui.value === 'CONNECTING')){
          Automate("connecting");
          gui.state = setTimeout("$.gui.errorControler()", 120000);
        }
        else // DISCONNECTED, UNCONFIGURED, DISCONNECTING ...
        {
			Automate("errorSync");
		}
        
        return false;
      });
    
      //We test which kind of error was reported last connection attempt 
      var lastError = $("#lastErrors", target).guiItem({ objset: objset, readOnly: true, notify: true}).bind('gui_value', 	     
        function (ev, ui) {
          gui.lastConnectionError = ui.value;
		  gui.errorControler();
          return false;
       });
        
       gui.errorControler = function() {
          if(gui.lastConnectionError !== "ERROR_NONE"){
            if((gui.lastConnectionError === "ERROR_SERVER_OUT_OF_RESOURCES") && (isConnecting)){
              Automate("errorServ");
            }
            else if(gui.lastConnectionError === "ERROR_AUTHENTICATION_FAILURE"){
              Automate("errorAuth");
            }
            else if(gui.lastConnectionError === "ERROR_NO_ANSWER"){
			  Automate("errorServ");
            }
          }
        }
        
       //We test if the DSL link is established
       var dslStatus = $("#dslStatus", target).guiItem({ objset: objset, readOnly: true, notify: true}).bind('gui_value', 	     
        function (ev, ui) {
          if(ui.value !== 'UP'){
            Automate("errorSync");
          }
          else{
            Automate("reSync");
          }
          return false;
        });
        
       var Status = $("#Status", target).guiItem({ objset: objset, readOnly: true, notify: true}).bind('gui_value',    
        function (ev, ui) {
          if((ui.value !== 'UP') && (isConnecting)){
            Automate("errorSync");
          }
          return false;
        });
        
        $.gui.confirmConnect = function () {
          $("#confirmContainer").show();
          $("#connectionFrame").hide();
          var t = setTimeout("$.gui.setPage('update/update.gtpl')",8000);
          $(document).keydown(function (e){
	    $.gui.setPage('update/update.gtpl');
          });
           $("#confirmContainer").click(function (){
	    $.gui.setPage('update/update.gtpl');
          });
        }
        var Automate = function (currentState) {
          hideAll();
          //is the box plugged in ?
          if(currentState === "errorSync"){
            $("#error").show();
            $("#errorSync").show();
            $("#Help3901").show();
            showFields();
            enableButtons();
          }
          if(currentState === "reSync"){
            $("#error").hide();
            $("#errorSync").hide();
            $("#Help3901").hide();
            showFields();
            enableButtons();
          }
          //are we connected
          else if(currentState === "connected"){
            $.gui.confirmConnect();
          }
          //are we connecting
          else if(currentState === "connecting"){
            //isConnecting = true;
            hideFields();
            $("#waitBox").show();
            disableButtons();
            cancel.guiButton("option", "disabled", false);
          }
          //server error
          else if(currentState === "errorServ"){
            $("#error").show();
            $("#errorServ").show();
            $("#Help3901").show();
            showFields();
            enableButtons();
          }
          //authentication error
          else if(currentState === "errorAuth"){
            $("#error").show();
            $("#errorAuth").show();
            $("#Help3901").show();
            showFields();
            enableButtons();
          }
        }
        // Load parameter values (from data base)
        objset.guiObjset('loadValues', {autoSubscribe: true});
    });
</script>
