define(["utils/console","utils/basics","lib/stateCtrlInterface"],function(console,basicUtilities,StateCtrlClass){"use strict";function WifiAdvancedPrivateCtrlClass(aStateId,aStateManager,aSahObj,aViewObj){var fields,onViewEvent=function(aEventId,aData){if(aEventId==="ViewUpdated"){if(aData.reason==="selfPinPairing"){basicUtilities.queue([function(aNext){this.startWpsPairing(aNext,{requirePinCode:true,accessPointIdList:[aData.accessPointId]})},function(aNext,aResult){if(!aResult||aResult.status===0){this.getViewObj().viewPutWpsPin(null,aResult.data.pinCode);basicUtilities.callback(null,false,0,null)}else{basicUtilities.callback(null,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to start wps pairing","aba0101")}}],this)}else if(aData.reason==="stopPairing"){basicUtilities.queue([function(aNext){this.stopWpsPairing(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(null,false,0,null)}else{basicUtilities.callback(null,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to stop wps pairing","aba0102")}}],this)}else if(aData.reason==="pinPairing"){basicUtilities.queue([function(aNext){console.debug("WifiAdvancedPrivateCtrlClass: WPS pairing started with pin code "+aData.value);this.startWpsPairing(aNext,{pinCode:aData.value,accessPointIdList:[aData.accessPointId]})},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(null,false,0,null)}else{basicUtilities.callback(null,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to start wps pairing with pin code","aba0103")}}],this)}console.debug("WifiAdvancedPrivateCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData))}else if(aEventId==="ViewCancelled"){console.debug("WifiAdvancedPrivateCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData))}else if(aEventId==="ViewSubmitted"){console.debug("WifiAdvancedPrivateCtrlClass: View event '"+aEventId+"' with data "+JSON.stringify(aData));basicUtilities.queue([function(aNext){this.getViewObj().showLoadingScreen(aNext)},function(aNext){this.saveAll(aNext,aData)},function(aNext,aResult){this.getViewObj().hideLoadingScreen(null);if(!aResult||aResult.status===0){window.location.hash="#summary";basicUtilities.callback(null,false,0,null)}else{console.warn("WifiAdvancedPrivateCtrlClass: Settings could not be saved");basicUtilities.callback(null,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Settings could not be saved","aba0104")}}],this)}else{console.warn("WifiAdvancedPrivateCtrlClass: Unexpected event '"+aEventId+"'")}};fields={currentData:{getPrivateAccessPoints:{},getPrivateWpsPairing:{},getPrivateMacFiltering:{},getActiveDevices:{},getAllDevices:{},startWpsPairing:{},getDevices:{},knownActiveDevices:{},ssidCollision:{},isWifiUsedByDevices:false},pairingObj:{}};StateCtrlClass.call(this,aStateId,aStateManager,aSahObj,aViewObj);this.init=function(aCallback){console.debug("WifiAdvancedPrivateCtrlClass: Initialising state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().subscribeEvents(this.getId(),onViewEvent.bind(this));this.getViewObj().init(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to init","aba0105")}}],this)};this.quit=function(aCallback){console.debug("FakeFirstCtrlClass: Releasing state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().quit(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to quit","aba0106")}}],this)};this.enable=function(aCallback){console.debug("WifiAdvancedPrivateCtrlClass: Enabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getGuestAndHotspot(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){this.getPrivateAccessPoints(aNext)}else{console.error("WifiAdvancedPrivateCtrlClass: Internal error");basicUtilities.callback(aNext,false,0,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to get guest and hotspot access points","aba0218")}},function(aNext,aResult){if(!aResult||aResult.status===0){this.getPrivateWpsPairing(aNext)}else{console.error("WifiAdvancedPrivateCtrlClass: Internal error");basicUtilities.callback(aNext,false,0,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to get private access points","aba0108")}},function(aNext,aResult){if(!aResult||aResult.status===0){this.getPrivateMacFiltering(aNext)}else{console.error("WifiAdvancedPrivateCtrlClass: Internal error");basicUtilities.callback(aNext,false,0,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to get private access points wps pairing","aba0109")}},function(aNext,aResult){if(!aResult||aResult.status===0){this.getAllDevices(aNext)}else{console.error("WifiAdvancedPrivateCtrlClass: Internal error");basicUtilities.callback(aNext,false,0,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to get private access points mac filtering","aba0110")}},function(aNext,aResult){if(!aResult||aResult.status===0){this.getDevices(aNext)}else{console.error("WifiAdvancedPrivateCtrlClass: Internal error");basicUtilities.callback(aNext,false,0,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to get all devices","aba0111")}},function(aNext,aResult){var index,subindex,rootvap,rootdevice,rootradio,privateVapIds=[];if(!aResult||aResult.status===0){fields.currentData.isWifiUsedByDevices=false;fields.currentData.isRadio24Enabled=false;fields.currentData.isRadio5Enabled=false;for(index=0;index<fields.currentData.getPrivateAccessPoints.accessPointList.length;index=index+1){rootvap=fields.currentData.getPrivateAccessPoints.accessPointList[index];if(rootvap.linkType==="WIFI_2.4_PRIVATE"||rootvap.linkType==="WIFI_5_PRIVATE"){privateVapIds.push(rootvap.accessPointId)}}outer_loop:for(index=0;index<fields.currentData.getDevices.deviceList.length;index=index+1){rootdevice=fields.currentData.getDevices.deviceList[index];for(subindex=0;subindex<privateVapIds.length;subindex=subindex+1){if(rootdevice.WIFI.accessPointId===privateVapIds[subindex]){fields.currentData.knownActiveDevices[rootdevice.deviceId]=rootdevice;fields.currentData.isWifiUsedByDevices=true;break outer_loop}}}for(index=0;index<fields.currentData.getPrivateAccessPoints.radioList.length;index=index+1){rootradio=fields.currentData.getPrivateAccessPoints.radioList[index];if(rootradio.frequencyBand.toLowerCase()==="2.4ghz"){fields.currentData.isRadio24Enabled=rootradio.isEnabled}else if(rootradio.frequencyBand.toLowerCase()==="5ghz"){fields.currentData.isRadio5Enabled=rootradio.isEnabled}}this.getViewObj().fields.currentData=fields.currentData;aNext()}else{console.error("WifiAdvancedPrivateCtrlClass: Internal error");basicUtilities.callback(aNext,false,0,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to get devices","aba0112")}},function(aNext){this.listenEvents(aNext)},function(aNext){this.getViewObj().enable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to enable view","aba0113")}}],this)};this.disable=function(aCallback){console.debug("WifiAdvancedPrivateCtrlClass: Disabling state '"+this.getId()+"'");basicUtilities.queue([function(aNext){this.getViewObj().disable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){this.unlistenEvents(aNext)}else{console.error("WifiAdvancedPrivateCtrlClass: Internal error");basicUtilities.callback(aNext,false,0,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to disable view","aba0114")}},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to unlisten events","aba0115")}}],this)};this.refresh=function(aCallback){basicUtilities.queue([function(aNext){this.disable(aNext)},function(aNext,aResult){if(!aResult||aResult.status===0){this.enable(aNext)}else{basicUtilities.callback(aNext,false,0,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to disable view in refresh","aba0116")}},function(aNext,aResult){if(!aResult||aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to enable view in refresh","aba0117")}}],this)};this.listenEvents=function(aCallback){aSahObj.listenEvent("sah.HomeNetwork.NetworkMapEvents",this.handleDeviceEvents.bind(this));if(fields.currentData.private24Id){aSahObj.updateEventListener("NeMo.Intf."+fields.currentData.private24Id+".WPS");fields.pairingObj[fields.currentData.private24Id]=aSahObj.listenEvent("NeMo.Intf."+fields.currentData.private24Id+".WPS",this.handleWifiPairingEvents.bind(this,"pairingObj"))}if(fields.currentData.private5Id){aSahObj.updateEventListener("NeMo.Intf."+fields.currentData.private5Id+".WPS");fields.pairingObj[fields.currentData.private5Id]=aSahObj.listenEvent("NeMo.Intf."+fields.currentData.private5Id+".WPS",this.handleWifiPairingEvents.bind(this,"pairingObj"))}aSahObj.startEventListener();basicUtilities.callback(aCallback,false,0,null)};this.unlistenEvents=function(aCallback){aSahObj.stopEventListener();basicUtilities.callback(aCallback,false,0,null)};this.handleWifiPairingEvents=function(aPairingEvent,aId,aReason){var accessPointId,aData;aData=arguments[arguments.length-1];console.debug("WifiAdvancedPrivateCtrlClass: Receiving pairing event");console.debug("WifiAdvancedPrivateCtrlClass: Receiving pairing event : "+aId+" with reason : "+aReason);if(aData&&aData.reason){if(aReason==="pairingDone"&&aData.reason==="Success"){window.clearTimeout(this.getViewObj().fields.wpsPopupTimer);console.debug("WifiAdvancedPrivateCtrlClass: Receiving pairing event SUCCESS !");this.getViewObj().hidePopup("popup_wps_pairing");for(accessPointId in fields[aPairingEvent]){if(fields[aPairingEvent].hasOwnProperty(accessPointId)){console.debug("WifiAdvancedPrivateCtrlClass: Ending listen to 'NeMo.Intf."+accessPointId+".WPS'");this.unlistenEvent("NeMo.Intf."+accessPointId+".WPS",fields[aPairingEvent][accessPointId]);fields[aPairingEvent][accessPointId]=null}}console.debug("WifiAdvancedPrivateCtrlClass: Pairing ended")}}};this.handleDeviceEvents=function(id,data){var key,count;if(id==="sah.HomeNetwork.NetworkMapEvents"){if(data.reason==="wifi_device_added"){if(data.attributes.hasOwnProperty(data.location)){fields.currentData.knownActiveDevices[data.location]=data.attributes[data.location];fields.currentData.isWifiUsedByDevices=true;this.getViewObj().fields.currentData.isWifiUsedByDevices=true}}else if(data.reason==="wifi_device_removed"){if(data.attributes.hasOwnProperty(data.location)){delete fields.currentData.knownActiveDevices[data.location];count=0;for(key in fields.currentData.knownActiveDevices){if(fields.currentData.knownActiveDevices.hasOwnProperty(key)){count+=1}}if(count){fields.currentData.isWifiUsedByDevices=true;this.getViewObj().fields.currentData.isWifiUsedByDevices=true}else{fields.currentData.isWifiUsedByDevices=false;this.getViewObj().fields.currentData.isWifiUsedByDevices=false}}}else if(data.reason==="wifi_device_updated"){if(data.attributes.hasOwnProperty(data.location)){fields.currentData.knownActiveDevices[data.location]=data.attributes[data.location]}if(data.attributes[data.location].hasOwnProperty("Active")){if(data.attributes[data.location].Active===true){fields.currentData.isWifiUsedByDevices=true;this.getViewObj().fields.currentData.isWifiUsedByDevices=true}else{if(data.attributes.hasOwnProperty(data.location)){delete fields.currentData.knownActiveDevices[data.location];count=0;for(key in fields.currentData.knownActiveDevices){if(fields.currentData.knownActiveDevices.hasOwnProperty(key)){count+=1}}if(count){fields.currentData.isWifiUsedByDevices=true;this.getViewObj().fields.currentData.isWifiUsedByDevices=true}else{fields.currentData.isWifiUsedByDevices=false;this.getViewObj().fields.currentData.isWifiUsedByDevices=false}}}}}}};this.getPrivateAccessPoints=function(aCallback){var index;basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Server.WiFi.listAccessPoints",aNext,{linkTypeList:["WIFI_2.4_PRIVATE","WIFI_5_PRIVATE"]})},function(aNext,aResult){if(aResult.status===0){if(aResult.hasOwnProperty("data")){fields.currentData.getPrivateAccessPoints=aResult.data;if(aResult.data.hasOwnProperty("accessPointList")){for(index=0;index<aResult.data.accessPointList.length;index=index+1){if(aResult.data.accessPointList[index].linkType.indexOf("WIFI_2.4_PRIVATE")>-1){fields.currentData.private24Id=aResult.data.accessPointList[index].accessPointId;fields.currentData.ssidCollision.private24=aResult.data.accessPointList[index].ssid}else if(aResult.data.accessPointList[index].linkType.indexOf("WIFI_5_PRIVATE")>-1){fields.currentData.private5Id=aResult.data.accessPointList[index].accessPointId;fields.currentData.ssidCollision.private5=aResult.data.accessPointList[index].ssid}}}if(aResult.data.hasOwnProperty("radioList")){for(index=0;index<aResult.data.radioList.length;index=index+1){if(aResult.data.radioList[index].frequencyBand.toLowerCase().indexOf("2.4ghz")>-1){fields.currentData.radio24Id=aResult.data.radioList[index].radioId}else if(aResult.data.radioList[index].frequencyBand.toLowerCase().indexOf("5ghz")>-1){fields.currentData.radio5Id=aResult.data.radioList[index].radioId}}}}basicUtilities.callback(aCallback,false,0,aResult.data)}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to retrieve access points");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to retrieve access points","aba0118")}}],this)};this.getGuestAndHotspot=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Server.WiFi.listAccessPoints",aNext,{})},function(aNext,aResult){var index;if(aResult.status===0){if(aResult.hasOwnProperty("data")){if(aResult.data.hasOwnProperty("accessPointList")){for(index=0;index<aResult.data.accessPointList.length;index=index+1){if(aResult.data.accessPointList[index].linkType.indexOf("WIFI_2.4_GUEST")>-1){fields.currentData.ssidCollision.guest24=aResult.data.accessPointList[index].ssid}else if(aResult.data.accessPointList[index].linkType.indexOf("WIFI_5_GUEST")>-1){fields.currentData.ssidCollision.guest5=aResult.data.accessPointList[index].ssid}}}}basicUtilities.callback(aNext,false,0,aResult.data)}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to retrieve global wifi status");basicUtilities.callback(aNext,false,0,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to retrieve global wifi status","aba0216")}},function(aNext){this.callSahApi("sah.Connection.Server.WiFi.getHotSpotState",aNext,null)},function(aNext,aResult){var index;if(aResult.status===0){if(aResult.hasOwnProperty("data")){if(aResult.data.hasOwnProperty("hostspotList")){for(index=0;index<aResult.data.hostspotList.length;index=index+1){if(aResult.data.hostspotList[index].isSecured){fields.currentData.ssidCollision.secureHotspot=aResult.data.hostspotList[index].ssid}else{fields.currentData.ssidCollision.openHotspot=aResult.data.hostspotList[index].ssid}}}}basicUtilities.callback(aCallback,false,0,aResult.data)}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to retrieve hotspot state");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to retrieve hotspot state","aba0217")}}],this)};this.setAccessPoint=function(aCallback,aParam){if(typeof aParam!=="undefined"){if(aParam.hasOwnProperty("accessPointId")){basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Server.WiFi.configureAccessPoint",aNext,aParam)},function(aNext,aResult){if(aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to set access point");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to set access point","aba0119")}}],this)}else{console.error("WifiAdvancedPrivateCtrlClass: no access point ID was given to set");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: no access point ID was given to set","aba0120")}}else{console.error("WifiAdvancedPrivateCtrlClass: no value was given to set");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: no value was given to set","aba0121")}};this.setRadioUsageMode=function(aCallback,aParam){if(typeof aParam!=="undefined"){if(aParam.hasOwnProperty("radioUsageMode")){basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Server.WiFi.setRadioUsageMode",aNext,aParam)},function(aNext,aResult){if(aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to set radio usage mode");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to set radio usage mode","aba0122")}}],this)}else{console.error("WifiAdvancedPrivateCtrlClass: no radio usage mode was given to set");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: no radio usage mode was given to set","aba0123")}}else{console.error("WifiAdvancedPrivateCtrlClass: no value was given to set");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: no value was given to set","aba0124")}};this.setRadio=function(aCallback,aParam){if(typeof aParam!=="undefined"){if(aParam.hasOwnProperty("radioId")){basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Server.WiFi.configureRadio",aNext,aParam)},function(aNext,aResult){if(aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to set radio");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to set radio","aba0125")}}],this)}else{console.error("WifiAdvancedPrivateCtrlClass: no radio ID was given to set");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: no radio ID was given to set","aba0126")}}else{console.error("WifiAdvancedPrivateCtrlClass: no value was given to set radio");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: no value was given to set radio","aba0127")}};this.getPrivateWpsPairing=function(aCallback){if(typeof fields.currentData.private24Id==="string"&&typeof fields.currentData.private5Id==="string"){basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Server.WiFi.getWpsPairing",aNext,{accessPointIdList:[fields.currentData.private24Id,fields.currentData.private5Id]})},function(aNext,aResult){if(aResult.status===0){fields.currentData.getPrivateWpsPairing=aResult.data;basicUtilities.callback(aCallback,false,0,aResult.data)}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to get private wps pairing");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to get private wps pairing","aba0128")}}],this)}else{console.warn("WifiAdvancedPrivateCtrlClass: private access points IDs is not known, cannot get private wps pairing");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: private access points IDs is not known, cannot get private wps pairing","aba0129")}};this.setWpsPairing=function(aCallback,aParam){if(typeof aParam!=="undefined"){if(aParam.hasOwnProperty("accessPointIdList")){basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Server.WiFi.configureWpsPairing",aNext,aParam)},function(aNext,aResult){if(aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to set wps pairing");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to set wps pairing","aba0130")}}],this)}else{console.error("WifiAdvancedPrivateCtrlClass: no access point ID was given to set");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: no access point ID was given to set","aba0131")}}else{console.error("WifiAdvancedPrivateCtrlClass: no value was given to set");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: no value was given to set","aba0132")}};this.getPrivateMacFiltering=function(aCallback){if(typeof fields.currentData.private24Id==="string"&&typeof fields.currentData.private5Id==="string"){basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Server.WiFi.getMacFiltering",aNext,{accessPointIdList:[fields.currentData.private24Id,fields.currentData.private5Id]})},function(aNext,aResult){if(aResult.status===0){fields.currentData.getPrivateMacFiltering=aResult.data;basicUtilities.callback(aCallback,false,0,aResult.data)}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to get private mac filtering");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to get private mac filtering","aba0133")}}],this)}else{console.warn("WifiAdvancedPrivateCtrlClass: private access points IDs is not known, cannot get private mac filtering");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: private access points IDs is not known, cannot get private mac filtering","aba0134")}};this.setMacfiltering=function(aCallback,aParam){if(typeof aParam!=="undefined"){if(aParam.hasOwnProperty("accessPointIdList")){basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Server.WiFi.configureMacFiltering",aNext,aParam)},function(aNext,aResult){if(aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to set mac filtering");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to set mac filtering","aba0135")}}],this)}else{console.error("WifiAdvancedPrivateCtrlClass: no access point ID was given to set");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: no access point ID was given to set","aba0136")}}else{console.error("WifiAdvancedPrivateCtrlClass: no value was given to set");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: no value was given to set","aba0137")}};this.addMacFilteringEntries=function(aCallback,aParam){if(typeof aParam!=="undefined"){if(aParam.hasOwnProperty("accessPointIdList")){basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Server.WiFi.addMacFilteringEntries",aNext,aParam)},function(aNext,aResult){if(aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to add mac filtering entries");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to add mac filtering entries","aba0138")}}],this)}else{console.error("WifiAdvancedPrivateCtrlClass: no access point ID was given to set");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: no access point ID was given to set","aba0139")}}else{console.error("WifiAdvancedPrivateCtrlClass: no value was given to set");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: no value was given to set","aba0140")}};this.deleteMacFilteringEntries=function(aCallback,aParam){if(typeof aParam!=="undefined"){if(aParam.hasOwnProperty("accessPointIdList")){basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Server.WiFi.deleteMacFilteringEntries",aNext,aParam)},function(aNext,aResult){if(aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to delete mac filtering entries");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to delete mac filtering entries","aba0141")}}],this)}else{console.error("WifiAdvancedPrivateCtrlClass: no access point ID was given to set");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: no access point ID was given to set","aba0142")}}else{console.error("WifiAdvancedPrivateCtrlClass: no value was given to set");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: no value was given to set","aba0143")}};this.startWpsPairing=function(aCallback,aParam){if(typeof aParam==="undefined"){aParam=null}basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Server.WiFi.startWpsPairing",aNext,aParam)},function(aNext,aResult){if(aResult.status===0){if(aResult.hasOwnProperty("data")){fields.currentData.startWpsPairing=aResult.data;basicUtilities.callback(aCallback,false,0,aResult.data)}else{basicUtilities.callback(aCallback,false,0,null)}}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to start wps pairing");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to start wps pairing","aba0144")}}],this)};this.stopWpsPairing=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.Connection.Server.WiFi.stopWpsPairing",aNext,{})},function(aNext,aResult){if(aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to stop wps pairing");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to stop wps pairing","aba0145")}}],this)};this.getAllDevices=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.HomeNetwork.NetworkMap.listDevices",aNext,{filter:{linkModeList:["WIFI"]}})},function(aNext,aResult){var index;if(aResult.status===0){fields.currentData.getAllDevices=aResult.data;fields.currentData.getActiveDevices.deviceList=[];for(index=0;index<aResult.data.deviceList.length;index=index+1){if(aResult.data.deviceList[index].isActive){fields.currentData.getActiveDevices.deviceList.push(aResult.data.deviceList[index])}}basicUtilities.callback(aCallback,false,0,aResult.data)}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to retrieve active devices on WiFi");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to retrieve active devices on WiFi","aba0146")}}],this)};this.getDevices=function(aCallback){basicUtilities.queue([function(aNext){this.callSahApi("sah.HomeNetwork.NetworkMap.listDevices",aNext,{filter:{linkModeList:["WIFI"],isActive:true}})},function(aNext,aResult){if(aResult.status===0){fields.currentData.getDevices=aResult.data;basicUtilities.callback(aCallback,false,0,aResult.data)}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to retrieve active devices on WiFi");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to retrieve active devices on WiFi","aba0147")}}],this)};this.saveAll=function(aCallback,aData){basicUtilities.queue([function(aNext){if(aData.value.hasOwnProperty("wps")){this.setWpsPairing(aNext,aData.value.wps)}else{basicUtilities.callback(aNext,false,0,null)}},function(aNext,aResult){if(aResult.status===0){if(aData.value.hasOwnProperty("macDel")){this.deleteMacFilteringEntries(aNext,aData.value.macDel)}else{basicUtilities.callback(aNext,false,0,null)}}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to set mac filtering settings");basicUtilities.callback(aNext,false,0,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to set mac filtering settings","aba0148")}},function(aNext,aResult){if(aResult.status===0){if(aData.value.hasOwnProperty("macAdd")){this.addMacFilteringEntries(aNext,aData.value.macAdd)}else{basicUtilities.callback(aNext,false,0,null)}}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to delete mac filtering entries");basicUtilities.callback(aNext,false,0,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to delete mac filtering entries","aba0149")}},function(aNext,aResult){if(aResult.status===0){if(aData.value.hasOwnProperty("mac")){this.setMacfiltering(aNext,aData.value.mac)}else{basicUtilities.callback(aNext,false,0,null)}}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to set wps settings");basicUtilities.callback(aNext,false,0,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to set wps settings","aba0150")}},function(aNext,aResult){if(aResult.status===0){if(aData.value.hasOwnProperty("vap")){this.setAccessPoint(aNext,aData.value.vap)}else{basicUtilities.callback(aNext,false,0,null)}}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to add mac filtering entries");basicUtilities.callback(aNext,false,0,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to add mac filtering entries","aba0151")}},function(aNext,aResult){if(aResult.status===0){if(aData.value.hasOwnProperty("radio")){this.setRadio(aNext,aData.value.radio)}else{basicUtilities.callback(aNext,false,0,null)}}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to set access point settings");basicUtilities.callback(aNext,false,0,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to set access point settings","aba0152")}},function(aNext,aResult){if(aResult.status===0){if(aData.value.hasOwnProperty("radioUsageMode")){this.setRadioUsageMode(aNext,{radioUsageMode:aData.value.radioUsageMode})}else{console.debug("WifiAdvancedPrivateCtrlClass: setting radio usage mode was skipped");basicUtilities.callback(aNext,false,0,null)}}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to set radio settings");basicUtilities.callback(aNext,false,0,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to set radio settings","aba0153")}},function(aNext,aResult){if(aResult.status===0){basicUtilities.callback(aCallback,false,0,null)}else{console.warn("WifiAdvancedPrivateCtrlClass: Failed to set radio usage mode");basicUtilities.callback(aCallback,false,-1,null);this.getViewObj().notifyError("WifiAdvancedPrivateCtrlClass: Failed to set radio usage mode","aba0154")}}],this)}}return WifiAdvancedPrivateCtrlClass});