
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
				
                var addedBy = $('input[name="addedBy"]');
				if(addedBy.length<=0)
					addedBy = $('<input type="hidden" name="addedBy" value="'+username+'" />');
                //$('form').append(addedBy);
                var texObj = new quickforms.TextElement(addedBy,formObj);
				texObj.summary = function(){
					return '';
				};
				texObj.parseDom(formObj);
           });
		
		
	}
	quickforms.logout = function()
	{
		setCookie('username','',1);
		window.location = quickforms.loginLocation;
	}
});
