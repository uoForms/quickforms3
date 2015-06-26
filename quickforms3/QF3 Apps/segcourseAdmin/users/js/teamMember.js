define(['dom/form/form', 'server/getFactData'],function(){
	window.verification=function(button){	
		if ($("#user_pass_confirm").val() != $("#password").val()) {
			var message = "Check your password, please!";
			quickforms.toast(message);
		}

		// If it's a new team member
		if (quickforms.currentFormmainForm.updateId == null) {
			var username = $('#username').val(getCookie('usernameRemember'));
			quickforms.getFactData({queryName:'checkUsername',
									params:'userName='+username,
									callback:function(data){
										if ((!isJSONString(data)) && ($("#user_pass_confirm").val() == $("#password").val())) {
											quickforms.putFact(button,'index.html');
										} else if ((isJSONString(data)) && ($("#user_pass_confirm").val() == $("#password").val())){
											var message = "This username already exist!";
											quickforms.toast(message);
										}
									}
			});	
		} else if (($("#user_pass_confirm").val() == $("#password").val()) && (quickforms.currentFormmainForm.updateId != null)){
			quickforms.putFact(button,'index.html');
		}	
	}
});
	
	

