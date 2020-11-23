define(["utils/basics","utils/console"],function(basicUtilities,console){"use strict";var fields;fields={eventHandler:null,isEnabled:false};return{setEventHandler:function(aEventHandler){fields.eventHandler=aEventHandler},enable:function(){fields={eventHandler:fields.eventHandler,isEnabled:true}},disable:function(){var topic,indEvent;for(topic in fields){if(fields.hasOwnProperty(topic)){if(typeof fields[topic]==="object"&&fields[topic].eventList){for(indEvent=0;indEvent<fields[topic].eventList.length;indEvent+=1){fields.eventHandler.unregister(fields[topic].eventList[indEvent].handler,fields[topic].eventList[indEvent].reason,fields[topic].eventList[indEvent].sessionId,fields[topic].eventList[indEvent].uuid)}}}}fields.isEnabled=false},start:function(aTopicId,aEventTab){var indEvent,uuid;if(!fields.isEnabled){return}if(!fields[aTopicId]){fields[aTopicId]={skipNext:aTopicId==="Zapping"?true:false,initStart:null,lastStart:null,lastDuration:0,nbSuccess:0,ttlDuration:0,minDuration:999999,avgDuration:0,maxDuration:0,nbError:0,nbSkipped:0,eventList:[]};fields[aTopicId].initStart=new Date}else{if(fields[aTopicId].lastStart){console.warn("statProcessor: Starting statistics while previous one has not ended");fields[aTopicId].nbError+=1;fields[aTopicId].skipNext=aTopicId==="Zapping"?true:false}}fields[aTopicId].lastStart=new Date;if(aEventTab&&fields.eventHandler){for(indEvent=0;indEvent<aEventTab.length;indEvent+=1){uuid=fields.eventHandler.register(aEventTab[indEvent].handler,aEventTab[indEvent].reason,aEventTab[indEvent].sessionId,this.end.bind(this,aTopicId,0));fields[aTopicId].eventList.push({handler:aEventTab[indEvent].handler,reason:aEventTab[indEvent].reason,sessionId:aEventTab[indEvent].sessionId,uuid:uuid})}}},end:function(aTopicId,aStatus){var lastEnd,indEvent;if(!fields[aTopicId]){console.error("statProcessor: Ending statistic measure that has not been started for '"+aTopicId+"'");return}for(indEvent=0;indEvent<fields[aTopicId].eventList.length;indEvent+=1){fields.eventHandler.unregister(fields[aTopicId].eventList[indEvent].handler,fields[aTopicId].eventList[indEvent].reason,fields[aTopicId].eventList[indEvent].sessionId,fields[aTopicId].eventList[indEvent].uuid)}if(!fields.isEnabled){return}fields[aTopicId].eventList=[];if(aStatus===0){if(!fields[aTopicId].skipNext){lastEnd=new Date;fields[aTopicId].lastDuration=lastEnd.getTime()-fields[aTopicId].lastStart.getTime();fields[aTopicId].nbSuccess+=1;fields[aTopicId].ttlDuration+=fields[aTopicId].lastDuration;fields[aTopicId].avgDuration=parseInt(fields[aTopicId].ttlDuration/fields[aTopicId].nbSuccess,10);if(fields[aTopicId].minDuration>fields[aTopicId].lastDuration){fields[aTopicId].minDuration=fields[aTopicId].lastDuration}if(fields[aTopicId].maxDuration<fields[aTopicId].lastDuration){fields[aTopicId].maxDuration=fields[aTopicId].lastDuration}}else{fields[aTopicId].skipNext=false;fields[aTopicId].nbSkipped+=1}}else{fields[aTopicId].nbError+=1;fields[aTopicId].skipNext=aTopicId==="Zapping"?true:false}fields[aTopicId].lastStart=null},get:function(aTopicId){if(!fields.isEnabled){return null}return fields[aTopicId]},format:function(aTopicId){var total,end,duration,avgDuration,minDuration,maxDuration,ttlDuration;if(!fields.isEnabled){return""}if(!fields[aTopicId]){return""}total=fields[aTopicId].nbSuccess+fields[aTopicId].nbError+fields[aTopicId].nbSkipped;end=new Date;duration=parseInt((end.getTime()-fields[aTopicId].initStart.getTime())/1e3,10);if(fields[aTopicId].avgDuration>1e3){avgDuration=basicUtilities.formatTime(parseInt(fields[aTopicId].avgDuration/1e3,10),2)}else{avgDuration=fields[aTopicId].avgDuration+"ms"}if(fields[aTopicId].minDuration>1e3){minDuration=basicUtilities.formatTime(parseInt(fields[aTopicId].minDuration/1e3,10),2)}else{minDuration=fields[aTopicId].minDuration+"ms"}if(fields[aTopicId].maxDuration>1e3){maxDuration=basicUtilities.formatTime(parseInt(fields[aTopicId].maxDuration/1e3,10),2)}else{maxDuration=fields[aTopicId].maxDuration+"ms"}if(fields[aTopicId].ttlDuration>1e3){ttlDuration=basicUtilities.formatTime(parseInt(fields[aTopicId].ttlDuration/1e3,10),2)}else{ttlDuration=fields[aTopicId].ttlDuration+"ms"}return total+" operations ("+fields[aTopicId].nbSuccess+" ok - "+fields[aTopicId].nbError+" err - "+fields[aTopicId].nbSkipped+" skip) in "+basicUtilities.formatTime(duration,2)+" with an average time of "+avgDuration+" (min "+minDuration+" - max "+maxDuration+" - ttl "+ttlDuration+")"}}});