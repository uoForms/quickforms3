define(['dom/form/form'],function(){
	window.passwordVerification=function(button){
		if ($("#user_pass_confirm").val() != $("#password").val()) {
			var message = "Check your password, please!";
			quickforms.toast(message);
		} else {
			quickforms.putFact(button,'index.html');
		}
	}
});