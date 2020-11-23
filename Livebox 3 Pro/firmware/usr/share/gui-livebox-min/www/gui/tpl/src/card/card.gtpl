<!-- vim: set fileencoding=utf-8 : -->

<div id="cardFrame" class="frame">
  <div class="title" xmsg="GUI_FIRSTCONNECTION_TITLE_LABEL"/>
  <div class="titleStep" xmsg="GUI_TYPECONNECTION_STEP1_LABEL"/>
  <img id="imgStep"/>
  <div class="content">
    <div id="login">
      <div id="connection-status" xpath=""/>
  	  <div id="cardState" xpath="Device/Managers/SimCard/CardStatus"/>
      <div class="warn" id="warn" xmsg="GUI_CARD_SECURE_TITLE_LABEL"/>
      <div class="titleInfo1" id="titleInfo1" xmsg="GUI_CARD_SECURE_MESSAGE_LABEL"/>
      <div class="titleInfo2" id="titleInfo1" xmsg="GUI_CARD_PWD_LOST_INFO_LABEL" style="display:inline;"/>
      <a class="retrieveLink" xmsg="GUI_CARD_PWD_LOST_LINK_LABEL"/>
      <br>
      <div class="loginInputs" id="loginInputs" id="login">
        <div id="userInput">
          <div id="inputUsr" xpath="Device/UserAccounts/Users/User[Login='admin']/Login">
            <div class="label" xmsg="GUI_CARD_USR_INPUT_LABEL"/>
          </div>
        </div>
        <div id="pwdInput">
          <div id="inputPwd" xpath="Device/UserAccounts/Users/User[Login='admin']/Password">
            <div class="label" xmsg="GUI_CARD_PWD_INPUT_LABEL"/>
          </div>
        </div>
        <div id="buttonBar3">
          <div class="previous" tabindex="0" xmsg="GUI_LOGIN_BTNPREVIOUS_LABEL"/>
          <div class="cancel" tabindex="0"xmsg="GUI_FIRSTCONNECTION_BUTTON_CANCEL_LABEL"/>
          <div class="submit" tabindex="0" xmsg="GUI_FIRSTCONNECTION_BUTTON_SUBMIT_LABEL"/>
        </div>
      </div><!--loginInputs-->
    </div><!--login-->  
  </div><!--content-->
  <div id="waitBox">
    <div id="waitMsg">
      <div class="warnWait" xmsg="GUI_CARD_LOAD_MESSAGE_LABEL"/>
    </div>
    <br>
    <img id="waiting"/>
    <br>
  </div>

  <div class="question">
    <div class="questionForm">
      <div class="titleInfo1" id="titleInfo1" xmsg="GUI_CARD_FORGOTPWD_TITLE_LABEL"/>
      <div class="titleInfo2" id="titleInfo2" xmsg="GUI_CARD_SECRET_QUESTION_LABEL"/>
      <div id="Qinputs">
        <div id="questionInput">
          <div id="inputQuestion" xpath="Device/UserAccounts/Users/User[Login='admin']/SecretQuery">
            <div class="label" xmsg="GUI_CARD_USR_QUESTION_LABEL"/>
          </div>
        </div>
        <div id="answerInput">
          <div id="inputAnswer" xpath="Device/UserAccounts/Users/User[Login='admin']/SecretAnswer">
            <div class="label" xmsg="GUI_CARD_QUESTION_ANSWER_LABEL"/>
          </div>
        </div>
        <div id="buttonBar3">
          <div class="Qprevious" tabindex="0" xmsg="GUI_LOGIN_BTNPREVIOUS_LABEL"/>
          <div class="Qcancel" tabindex="0"xmsg="GUI_FIRSTCONNECTION_BUTTON_CANCEL_LABEL"/>
          <div class="Qsubmit" tabindex="0" xmsg="GUI_FIRSTCONNECTION_BUTTON_SUBMIT_LABEL"/>
        </div>
      </div><!--qinput-->
    </div><!--QForm-->
 <!--   
    <div class="passwordForm">
      <div class="titleInfo2" id="titleInfo2" xmsg="GUI_CARD_USER_REPASSWD_LABEL"/>
      <div id="inputUserCard" xpath="Device/UserAccounts/Users/User[Login='admin']/Login">
        <div class="label" xmsg="GUI_CARD_USER_INPUT_LABEL"/>
      </div>
      <div id="inputNewPasswd" xpath="Device/UserAccounts/Users/User[Login='admin']/Password">
        <div class="label" xmsg="GUI_CARD_USER_NEW_PASSWD_LABEL"/>
      </div>
      <div id="equalPw" xpath="">
        <div class="label" xmsg="GUI_CARD_USER_NEW_PASSWD_CONFIRM_LABEL"/>
      </div>
      <div id="buttonBar3">
        <div class="Pprevious" tabindex="0" xmsg="GUI_LOGIN_BTNPREVIOUS_LABEL"/>
        <div class="Pcancel" tabindex="0"xmsg="GUI_FIRSTCONNECTION_BUTTON_CANCEL_LABEL"/>
        <div class="Psubmit" tabindex="0" xmsg="GUI_FIRSTCONNECTION_BUTTON_SUBMIT_LABEL"/>
      </div>
    </div>-->
  </div><!-- question-->
  <div id="error">
    <img id="iconErr"/>
    <div class="errorLabelTitle" xmsg="GUI_CARD_USRFAIL_LABEL"/>
    <div id="errorSync">
      <div class="errorLabel" xmsg="GUI_CARD_CARDFAIL_LABEL"/> 
    </div>
    <div id="errorAuth">
      <div class="errorLabel" xmsg="GUI_CARD_BADPWD_LABEL"/> 
    </div>
  </div><!--error-->
