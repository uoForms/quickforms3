/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
this.include = function(name,url,callback)
	{
		if(!name)
		{
			name="root"+(this.rootScripts++);
			this.baseScripts[name] = {state:"loading"};
		}
		if(url && url.length>0)
		{
			var scriptObjs = {};
			for(var i=0;i<url.length;i++)
			{
				var fullUrl = url[i];
				if(!this.baseScripts[fullUrl])
				{
					this.baseScripts[fullUrl] = scriptObjs[fullUrl] = {state:"loading"};
				}
					
			}
		
			quickforms._appendScripts(name,url,scriptObjs,callback);
		}
		else
		{
			window.setTimeout(function(){
				callback();
				quickforms.baseScripts[name] = {state:"loaded"};
				console.log("Script "+name+" loaded");
			},1);
		}
	};
	this.registerApp = function(appName)
	{
		this.addedFolders["/"+appName+"/js/"] =1;
	};
	this.findScriptFolder = function(url)
	{
		var baseFolder = url.split('/')[0];
		if(this.baseFolders[baseFolder] == 1) // Quickforms library
		{
			if(url.indexOf('.js')>0)
				return quickforms.jsUrl+url;
			else if(url.indexOf('.css')>0)
				return quickforms.cssUrl+url;
		}
		else
		{
			if(url.indexOf('.js')>0)
				return "/"+baseFolder+"/js/"+url.substring(baseFolder.length,url.length);
			else if(url.indexOf('.css')>0)
				return "/"+baseFolder+"/css/"+url.substring(baseFolder.length,url.length);
		}
		quickforms.jsUrl+url
	};
	quickforms._appendScripts = function (currentScript,dependencyArray,scriptArray,callback){
	var checkDependenciesLoaded = function()
	{
		var loadedCount = 0;
		for(var i=0;i<dependencyArray.length;i++)
		{
			if(quickforms.baseScripts[dependencyArray[i]].state == "loaded")
				loadedCount ++;
		}
		if(loadedCount >= dependencyArray.length)
			return true;
		return false;
	}
	var finishFunc = function(parentUrl,smlUrl)
	{
		if(quickforms.baseScripts[smlUrl].state == "loaded" )
		{
			if(quickforms.baseScripts[parentUrl].state == "loading") // parent may have already finished loading
			{
				if(checkDependenciesLoaded())
				{
					if(callback)
						callback();	
					quickforms.baseScripts[parentUrl].state = "loaded";
					console.log("Script "+parentUrl+" loaded");
				}
				else
				{
					window.setTimeout(function()
					{
						finishFunc(parentUrl,smlUrl);
					},
					quickforms.scriptWait);
				quickforms.scriptWait += 5;
				}
			}
		}
		else
		{
			//console.log('waiting on script '+smlUrl);
			window.setTimeout(function()
				{
					finishFunc(parentUrl,smlUrl);
				},
				quickforms.scriptWait);
			quickforms.scriptWait += 5;
		}
	};
    for(var url in scriptArray)
	{
		var scriptFinalUrl = this.findScriptFolder(url);
		if(scriptArray[url].state == "loading")
		{
			var scr;
			if(url.indexOf('.js')>0)
			{
				scr = document.createElement('script');
				scr.setAttribute("type","text/javascript");
				scr.setAttribute("src", scriptFinalUrl);
				scr.smlUrl = url;
				scr.parentUrl = currentScript; 
				scr.onload = scr.onreadystatechange = function()
				{
					if (!this.readyState || this.readyState == 'loaded') {
						finishFunc.call(this,this.parentUrl,this.smlUrl);
					}
				};
			}
			else if(url.indexOf('.css')>0)
			{
				scr = document.createElement('link');
				scr.setAttribute("type","text/css");
				scr.setAttribute("rel","stylesheet");
				scr.setAttribute("href", scriptFinalUrl);
				scr.smlUrl = url;
				scr.onload = scr.onreadystatechange = function()
				{
					if (!this.readyState || this.readyState == 'loaded') {
						quickforms.baseScripts[this.smlUrl].state = "loaded";
						if(checkDependenciesLoaded())
						{
							if(callback)
								callback();	
							quickforms.baseScripts[currentScript].state = "loaded";
						}
					}
				};
			}
			document.getElementsByTagName('head')[0].appendChild(scr);
		}
		else
		{
		}
	}
    if(!url || url.length == 0)
	{
		for(var i=0;i<dependencyArray.length;i++)
		{
			finishFunc(currentScript,dependencyArray[i]);
		}
	}
}
quickforms._appendSynchronousScripts = function (scripts)
{
	$.ajaxSetup({ cache: true });
    $.ajaxSetup({async: false});
	for(var i=0;i<scripts.length;i++)
	{
		$.ajax({
		   url: this.jsUrl + scripts[i], 
		   dataType: 'text', 
		   success: function(data) { 
				var script = document.createElement('script');
				var head = document.getElementsByTagName("head")[0] ||
                  document.documentElement;
				script.type = "text/javascript";
				try {
				  // doesn't work on ie...
				  script.appendChild(document.createTextNode(data));      
				} catch(e) {
				  // IE has funky script nodes
				  script.text = data;
				}
				head.insertBefore(script, head.firstChild);
		   },
		   error: function(e,e2,e3){ 
			console.log(e + e2 + e3);
			},
		   async: false
		});
	}
	$.ajaxSetup({async: true});
}