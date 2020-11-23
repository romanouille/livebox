<!-- vim: set fileencoding=utf-8 : -->
<div id="GUI-Header" url="header/header.gtpl"></div>
<div id="GUI-Content">
   <div id="Content" url=""></div>
</div>
<script type="text/javascript">
  jQuery(function ($) {
      var gui = $.gui;
      
      gui.i18n.add(/*"msg/%L/gui-msg.json",*/
            "msg/%L/gui-api-msg.json",
            "msg/%L/gui-livebox-min-msg.json");
      
      var client = new gui.api.Client({
          "session": {
            "context-flags": {
              "no-default": false
            },
            "capability-flags": {
              flags: true,
              "default-value": true,
              type: true
            },
            depth: 2,
            "capability-depth": 2
          }
        }); 
      // Set language to default only for login
      gui.language = gui.languages[0];
      gui.guiObjset.defaults.client = client;
      //client = gui.defaultClient;
      gui.inactivePrevious = false;
      gui.maxConnectionTry = 5;
      connected = false;
      gui.openLoginForm = function () {
        client.authenticate('admin', 'admin', function (reply) {
          firstConnection = true;
          connected = true;
        }, function (error) {
		  firstConnection = false;
		  connected = false;
          if (error.code === gui.XMO_AUTHENTICATION_ERR ||
            error.code === gui.XMO_INVALID_SESSION_ERR ||
            error.code === gui.XMO_SESSION_TIMEOUT_ERR) {
            firstConnection = false;
          } else {
            // TBD
          }
        });
      }
      gui.openLoginForm();
        
      gui.InterfaceType = "";
      gui.connectionUp = false;  
      var guiVersion = "";
      var FTI = "";
      var userLang = 'fr';
      gui.alias = 'PPP_DATA'; // use in login.gtpl
      
      
      gui.setPage = function(page) {
        if ((page === undefined) || (page === '')) {
          page = gui.currentPage;
        } else{
          gui.currentPage = page;
        }
        $("#Content").guiLoadURL(page);
      };   

      gui.refreshPage = function () {
        document.title = gui.i18n.msg("GUI_HEADER_TITLE");
        $("#GUI-Header").guiLoadURL();
        gui.setPage();
      };
	
	if ( !connected )
	{
		gui.inactivePrevious = true;
        gui.currentPage = 'login/loginAdmin.gtpl';
    }
    else
    {
      var request = client.newRequest();

      request.getValue("Device/Managers/NetworkData/InterfaceType", function (value, capability) {
          gui.InterfaceType = capability.getEnum(value).name;
      });

/*     
      if(gui.InterfaceType === 'FTTH'){
        gui.alias = 'PPP_DATA_FTTH';
      }
      else {
        gui.alias = 'PPP_DATA_ADSL';
      }*/

      request.getValue("Device/DeviceInfo/GUIFirmwareVersion", function (value) {
		  if ( value != undefined )
			guiVersion = value;
        });
      request.getValue("Device/UserAccounts/Users/User[Login='admin']/Language", function (value) {
          if ( value != undefined )
			userLang = value;
        });
      request.getValue("Device/PPP/Interfaces/Interface[Alias='"+gui.alias+"']/Username", function (value) {
		  if ( value != undefined )
			FTI = value;
        });
      request.getValue("Device/PPP/Interfaces/Interface[Alias='"+gui.alias+"']/ConnectionStatus", function (value) {
          gui.connectionUp = value;
        });
      request.getValue("Device/PPP/Interfaces/Interface[Alias='"+gui.alias+"']/Enable", function (value) {
		  if ( value != undefined )
			gui.PPPEnable = value;
        });

      request.send(undefined, function () {
          // No default error process !
          return false;
        }, { synchronous: true });  
	
      if(guiVersion === '' || guiVersion === '0'){
        if( FTI !== ''){
          if(gui.connectionUp === 'CONNECTED'){
            gui.currentPage = 'update/update.gtpl';
          } else {
            gui.inactivePrevious = true;
            gui.currentPage = 'login/login.gtpl';
          } 
        }
        else{
          gui.currentPage = 'firstconnection/firstconnection.gtpl';
        }
      }else {
        gui.inactivePrevious = true;
        gui.currentPage = 'error/error.gtpl';
        
      }
      
  } // end else
      gui.setPage();
      // Load language catalogs and refresh the header + content
      gui.setLanguage(userLang);
  
    });
</script>
