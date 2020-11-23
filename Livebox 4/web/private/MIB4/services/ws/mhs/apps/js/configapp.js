define(["jquery","jquery-ui","lib/sah-core/sah"],function($){"use strict";$.fn.val2=function(){var rawval=this.data("rawval");if(rawval){return rawval.apply(this,arguments)}else{return this.val.apply(this,arguments)}};$.fn.validate=function(){var f=this.data("validate");if(f){return f.apply(this,arguments)}else{return true}};$.widget("sah.configapp",{_create:function(){this.element.addClass("configapp");$(".sah_app").append($('<div class="error"></div>'));SAH.currentTranslator().run(this.element);console.log("loaded configapp")},_destroy:function(){this.element.removeClass("configapp");console.log("destroyed configapp")},addItem:function(name_id,update_handler,flags,valuelist){var self=this;if(!flags)flags={};var item=$('<div class=sub><div></div><div><input type="text" class="neutral" value=""/></div></div>');item.find("div:first-child").html(name_id);item.find("div").eq(1).css("position","relative");var input=item.find("input");if(flags.readonly){input.addClass("readonly").attr("readonly","")}if(flags.mapvalue){input.data("rawval",function(a){if(a!=undefined)return $(this).val(valuelist[flags.mapvalue.indexOf(a)]);else return flags.mapvalue[valuelist.indexOf($(this).val())]})}if(flags.validate){input.data("validate",function(){return self.validateInput($(this),flags.validate)})}if(flags.note){item.find("div:first-child").append("<i> ("+flags.note+")</i>");item.find("div:first-child i").css("font-size","80%")}if(update_handler){input.val2(update_handler()).bind("update",function(){$(this).val2(update_handler())})}input.attr("iid",name_id);if(valuelist&&!flags.readonly){input.attr("readonly","").on("focus",function(e){e.stopImmediatePropagation();var par=$(this).parent();par.append($('<div class="tooltips"><div class="tooltips-options"></div></div>'));par.find(".tooltips-options").html("<div>"+valuelist.join("</div><div>")+"</div>");par.find(".tooltips").css({top:input.outerHeight(),left:"8%",width:input.width()-30}).finish().fadeIn("fast");par.find(".tooltips-options div").click(function(e){e.stopImmediatePropagation();input.val($(this).html());par.find(".tooltips").fadeOut("fast")})}).on("blur",function(e){e.stopImmediatePropagation();$(this).parent().find(".tooltips").fadeOut("fast",function(){$(this).remove()})})}return item},validateInput:function(input,format){var ok=false;var value=input.val2();var empty_allowed=false;if(format.substr(0,2)=="e|"){empty_allowed=true;format=format.substr(2)}if(empty_allowed&&value.length==0){ok=true}else if(format=="uint"){if(/^\d+$/.test(value))ok=true}else if(format=="ip"){if(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value))ok=true}else if(format=="mac"){if(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/.test(value))ok=true}else if(format=="nonempty"){if(value.length>0)ok=true}else if(format=="mask"){if(/^\d+$/.test(value)&&value<=32)ok=true}if(!ok){var par=input.parent();par.append($('<div class="error"><div class="error-message"></div></div>'));par.find(".error").css({top:input.outerHeight(),left:0}).fadeIn("fast");par.find(".error-message").html("not a valid "+format);setTimeout(function(){par.find(".error").fadeOut("slow",function(){$(this).remove()})},2e3);input.css("border","1px solid #ff8888")}else{input.css("border","1px solid #ccc")}input.data("validated",ok);return ok},showError:function(errstr,e){for(var err in e){errstr+="<br>* "+e[err].info+": "+e[err].description}var dialog=$('<div class="modal-content"></div>');dialog.html('<div class="content-data-section">'+"<label>"+errstr+"</label>"+'<div class="content-data-buttons">'+"<button>OK</button>"+"</div>"+"</div>");dialog.find("button").eq(0).click(function(){dialog.remove()});dialog.append(".sah_app");$(".spinner").hide()},addSaveButton:function(handler,str){if(!str)str="Save";var buttons=$('<div class="content-data-buttons"><button>'+str+"</button></div>");buttons.find("button").click(handler);return buttons},addSwitchButton:function(enabled,text,handler){var buttons=$('<div class="content-data-buttons2"><button></button></div>');buttons.find("button").click(function(){enabled=!enabled;if(enabled){$(this).html(text.on).removeClass("disabled").addClass("enabled")}else{$(this).html(text.off).removeClass("enabled").addClass("disabled")}$(this).data({state:enabled});handler()}).html(enabled?text.on:text.off).addClass(enabled?"enabled":"disabled").data({state:enabled});return buttons},handleDropDown:function(event){event.stopImmediatePropagation();if($(this).parent().children().length>1){if($(this).parent().hasClass("close")){$(this).parent().removeClass("close").addClass("open");var a=$(this).parent().children().length;$(this).parent().animate({height:a*41},"slow")}else{$(this).parent().removeClass("open").addClass("close");$(this).parent().animate({height:28},"slow")}}},showConfirmDialog:function(str,handler){var dialog=$("#modal-content");dialog.html('<div class="content-data-section">'+"<label>"+str+"</label>"+'<div class="content-data-buttons">'+"<button>Cancel</button>"+"<button>Delete</button>"+"</div>"+"</div>");dialog.find("button").eq(0).click(function(){dialog.hide().empty()});dialog.find("button").eq(1).click(function(){dialog.hide().empty();handler()});dialog.show()},setPlus:function(el){el.find(".plus").parent().off("click").on("click",function(){if($(this).next().hasClass("close")){$(this).next().slideDown("slow").removeClass("close").addClass("open");$(this).find(".plus").html("-")}else{$(this).next().slideUp("slow").removeClass("open").addClass("close");$(this).find(".plus").html("+")}});el.find(".plus").each(function(){var closed=$(this).parent().next().hasClass("close");$(this).html(closed?"+":"-");if(closed)$(this).parent().next().hide();else $(this).parent().next().show()})}})});