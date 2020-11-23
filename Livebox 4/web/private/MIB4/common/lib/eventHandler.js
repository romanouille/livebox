define(["utils/console"],function(console){"use strict";function EventHandlerClass(aId,aEventIdTab){var fields,buidEventList=function(aEventIdTab){var indEvent;for(indEvent=0;indEvent<aEventIdTab.length;indEvent+=1){fields.eventList[aEventIdTab[indEvent]]={}}},doGenerateEvent=function(aCallback,aEventId,aData){aCallback(aEventId,aData)};fields={id:aId,eventList:{}};buidEventList.call(this,aEventIdTab);this.setEventList=function(aEventIdTab){buidEventList.call(this,aEventIdTab)};this.subscribeEvent=function(aEventIdTab,aSubscriberId,aCallback){var indEvent,eventId;for(indEvent=0;indEvent<aEventIdTab.length;indEvent+=1){eventId=aEventIdTab[indEvent];if(fields.eventList[eventId]){fields.eventList[eventId][aSubscriberId]=aCallback}else{console.error("EventHandlerClass: Impossible to register unknown event '"+eventId+"' on '"+fields.id+"' for subscriber '"+aSubscriberId+"'")}}};this.unsubscribeEvent=function(aEventIdTab,aSubscriberId){var indEvent,eventId;for(indEvent=0;indEvent<aEventIdTab.length;indEvent+=1){eventId=aEventIdTab[indEvent];if(fields.eventList[eventId]){if(!fields.eventList[eventId][aSubscriberId]){console.error("EventHandlerClass: Trying to unsubscribe an event '"+eventId+"' on '"+fields.id+"' with an invalid subscriber '"+aSubscriberId+"'")}else{fields.eventList[eventId][aSubscriberId]=null}}}};this.generateEvent=function(aEventId,aData){var subscriber;if(fields.eventList[aEventId]){for(subscriber in fields.eventList[aEventId]){if(fields.eventList[aEventId].hasOwnProperty(subscriber)){if(fields.eventList[aEventId][subscriber]){window.setTimeout(doGenerateEvent.bind(this,fields.eventList[aEventId][subscriber],aEventId,aData),0);console.debug("EventHandlerClass: Generating event '"+aEventId+"' from '"+fields.id+"' to '"+subscriber+"' '"+JSON.stringify(aData)+"'")}}}}else{console.error("EventHandlerClass: Failed to generate unknown event '"+aEventId+"' from '"+fields.id+"'")}}}return EventHandlerClass});