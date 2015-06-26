/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(['helper/helper','dom/form/text'],
function (){
	
	var loginPage = "/"+quickforms.app+"/index.html"
	var username = getCookie('username'),
		userId = getCookie('userid');
	if(isNull(username) 
		&& window.location.pathname.indexOf( loginPage) < 0
		&& !quickforms.offline)
	{
		window.location = quickforms.loginLocation;
	}
	else
	{
		var header = $('div[data-role="header"]'),
			logoutDiv = $('<div class="ui-btn-right" data-role="controlgroup" data-type="horizontal" ></div>'),
			logoutButton = $('<a href="#"  data-role="button" data-theme="c" onclick="quickforms.logout()" style="position:relative;top:-5px">Logout</a>'),
			reportButton = $('<a href="mailto:'+quickforms.qfEmail+'" data-role="button" data-rel="dialog" data-theme="c" style="position:relative;top:-5px">Report a Problem</a>'),
			topRightContainer = $('<div data-role="controlgroup" data-type="horizontal" ></div>');
		topRightContainer.append(reportButton);
		topRightContainer.append(logoutButton);
		header.children().first().append(' - '+username);
		header.append (logoutDiv);
		logoutDiv.append(topRightContainer);
		header.trigger('create');
		quickforms.form.domParsers.push(function(formObj){
                    var addedBy = $('<input type="hidden" name="addedBy" id = "addedBy" value="'+userId+'" />');
                    var texObj = new quickforms.TextElement(addedBy,formObj);
                                    texObj.summary = function(){return '';};
                                    texObj.parseDom(formObj);
                                    formObj.addChild(texObj);
                                    window.setTimeout(function(){formObj.finishedParsing();},1);	
               });
		
		
	}
	quickforms.logout = function()
	{
		setCookie('username','',1);
		window.location = quickforms.loginLocation;
	}
});
