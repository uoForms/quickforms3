/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
var quickforms = new function(){
	this.quickformsUrl = document.getElementsByTagName('script')[0].src.replace('js/require.min.js','');
	this.jsUrl = this.quickformsUrl+"js/";
	this.cssUrl = this.quickformsUrl+"css/";
	this.cssUrls = [];
	this.addedFolders = {};
	this.baseScripts = [
				"server/server",
				"dom/dom",
				"helper/helper"
			];
	this.onReady = function(){};
	this.mixin = function(obj1,obj2){
		for(var obj2Prop in obj2)
		{
			obj1[obj2Prop] = obj2[obj2Prop];
		}
	};
	this.registerReadyFunction = function(func)
	{
		if(quickforms.ready == true)
			func();
		quickforms.onReady = func;
	};
	this.extendClass = function(className,extender)
	{
		var OldClass = quickforms[className];
		quickforms[className] = function(){
			var obj = new OldClass();
			OldClass.apply(obj,arguments);
			extender(obj);
			return obj;
		};
	};
	this.loadCss = function(url) {
		if(!this.cssUrls[url])
		{
			this.cssUrls.push(url);
			var link = document.createElement("link");
			link.type = "text/css";
			link.rel = "stylesheet";
			url += '?bust='+quickforms.build;
			link.href = url;
			document.getElementsByTagName("head")[0].appendChild(link);
		}
	};
	this.tryModule = function(url,callback)
	{
		var oldErrorHandle = requirejs.onError,
			newErrorHandle = function(data){
				requirejs.onError = oldErrorHandle;
				callback(data);
			};
		requirejs.onError = newErrorHandle;
		require([url],newErrorHandle);
	};
	this.initLoadingGif = function(maxTime)
	{
            maxTime = maxTime || 5000;
		if(this.offline == false)
		{
			if(this.loadingCounter == null)
				this.loadingCounter = 0;
			this.loadCss(quickforms.cssUrl+'quickforms/loadingGif.css');
			var contentBlock = $('<div class="content-blocker" id="content-blocker'+this.loadingCounter+'"><img src="'+this.cssUrl+'quickforms/images/loading.gif" class="loading-gif"></img></div>');
			$('body').append(contentBlock);
			this.loadingCounter +=1;
			var timeoutId = window.setTimeout(function(){
				if($('.content-blocker').length>0)
				{
                                        if(!quickforms.errorMessage)
                                        {
                                            quickforms.toast("Server Timeout: Please log in again.");
                                            window.setTimeout(function(){
                                                window.location = quickforms.loginLocation;
                                            },2000);
                                        }
                                        else
                                        {
                                            quickforms.toast("Application Error: Please report to administrator.");
                                            quickforms.hideLoadingGif();
                                        }
				}
			},maxTime);
			contentBlock[0].timeoutId = timeoutId;
		}
	};
	this.hideLoadingGif = function()
	{
		if(this.offline == false)
		{
			if(this.hideCounter == null)
				this.hideCounter = 0;
			var conBlock = $(".content-blocker").first();
			if(conBlock.length>0){window.clearTimeout(conBlock[0].timeoutId);}
			conBlock.remove();
			this.hideCounter += 1;
		}
	};
	this.toast = function(msg)
	{
		$("<div class='ui-loader ui-overlay-shadow ui-body-a ui-corner-all'><h3>"+msg+"</h3></div>")
			.css({ display: "block", 
				opacity: 0.90, 
				position: "fixed",
				padding: "7px",
				"text-align": "center",
				width: "270px",
				left: ($(window).width() - 284)/2,
				top: $(window).height()/2 })
			.appendTo( $.mobile.pageContainer ).delay( 2500 )
			.fadeOut( 400, function(){
				$(this).remove();
			});
	};
        this.confirm = function(message,callback)
        {
            this.confirmId = this.confirmId || 0;
            this.confirmId+=1;
            $('<div data-role="popup" id="confirm' + this.confirmId + '" data-confirmed="no" data-transition="pop" data-overlay-theme="b" data-theme="a" data-dismissible="false" style="max-width:500px;"> \
                    <div data-role="header" data-theme="a">\
                        <h1>Confirm:</h1>\
                    </div>\
                    <div role="main" class="ui-content">\
                        <h3 class="ui-title">' + message + '</h3>\
                        <a href="#" data-role="button" class="ui-btn-inline optionConfirm" data-rel="back">Yes</a>\
                        <a href="#" data-role="button" class="ui-btn-inline optionCancel" data-rel="back" data-transition="flow">No</a>\
                    </div>\
                </div>')
                .appendTo($.mobile.pageContainer);
             var popupDialogObj = $('#confirm' + this.confirmId);
             popupDialogObj.trigger('create');
             popupDialogObj.popup({
                    afterclose: function (event, ui) {
                        popupDialogObj.find(".optionConfirm").first().off('click');
                        var isConfirmed = popupDialogObj.attr('data-confirmed') === 'yes' ? true : false;
                        $(event.target).remove();
                        if (isConfirmed && callback) {
                            callback();
                        }
                    }
                });
             popupDialogObj.popup('open');
             popupDialogObj.find(".optionConfirm").first().on('click', function () {
                    popupDialogObj.attr('data-confirmed', 'yes');
             });
        };
	this.configureCss = function()
	{
            if(this.jqueryMobileEnable)
            {
		this.loadCss(this.jqueryMobileCss);
		if(this.jqueryMobileTheme != "")
			this.loadCss(this.jqueryMobileTheme);
		if(this.jqueryUITheme != "")
			this.loadCss(this.jqueryUITheme);
            }
	};
};
window.quickforms = quickforms;

