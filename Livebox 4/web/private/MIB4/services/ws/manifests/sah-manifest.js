define(["jquery","jquery-ui","lib/sah-core/sah"],function($){"use strict";var quickClone=function(obj){return JSON.parse(JSON.stringify(obj))},launchParameters={};location.search.substr(1).split("&").forEach(function(item){launchParameters[item.split("=")[0]]=item.split("=")[1]});if(typeof Storage!=="undefined"){if(launchParameters.noResetTiles!=="1"){localStorage.removeItem("sah_manifests");console.log("manifests stored in localStorage were deleted.")}}SAH.Manifest=function(data){var _this=this,_private={data:data||{},name:function(){if(_private.data.Name==undefined){return _private.data.Id}return _private.data.Name},title:function(){if(_private.data.Title==undefined){return _private.name()}return _private.data.Title},icon:function(){if(_private.data.Icon==undefined){return"images/unknown.png"}if(_private.data.Icon.indexOf("/")==-1){return"apps/"+_private.data.Id+"/images/"+_private.data.Icon}else{return _private.data.Icon}},app:function(){var default_url="apps/"+_private.data.Id+"/index.html";if(_private.data.Application==undefined||_private.data.Application.url==undefined){return default_url}return"apps/"+_private.data.Id+"/"+_private.data.Application.url},main:function(){if(_private.data.Application==undefined){return undefined}return _private.data.Application.main},settings:function(){return _private.data.Application.settings||{}},type:function(){if(_private.data.Type==undefined){if(_this.isApplication()){return"application"}if(_this.isLink()){return"link"}if(_this.hasApplet()){return"applet"}return"unknown"}return _private.data.Type},description:function(){if(_private.data.Description==undefined){return""}if(_private.data.Description.indexOf("/")==-1){return"apps/"+_private.data.Id+"/"+_private.data.Description}else{return _private.data.Description}},category:function(){if(_private.data.Category==undefined){return"Custom"}return _private.data.Category},applets:function(){if(!_this.hasApplet()){return 0}if($.isArray(_private.data.Applet)){return _private.data.Applet.length}else{return 1}},applet:{url:function(index){if(!_this.hasApplet()){return undefined}if($.isArray(_private.data.Applet)){if(index<_private.data.Applet.length){if(_private.data.Applet[index].url.indexOf("/")==-1){return"apps/"+_private.data.Id+"/"+_private.data.Applet[index].url}else{return _private.data.Applet[index].url}}else{return undefined}}else{if(_private.data.Applet.url.indexOf("/")==-1){return"apps/"+_private.data.Id+"/"+_private.data.Applet.url}else{return _private.data.Applet.url}}},"class":function(index){if(!_this.hasApplet()){return undefined}if($.isArray(_private.data.Applet)){if(index<_private.data.Applet.length){return _private.data.Applet[index]["class"]}else{return undefined}}else{return _private.data.Applet["class"]}},init:function(index){if(!_this.hasApplet()){return undefined}if($.isArray(_private.data.Applet)){if(index<_private.data.Applet.length){return _private.data.Applet[index].initializer}else{return undefined}}else{return _private.data.Applet.initializer}},settings:function(index){if(!_this.hasApplet()){return{}}if($.isArray(_private.data.Applet)){if(index<_private.data.Applet.length){return _private.data.Applet[index].settings||{}}else{return{}}}else{return _private.data.Applet.settings||{}}},name:function(index){if(!_this.hasApplet()){return undefined}if($.isArray(_private.data.Applet)){if(index<_private.data.Applet.length){return _private.data.Applet[index].name}else{return undefined}}else{return _private.data.Applet.name}}}};_this.id=function(){return _private.data.Id};_this.option=function(option,index){if(_private[option]==undefined){var list=option.split("."),object=_private,i=0;while(i<list.length-1&&object[list[i]]!=undefined){object=object[list[i]];i++}if(i<list.length-1){return undefined}if(object[list[list.length-1]]==undefined){return undefined}return object[list[list.length-1]](index)}else{return _private[option](index)}};_this.language=function(lang){return _private.data[lang]};_this.setFavorite=function(index){if(index==undefined){_private.data.favorite=true}else{if($.isArray(_private.data.Applet)){_private.data.Applet[index].favorite=true}else{_private.data.Applet.favorite=true}}};_this.clearFavorite=function(index){if(index==undefined){_private.data.favorite=false}else{if($.isArray(_private.data.Applet)){_private.data.Applet[index].favorite=false}else{_private.data.Applet.favorite=false}}};_this.isFavorite=function(index){if(index==undefined){return _private.data.favorite}else{if($.isArray(_private.data.Applet)){return _private.data.Applet[index].favorite}else{return _private.data.Applet.favorite}}};_this.isApplication=function(){return!(_private.data.Application==undefined)};_this.isLink=function(){return!(_private.data.Link==undefined)};_this.hasApplet=function(){return!(_private.data.Applet==undefined)};_this.hasIcon=function(){return!(_private.data.Icon==undefined)};_this.applet=function(){return _private.data.Applet};_this.sizeHint=function(index){var size=[1,1];if(_this.hasApplet()){if($.isArray(_private.data.Applet)&&_private.data.Applet[index]!=undefined){size[0]=_private.data.Applet[index].width;size[1]=_private.data.Applet[index].height}else{size[0]=_private.data.Applet.width;size[1]=_private.data.Applet.height}}return size}};SAH.Manifests=new SAH.Object("Manifests");SAH.Manifests.manifests=[];SAH.Manifests.category=[];SAH.Manifests.get=function(){var deferred=$.Deferred();if(typeof Storage!=="undefined"){var result=localStorage.getItem("sah_manifests"),result2;if(result){result2=JSON.parse(result);this.manifests=[];for(var i=0;i<result2.manifests.status.length;i++){this.manifests[i]=new SAH.Manifest(result2.manifests.status[i])}deferred.resolve(this.manifests.slice(0))}else{$.ajax({url:"services/ws/manifests/manifest",success:function(result){var result2=JSON.parse(result);this.manifests=[];for(var i=0;i<result2.manifests.status.length;i++){this.manifests[i]=new SAH.Manifest(result2.manifests.status[i])}localStorage.setItem("sah_manifests",result);deferred.resolve(this.manifests.slice(0))}.bind(this),async:false})}}else{console.log("localStorage not supported.");$.ajax({url:"services/ws/manifests/manifest",success:function(result){var result2=JSON.parse(result);this.manifests=[];for(var i=0;i<result2.manifests.status.length;i++){this.manifests[i]=new SAH.Manifest(result2.manifests.status[i])}deferred.resolve(this.manifests.slice(0))}.bind(this),async:false})}return deferred.promise()};SAH.Manifests.lookup=function(id){for(var i=0;i<SAH.Manifests.manifests.length;i++){var manifest=SAH.Manifests.manifests[i];if(manifest.id()==id){return manifest}}return undefined};SAH.Manifests.categories=function(){var deferred=$.Deferred();if(typeof Storage!=="undefined"){var result=localStorage.getItem("sah_manifests"),result2;if(result){result2=JSON.parse(result);this.category=result2.categories.status;deferred.resolve(this.category.slice(0))}else{$.ajax({url:"services/ws/manifests/manifest",success:function(result){var result2=JSON.parse(result);this.category=result2.categories.status;deferred.resolve(this.category.slice(0))}.bind(this),async:false})}}else{console.log("localStorage not supported.");$.ajax({url:"services/ws/manifests/manifest",success:function(result){var result2=JSON.parse(result);this.category=result2.categories.status;deferred.resolve(this.category.slice(0))}.bind(this),async:false})}return deferred.promise()};SAH.Manifests.store=function(option,data){var deferred=$.Deferred();if(typeof Storage!=="undefined"){var manifestGet,index,index2,currentManifestId,currentRootManifest,newManifests=[],foundAsFavorite;manifestGet=JSON.parse(localStorage.getItem("sah_manifests"));for(index=0;index<manifestGet.manifests.status.length;index=index+1){foundAsFavorite=false;currentRootManifest=quickClone(manifestGet.manifests.status[index]);if(currentRootManifest.Category!=="Favorites"){currentRootManifest.Applet[0].favorite=0;for(index2=0;index2<data.categories.Favorites.length;index2=index2+1){currentManifestId=data.categories.Favorites[index2].manifest;if(currentManifestId===currentRootManifest.Id){var modifiedCurrentRootManifest=quickClone(manifestGet.manifests.status[index]);modifiedCurrentRootManifest.Category="Favorites";modifiedCurrentRootManifest.Applet[0].favorite=1;foundAsFavorite=true;newManifests.push(modifiedCurrentRootManifest);break}}if(foundAsFavorite){currentRootManifest.Applet[0].favorite=1}newManifests.push(currentRootManifest)}else if(currentRootManifest.Id==="favorites"){newManifests.push(currentRootManifest)}}manifestGet.manifests.status=newManifests;localStorage.removeItem("sah_manifests");localStorage.setItem("sah_manifests",JSON.stringify(manifestGet));deferred.resolve(true)}else{console.log("localStorage not supported. Favorites cannot be saved and will be lost.");deferred.resolve(true)}return deferred.promise()};SAH.Manifests.retrieve=function(option,data){var deferred=$.Deferred();deferred.resolve([]);return deferred.promise()};SAH.Profile=new SAH.Object("Profiles.Profile");SAH.Profile.getData=function(){var deferred=$.Deferred();$.ajax({url:"services/ws/manifests/manifest",success:function(result){var result2=JSON.parse(result);deferred.resolve(result2.profiles.status)},async:false});return deferred.promise()};SAH.Profile.setData=function(profileId,data,profileName){var deferred=$.Deferred();deferred.resolve(true);return deferred.promise()};SAH.Profile.current=function(profileId,profileName){var deferred=$.Deferred();deferred.resolve("sah");return deferred.promise()};SAH.Profile.getNames=function(profileId){var deferred=$.Deferred();deferred.resolve("sah,orange,overview");return deferred.promise()};SAH.Profile.get=function(profileId){var deferred=$.Deferred();var result={Current:"sah",Profiles:"sah,orange,overview"};deferred.resolve(result);return deferred.promise()}});