<div id="cancel" style="display:inline;"/>
<div class="abortRestore" xmsg="GUI_CARD_ABORT_INFO_LABEL" style="display:inline;"/>
<a class="cancelLink abortRestore" xmsg="GUI_CARD_PWD_LOST_LINK_LABEL" style="display:inline;"/>
<div id="RPC" xpath="Device/Managers/SimCard"/>
</div><!--content-->

<script type="text/javascript">
jQuery(function ($) {
        var gui = $.gui, target = gui.currentTarget;
        var client = gui.guiObjset.defaults.client;
        var objset = $('#cardFrame', target).guiObjset();
        var rpc = $("#RPC").guiItem({rpc: true});
        //-- IMAGES --//
        $("#imgStep").attr("src", "img/etape1sur2.gif");
        $("#imgStep").attr("src", "img/etape1sur2.gif");
        $("#iconErr").attr("src", "img/ico_alert.gif");
        $("#waiting").attr("src", "img/wait.gif");
        gui.fisrtAtempt = true;
        if(gui.InterfaceType !== undefined){
    	  $("#connection-status").attr("xpath", "Device/PPP/Interfaces/Interface[Alias='"+gui.alias+"']/ConnectionStatus");
        }
        //Buttons
        var previous = $('.previous', target).guiButton().click(function(){
       	  gui.setPage('firstconnection/firstconnection.gtpl');
		}).keydown(function (e){
          if (e.keyCode==13){
            previous.click();
	  		}
       	}).hover(function(){
          	this.focus();
        }).mouseout(function(){
          this.blur();
        });
        
        //Buttons SECRET QUESTION
       $('.Qprevious').guiButton().click(function(){
       	  gui.setPage('card/card.gtpl');
		}).keydown(function (e){
          if (e.keyCode==13){
            previous.click();
	  		}
       	}).hover(function(){
          	this.focus();
        }).mouseout(function(){
          this.blur();
        });
        $('.Qcancel').guiButton({disabled: true}).click(function(){
          objset.guiObjset('resetValues');
          $('.Qcancel').guiButton("option", "disabled", true);
          $('.Qsubmit').guiButton("option", "disabled", true);
		}).keydown(function (e){
          if (e.keyCode==13){
            cancel.click();
	  		}
        }).hover(function(){
          this.focus();
        }).mouseout(function(){
          this.blur();
        });
        
        $('.Qsubmit').guiButton({disabled: true}).click(function(){
          gui.fisrtAtempt = false;	
          unlockQ();
		}).keydown(function (e){
          if (e.keyCode==13){
            cancel.click();
	  		}
        }).hover(function(){
          this.focus();
        }).mouseout(function(){
          this.blur();
        });
        //FIELDS SECRET QUESTION
        $("#inputQuestion").guiText({objset: objset, readOnly: true}).change(function(){
          $('.Qcancel').guiButton("option", "disabled", false);
          $('.Qsubmit').guiButton("option", "disabled", false);
        });
        $("#inputAnswer").guiText({objset: objset, writeOnly: true}).change(function(){
          $('.Qcancel').guiButton("option", "disabled", false);
          $('.Qsubmit').guiButton("option", "disabled", false);
        });
        //BUTTON RE PASSWD
        /*$('.Pprevious').guiButton().click(function(){
       	  $(".passwordForm").hide();
       	  $(".questionForm").show();
		}).keydown(function (e){
          if (e.keyCode==13){
            previous.click();
	  		}
       	}).hover(function(){
          	this.focus();
        }).mouseout(function(){
          this.blur();
        });
        $('.Pcancel').guiButton().click(function(){
		}).keydown(function (e){
          if (e.keyCode==13){
            cancel.click();
	  		}
        }).hover(function(){
          this.focus();
        }).mouseout(function(){
          this.blur();
        });
        $('.Psubmit').guiButton().click(function(){
       	  gui.setPage('card/card.gtpl');
		}).keydown(function (e){
          if (e.keyCode==13){
            cancel.click();
	  		}
        }).hover(function(){
          this.focus();
        }).mouseout(function(){
          this.blur();
        });*/
        //FIELDS RE PASSWORD
        //$("#inputUserCard").guiText({objset: objQes});
        //$("#inputNewPasswd").guiText({objset: objQes});
        //$("#equalPwd").guiText();
        //Links
        $('.cancelLink').click(function(){
       	  gui.setPage('firstconnection/firstconnection.gtpl');
		});
		
		$('.retrieveLink').click(function(){
       	  $(".content").hide();
       	  $(".question").show();
       	  //$(".passwordForm").hide();
       	  $(".questionForm").show();
       	  //objset.guiObjset('loadValues');
		});
		
		var cancel = $('.cancel', target).guiButton({disabled: true}).click(function(){
          disableButtons();
          hideAll();
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
		  var crypted = client.hashPassword($("#inputPwd").guiText("value"));
		  $("#inputPwd").guiItem("value", crypted);
		  disableButtons();
		  gui.fisrtAtempt = false;	
          $("#inputPwd").guiItem("value", "");
          unlockP(crypted);
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
        
        var connectionStatus = $('#connection-status', target).guiItem({objset: objset, readOnly: true, notify: true}).bind('gui_value',
          function (ev, ui) {
            if((ui.value === 'CONNECTING') || (ui.value === 'AUTHENTICATING')){
	      	  //$('#cardIn', target).guiItem({objset: objset, notify: false})
	          gui.inactivePrevious = true;
	          gui.setPage("login/login.gtpl");
            }
            else if(ui.value === 'CONNECTED'){
              //$('#cardIn', target).guiItem({objset: objset, notify: false});
              hideAll();
              gui.setPage("update/update.gtpl");
            }
            return false;
          });
        //RPC
        var unlockP = function(crypted){
            var input = new gui.api.Capability({Type: "PASSWORD", Value: crypted});
            rpc.guiItem("SimcardInterface1.0_unlock", input,  function (params) {
                hideAll(false);
                $('#waitBox').show();
            }, function (err) {
                gui.simErrors();
            });
        }

        var unlockQ = function(){
            var input = new gui.api.Capability({Type: "SECRET_ANSWER", Value: $("#inputAnswer").guiText("value")});
            rpc.guiItem("SimcardInterface1.0_unlock", input,  function (params) {
                hideAll(false);
                $('#waitBox').show();
            }, function (err) {
                gui.simQErrors();
            });
        }

        gui.simErrors = function(){
            switch ($('#cardState', target).guiItem("value")){
                case  "ERROR":
                    hideAll(true);
                    $('#login').show();
                    $('#error').show();
                    $("#errorSync").show();
                break;
                case  "USABLE":
                    hideAll(false);
                break;
                case  "LOCKED":
                    hideAll(true);
                    $('#login').show();
                    $('#error').show();
                    $("#errorAuth").show();
                break;
            }
        }
        gui.simQErrors = function(){
		switch ($('#cardState', target).guiItem("value")){
            
                case  "ERROR":
                    hideAll(true);
                    $(".questionForm").show();
                    $('#error').show();
                    $("#errorSync").show();
                break;
                case  "USABLE":
                    hideAll(false);
                break;
                case  "LOCKED":
                    hideAll(true);
                    $(".questionForm").show();
                    $('#error').show();
                    $("#errorAuth").show();
                break;
            }
        
        }
        var cardState = $('#cardState', target).guiItem({objset: objset, readOnly: true, notify: true}).bind("gui_value", function(){
        });
        var hideAll = function(ab){
            $(".questionForm").hide();
            $(".abortRestore").hide();
			$('#login').hide();
			$('#error').hide();
	        $("#errorSync").hide();
            $("#errorAuth").hide();
			$('#waitBox').hide();
            if(ab){
                $(".abortRestore").show();
            }
        }
        hideAll(true);
        $('#login').show();
       
    objset.guiObjset('loadValues', {autoSubscribe: true});
    });
</script>
