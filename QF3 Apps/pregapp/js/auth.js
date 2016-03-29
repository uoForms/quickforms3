
define(['helper/helper','dom/form/text'],
function (){
	
	var loginPage = "/"+quickforms.app+"/login.html"
	var helpPage = "/"+quickforms.app+"/helpInstructions.html"
	var username = getCookie('username'),
		userId = getCookie('userid');
	var appName = getCookie('appName'),
		expired = checkCookieExp();
		
	if((expired||isNull(username)) 
		//whitelist pages that does not need to login to visit
		&& window.location.pathname.indexOf(loginPage) < 0
		&& window.location.pathname.indexOf(helpPage) < 0
		&& window.location.pathname.indexOf("helpInstructions.html")<0 
		&& window.location.pathname.indexOf("index.html")<0 
		&& window.location.pathname.indexOf("content.html")<0
		&& window.location.pathname.indexOf("subscribe.html")<0
		&& window.location.pathname.indexOf("unsubscribe.html")<0
		&& window.location.pathname.indexOf("aboutus.html")<0
		&& window.location.pathname.indexOf("push_daily_emails.html") < 0
		&& window.location.pathname.indexOf("reports.html") < 0
		&& window.location.pathname!='/'+quickforms.app+'/'
		&& !quickforms.offline)
	{
		window.location = loginPage+"?redirect="+window.location.href;
	}
	
	else
	{		//whitelist pages that does not need to login to visit
	    	if(window.location.pathname.indexOf("index.html")<0 
			&& window.location.pathname.indexOf("helpInstructions.html")<0 
	    		&& window.location.pathname.indexOf("content.html")<0
	    		&& window.location.pathname.indexOf("subscribe.html")<0
	    		&& window.location.pathname.indexOf("unsubscribe.html")<0
				&& window.location.pathname.indexOf("aboutus.html")<0
				&& window.location.pathname.indexOf("push_daily_emails.html") < 0
				&& window.location.pathname.indexOf("reports.html") < 0
				&& window.location.pathname!='/'+quickforms.app+'/'){
        	    	var header = $('div[data-role="header"]'),
        		logoutDiv = $('<div class="ui-btn-right" data-role="controlgroup" data-type="horizontal" ></div>'),
           		helpButton = $('<a href="#"  data-role="button" data-theme="c" onclick= window.open("helpInstructions.html") style="position:relative;top:-5px; left:-200px">Help</a>'),
				topRightContainer = $('<div data-role="controlgroup" data-type="horizontal" ></div>');
                	//topRightContainer.append(reportButton);
                	//topRightContainer.append(logoutButton);
					topRightContainer.append(helpButton);
                	header.children().first().append(' - '+username);
                	header.append (logoutDiv);
                	logoutDiv.append(topRightContainer);
                	header.trigger('create');
		}
	
		
		
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
	
	if((expired||isNull(username)) 
		//whitelist pages that does not need to login to visit
		&& window.location.pathname.indexOf(loginPage) < 0
		&& window.location.pathname.indexOf(helpPage) < 0
		&& window.location.pathname.indexOf("index.html")<0 
		&& window.location.pathname.indexOf("content.html")<0
		&& window.location.pathname.indexOf("subscribe.html")<0
		&& window.location.pathname.indexOf("unsubscribe.html")<0
		&& window.location.pathname.indexOf("aboutus.html")<0
		&& window.location.pathname.indexOf("push_daily_emails.html") < 0
		&& window.location.pathname.indexOf("reports.html") < 0
		&& window.location.pathname!='/'+quickforms.app+'/'
		&& !quickforms.offline)
	{
		window.location = loginPage+"?redirect="+window.location.href;
	}
	
	else
	{		//whitelist pages that does not need to login to visit
	    	if(window.location.pathname.indexOf("index.html")<0 
	    		&& window.location.pathname.indexOf("content.html")<0
	    		&& window.location.pathname.indexOf("subscribe.html")<0
	    		&& window.location.pathname.indexOf("unsubscribe.html")<0
				&& window.location.pathname.indexOf("aboutus.html")<0
				&& window.location.pathname.indexOf("push_daily_emails.html") < 0
				&& window.location.pathname.indexOf("reports.html") < 0
				&& window.location.pathname!='/'+quickforms.app+'/'){
        	    	var header = $('div[data-role="header"]'),
        		logoutDiv = $('<div class="ui-btn-right" data-role="controlgroup" data-type="horizontal" ></div>'),
        		logoutButton = $('<a href="#"  data-role="button" data-theme="c" onclick="quickforms.logout()" style="position:relative;top:-5px">Logout</a>'),
  				reportButton = $('<a href="mailto:'+quickforms.qfEmail+'" data-role="button" data-rel="dialog" data-theme="c" style="position:relative;top:-5px">Report a Problem</a>'),
   				topRightContainer = $('<div data-role="controlgroup" data-type="horizontal" ></div>');
                	topRightContainer.append(reportButton);
                	topRightContainer.append(logoutButton);
					//topRightContainer.append(helpButton);
                	//header.children().first().append(' - '+username);
                	header.append (logoutDiv);
                	logoutDiv.append(topRightContainer);
                	header.trigger('create');
		}
	}
	    
		
	quickforms.logout = function()
	{
		setCookie('username','',1);
		setCookieExp(0);
		window.location = "/"+quickforms.app+"/index.html";
	}
	/*quickforms.help = function()
	{
		setCookie('username','',1);
		setCookieExp(0);
		window.location.opener = "/"+quickforms.app+"/helpInstructions.html";
	}*/
	
});
