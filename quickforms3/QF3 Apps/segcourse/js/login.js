
define(['dom/form/form','server/getFactData','helper/md5'],
function (){
	quickforms.loadCss(quickforms.loginCss);
	quickforms.loginControl = function()
	{
		quickforms.currentLogin = this;
		var me = this;
		if(!isNull(getParameterByName('invalidLogin')))
		{
			$('form').prepend("<p style='color:red'>Incorrect student number</p>");
		}
		
		/**Versioning - Modify build number (incrementaly) for every commit to SVN. Found in app config  */
		$('#versioning').html( 'Version ' + quickforms.version + ' (build ' + quickforms.build + ')');
		/**End - Versioning*/
		/*if(!isNull(getCookie('userpass')))
		{
			$('#username').val(getCookie('usernameRemember'));
			$('#password').val('fdsafdsafa');
			$('#rememberMe').attr('checked','checked').checkboxradio('refresh');
			
		}*/
					   
		this.logIn = function()
		{
			this.successLocation = $('input[type="button"]').attr('href');
			$('input[type="button"]').attr('href','#');

			this.studentNumber = $('#studentNumber').val();
			
			quickforms.getFactData({queryName:'getUserByStudentNumber',
									params:'student_id='+this.studentNumber,
									callback:this.loginSuccess});
		};
		this.loginSuccess = function(data)
		{
			var rememberChecked = $('#rememberMe').attr('checked');
			if(isJSONString(data))
			{
				me.success = true;
				var json=JSON.parse(data);
				setCookie("userid",json[0].STUDENT_ID,1);
				if(rememberChecked == 'checked')
				{
					setCookie('username',me.studentNumber,365);
					setCookie('usernameRemember',me.studentNumber,365);
				}
				else
				{
					setCookie('username',me.studentNumber,1);
					setCookie('userpass','',1);
				}
				
				window.location = me.successLocation+"?id="+me.studentNumber;
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
	
});
