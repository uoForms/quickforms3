define(['dom/form/form', 'server/getFactData'],function(){
	window.verification=function(button){
		if ($("#user_pass_confirm").val() != $("#password").val()) {
			var message = "Check your password, please!";
			quickforms.toast(message);
		} else {
			
			var username = $('#userName').val();
			quickforms.getFactData({queryName:'checkUsername',
									params: 'userName='+username,
									callback:function(data){
										if (!isJSONString(data)) {
											quickforms.putFact(button,'index.html');
										} else {
											var message = "This username already exist!";
											quickforms.toast(message);
										}
									}
			});
			
		}
	}
});
	
	

