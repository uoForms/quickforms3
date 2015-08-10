/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(function(){
	window.isNull = function(field)
	{
		if(field && field != "null" && field != "undefined")
			return false;
		return true;
	};
	window.isJSONString = function(string)
	{
		try{
			JSON.parse(string);
			return true;
		}
		catch(e)
		{
                    quickforms.errorMessage = e;
                    return false;
		}
	};
	window.alertJSONError = function(error)
	{
                quickforms.errorMessage = error;
		console.error(error);
	};
	window.isNumber = function(num)
	{
		return !isNaN(num)
	}
	window.getParameterByName = function(name) {
		var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
		return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
	};
	window.getCookie = function(c_name)
	{
	    var app_c_name = quickforms.app+"_"+c_name;
	    return localStorage.getItem(app_c_name);
	    return '';
	}
	window.setCookie = function(c_name,value,exdays)
	{
	    var app_c_name = quickforms.app+"_"+c_name;
	    localStorage.setItem(app_c_name, value);
	    var today = new Date();
	    var expDay = today.getTime() + 3600*1000;
	    var app_expDay = quickforms.app+"_expDay";
	    var oldExpDay = localStorage.getItem(app_expDay);
	    //If the cookie [appName]_expDay is null or will expire in one hour, extend the expiration time.
	    if(isNull(oldExpDay)||oldExpDay<expDay){
		localStorage.setItem(app_expDay,expDay);
	    }

	}
	
	//Set the cookie expiration time.
	window.setCookieExp = function(exdays)
	{

	    var today = new Date();
	    var expDay = today.getTime() + exdays*24*3600*1000;
	    var app_expDay = quickforms.app+"_expDay";
	    localStorage.setItem(app_expDay,expDay);
	}
	
	window.checkCookieExp = function()
	{
	    var app_expDay = quickforms.app+"_expDay";
	    var expDay = localStorage.getItem(app_expDay);
	    var today = new Date();
	    today.setHours(0,0,0,0);
	    if(!isNull(expDay)&&expDay>=today.getTime()){
		return false;
	    }else{
		return true;
	    }
		
	}
	
	
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
    var oldJSONParse = JSON.parse;
    JSON.parse = function(arg1,arg2,arg3){
            arg1 = arg1.replace(/\n/g,'\\n');
            arg1 = arg1.replace(/\\\\"/g,'\\"');
            return oldJSONParse(arg1,arg2,arg3); 
    };
});