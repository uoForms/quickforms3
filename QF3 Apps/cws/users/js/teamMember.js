define(['dom/form/form'],function(){
	window.passwordVerification = function(button){
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if ($("#firstName").val()=="")
		{
			var message = "Fill in first name.";
			quickforms.toast(message);
		} 
		else if (! /^[a-zA-Z]+$/.test($("#firstName").val()))
		{
			var message = "Use only letters in first name.";
			quickforms.toast(message);
		}
		else if ($("#lastName").val()=="")
		{
			var message = "Fill in last name.";
			quickforms.toast(message);
		} 
		else if (! /^[a-zA-Z]+$/.test($("#lastName").val()))
		{
			var message = "Use only letters in last name.";
			quickforms.toast(message);
		} 
		else if ($("#userName").val()=="")
		{
			var message = "Fill in user name.";
			quickforms.toast(message);
        } 
		else if ($("#email").val()=="")
		{
			var message = "Fill in email.";
			quickforms.toast(message);
		}
		else if (! re.test($("#email").val()))
		{
			var message = "Invalid email.";
			quickforms.toast(message);
		}
		else if ($("#password").val()=="")
		{
			var message = "Fill in password.";
			quickforms.toast(message);
		}
		else if ($("#user_pass_confirm").val() != $("#password").val()) 
		{
			var message = "Check your password, please!";
			quickforms.toast(message);
		}	
		else 
		{
			quickforms.putFact(button,'index.html');
		}
	}
});