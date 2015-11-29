
define(['helper/helper','dom/form/text'],
function (){
	
	var loginPage = "/"+quickforms.app+"/login.html"
	var username = getCookie('username');
		userId = getCookie('userid');
		
	/**
	Following code is used for page limited login
	*/		
	if(isNull(username) && getCookie('pageType') == 'plans' )
	{
		window.location = quickforms.loginLocation;
	}
	else
	{
		var header = $('div[data-role="header"]'),
			logoutDiv = $('<div align="center" data-role="controlgroup"  data-type="horizontal" ></div>'),
			//submitFloatPlanDiv=$('<div class="ui-btn-left" data-role="controlgroup" data-type="horizontal" style="position:relative ;" ></div>')
			//submitFloatPlanButton = $('<a href="#"  data-role="button" data-theme="c" onclick="" style="position:relative ;">Submit Float Plan</a>'),
			registerButton = $('<a href="#"  data-role="button" data-theme="c" onclick="quickforms.register()" style="position:relative ;">Register</a>'),	
			logoutButton = $('<a href="#"  data-role="button" data-theme="c" onclick="quickforms.logout()" style="position:relative; ">Logout</a>'),
			loginButton = $('<a href="#"  data-role="button" data-theme="c" onclick="quickforms.login()" style="position:relative; ">Login</a>'),			
			reportButton = $('<a href="reportProblem.html" data-role="button" data-rel="dialog" data-theme="c" style="position:relative;">Report a Problem</a>'),
			topRightContainer = $('<div data-role="controlgroup" data-type="horizontal" ></div>'),
			topLeftContainer=$('<div data-role="controlgroup" data-type="horizontal" ></div>');		
			//topRightContainer.append(submitFloatPlanButton);	
		
		
		/**
		Login, register and logout button is dynamically loaded based on if user is logged in or not
		*/		
		if(isNull(username)){topRightContainer.append(loginButton);	topRightContainer.append(registerButton);}else{topRightContainer.append(logoutButton);}
		
		topRightContainer.append(reportButton);
		header.children().append(' - '+username);
		//header.append(submitFloatPlanDiv);
		//submitFloatPlanDiv.append(topLeftContainer);
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
		setCookie('pageType','',1);
		window.location = "index.html";
	}
	quickforms.login = function()
	{
		window.location = "login.html";
	}
	quickforms.register = function()
	{
		window.location = "users/teamMember.html";
	}
});
