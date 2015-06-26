/*  Copyright (c) 2014 Austin Chamney, achamney@gmail.com.
    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
define(['dom/form/form','server/getFactData','helper/md5'],
function (){
	quickforms.loadCss(quickforms.loginCss);
	quickforms.loginControl = function()
	{
		quickforms.currentLogin = this;
		var me = this;
		if(!isNull(getParameterByName('invalidLogin')))
		{
			$('form').prepend("<p style='color:red'>Incorrect username password combination</p>");
		}
		
		/**Versioning - Modify build number (incrementaly) for every commit to SVN. Found in app config  */
		$('#versioning').html( 'Version ' + quickforms.version + ' (build ' + quickforms.build + ')');
		/**End - Versioning*/
		if(!isNull(getCookie('userpass')))
		{
			$('#username').val(getCookie('usernameRemember'));
			$('#password').val('fdsafdsafa');
			if(quickforms.jqueryMobileEnable){$('#rememberMe').attr('checked','checked').checkboxradio('refresh');}
			
		}
					   
		this.logIn = function()
		{
			this.md5edPass = '';
			var cookiePass = getCookie('userpass');
			this.successLocation = $('input[type="button"]').attr('href');
			$('input[type="button"]').attr('href','#');
			if(isNull(cookiePass))
				this.md5edPass = md5($('#password').val());
			else
				this.md5edPass = cookiePass;
			this.username = $('#username').val();
			var prms = "username='"+this.username+"' and password='"+this.md5edPass+"'";
			quickforms.getFactData({queryName:'getUserByPassword',
                                                whereclause:prms,
                                                callback:this.loginSuccess
                                            });
		};
		this.loginSuccess = function(data)
		{
			var rememberChecked = $('#rememberMe').attr('checked');
			if(isJSONString(data))
			{
				me.success = true;
				var json=JSON.parse(data);
				setCookie("userid",json[0].teamMembersKey,1);
				setCookie("userRole",json[0].userRoleLabel,1);
				if(rememberChecked == 'checked')
				{
					setCookie('userpass',me.md5edPass,365);
					setCookie('username',me.username,365);
					setCookie('usernameRemember',me.username,365);
				}
				else
				{
					setCookie('username',me.username,1);
					setCookie('userpass','',1);
				}
				var userRole = json[0].userRoleLabel;
				if(userRole == "Administrator")
				{
				window.location = "adminLandingPage.html";
				}
				else if(userRole == "ccac")
				{
				window.location = "referrals.html";
				}
				
				else if(userRole == "leap")
				{
				window.location = "training.html";
				}
			}
			else
			{
				me.success = false;
				window.location = 'index.html?invalidLogin=true';
			}
		}
		
		$(document).keypress(function(e) {
			if(e.which == 13) { // Press enter to log in 
				quickforms.currentLogin.logIn();
			}
		});
	};
	quickforms.setupLogin = function()
	{
		new quickforms.loginControl();
	};
	quickforms.getFakeFactData = '[{"teamMembersKey":1,"username":"admin","userRole":3}]';
});