require([quickforms.jsUrl+'helper/config.js'],function(config){
	var datetime = (new Date()).getTime();
	quickforms.tryModule("js/config.js?"+datetime,function(appConfig){
		if(appConfig instanceof Error == false)
		{
			quickforms.mixin(config,appConfig);
		}
		if(config.debug == true){config.build=datetime;}
		quickforms.mixin(quickforms,config);
		quickforms.configureCss();
		quickforms.baseScripts = quickforms.baseScripts.concat(quickforms.extraScripts);
		require.config( {
			// 3rd party script alias names (Easier to type "jquery" than "libs/jquery-1.8.3.min")
			paths: {
				// Core Libraries
				"jq": config.jqueryPath,
				"jqm": config.jqueryMobilePath
			},
			packages : [
				{name : "dom", location: quickforms.jsUrl+"dom"},
				{name : "server", location: quickforms.jsUrl+"server"},
				{name : "helper", location: quickforms.jsUrl+"helper"},
				{name : "jquery", location: quickforms.jsUrl+"jquery"},
				{name : "google", location: quickforms.jsUrl+"google"},
				{name : quickforms.app, location: "/"+quickforms.app}
			],
			// Sets the configuration for your third party scripts that are not AMD compatible
			shim: {
				"jqm": {
					  "deps": [ "jq"]
				}
			},// end Shim Configuration
			urlArgs: "bust="+config.build
		} );
		require([ "jq"], function() {
                        if(config.jqueryMobileEnable)
                        {
                            $(document).bind("mobileinit", function() {
                                    $.mobile.selectmenu.prototype.options.nativeMenu = config.dataNativeMenu;
                                    $.mobile.page.prototype.options.domCache = true;
                                    $.mobile.defaultPageTransition = config.defaultPageTransition;
                                    $.mobile.defaultDialogTransition = config.defaultDialogTransition;
                                    $.mobile.useFastClick = true;
                            });
                            require(["jqm"],function(){
                                    require(quickforms.baseScripts,function(){quickforms.ready = true;quickforms.onReady()});
                            });
                        }
                        else
                        {
                            require(quickforms.baseScripts,function(){quickforms.ready = true;quickforms.onReady()});
                            $('html').removeClass('ui-mobile-rendering');
                        }
		} );
		
	});
});

