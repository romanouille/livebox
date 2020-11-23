<!-- vim: set fileencoding=utf-8 : -->

<div id="adminFrame" class="frame">
  <div class="title" xmsg="GUI_FIRSTCONNECTION_TITLE_LABEL"/>
  <div class="titleStep" xmsg="GUI_TYPECONNECTION_STEP1_LABEL"/>
  <img id="imgStep"/>
  <div class="content">
    <div id="loginAdmin">
  	  <div id="cardState" xpath="Device/Managers/SimCard/CardStatus"/>
      <!--<div class="warn" id="warn" xmsg="GUI_CARD_SECURE_TITLE_LABEL"/>-->
      <div class="titleInfo1" id="titleInfo1" xmsg="GUI_LOGINADMIN_MESSAGE_LABEL"/>
      <div class="titleInfo1" id="titleInfo1" xmsg="GUI_LOGINADMIN_INSERT_LOGIN"/>
      <br>
      <div class="loginInputs" id="loginInputs" id="login">
        <div id="userInput">
          <div id="inputUsr" xpath="Device/UserAccounts/Users/User[Login='admin']/Login">
            <div class="label" xmsg="GUI_LOGINADMIN_USR_INPUT_LABEL"/>
          </div>
        </div>
        <div id="pwdInput">
          <div id="inputPwd" xpath="Device/UserAccounts/Users/User[Login='admin']/Password">
            <div class="label" xmsg="GUI_LOGINADMIN_PWD_INPUT_LABEL"/>
          </div>
        </div>
        <div id="buttonBar3">
          <!--<div class="previous" tabindex="0" xmsg="GUI_LOGIN_BTNPREVIOUS_LABEL"/>-->
          <div class="cancel" tabindex="0"xmsg="GUI_FIRSTCONNECTION_BUTTON_CANCEL_LABEL"/>
          <div class="submit" tabindex="0" xmsg="GUI_FIRSTCONNECTION_BUTTON_SUBMIT_LABEL"/>
        </div>
      </div><!--loginInputs-->
    </div><!--login-->
    
   <div id="errorAdmin">
	<br/>
    <img id="iconErr"/><br/>
    <div class="errorLabelTitle" xmsg="GUI_CARD_USRFAIL_LABEL"/>
    <div id="errorAuthAdmin">
      <div class="errorLabel" xmsg="GUI_CARD_BADPWD_LABEL"/> 
    </div>
    <br/>
  </div><!--error-->
  
  </div><!--content-->

 
<div id="cancel" style="display:inline;"/>
</div><!--content-->

<script type="text/javascript">
jQuery(function ($) {
        var gui = $.gui, target = gui.currentTarget;
        var client = gui.guiObjset.defaults.client;
        var objset = $('#cardFrame', target).guiObjset();
        //-- IMAGES --//
        $("#imgStep").attr("src", "img/etape1sur2.gif");
        //$("#imgStep").attr("src", "img/etape1sur2.gif");
        $("#iconErr").attr("src", "img/ico_alert.gif");
		
		var cancel = $('.cancel', target).guiButton({disabled: true}).click(function(){
          disableButtons();
          //hideAll();
          objset.guiObjset('resetValues');
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
		  //var crypted = client.hashPassword($("#inputPwd").guiText("value"));
          client.closeSession(); // reinit session
		  client.openSession($("#inputUsr").guiText("value"), $("#inputPwd").guiText("value"), function (reply) {
			  
			  var request = client.newRequest();
			  request.getValue("Device/PPP/Interfaces/Interface[Alias='"+gui.alias+"']/ConnectionStatus", function (value) {
				  gui.connectionUp = value;
			  });
			  request.send({ synchronous: true });  
			
				if(gui.connectionUp === 'CONNECTED'){
				  hideAll();
				  gui.setPage("update/update.gtpl");
				}
				else
				{
					gui.inactivePrevious = true;
					gui.setPage("login/login.gtpl");
				}
        
			}, function (error) {
			  
			  $("#errorAdmin").show();
			});
          
		}).keydown(function (e){
          if (e.keyCode==13){
            submit.click();
	  	  }
    	}).hover(function(){
       	  this.focus();
    	}).mouseout(function(){
          this.blur();
    	});

    	var disableButtons = function(){
          cancel.guiButton("option", "disabled", true);
          submit.guiButton("option", "disabled", true);
    	}
    	var enableButtons = function(){
          cancel.guiButton("option", "disabled", false);
          submit.guiButton("option", "disabled", false);
    	}    
    	
        //-- INPUTS --//
        var User = $("#inputUsr").guiText({objset: objset, disabled: false}).change(function(){
       enableButtons();
        });
        var PassWd = $("#inputPwd").guiText({objset: objset, disabled: false, inputType: "password", writeOnly: true}).change(function(){
         enableButtons();
        });
        
        var hideAll = function(ab){
			$('#loginAdmin').hide();
			$('#errorAdmin').hide();
            if(ab){
                $(".abortRestore").show();
            }
        }
        hideAll(true);
        $('#loginAdmin').show();
       
    objset.guiObjset('loadValues', {autoSubscribe: true});
    });
</script>
