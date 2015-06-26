
define(['helper/helper','dom/form/text'],
function (){
	var app = getParameterByName('app');
	var loginPage = "/quickforms/queries/index.html";
	var username = getCookie('username'),
		userId = getCookie('userid');
	if(isNull(username) 
		&& window.location.pathname != loginPage
		&& !quickforms.offline)
	{
		window.location = loginPage+"?app="+app;
	}
	else
	{
		var header = $('div[data-role="header"]'),
			logoutDiv = $('<div class="ui-btn-right" data-role="controlgroup" data-type="horizontal" ></div>'),
			logoutButton = $('<a href="#"  data-role="button" data-theme="c" onclick="quickforms.logout()">Logout</a>');
		header.children().first().append(' - '+username);
		header.append (logoutDiv);
		logoutDiv.append(logoutButton);
		header.trigger('create');
		
		$('form').append('<input type="hidden" name="addedBy" value="'+userId+'" />');
		
	}
	quickforms.logout = function()
	{
		setCookie('username','',1);
		window.location = loginPage;
	}
});
