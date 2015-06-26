window.courseConfirmation = function(submitButton){
	quickforms.toast("Your courses have been saved!");
	quickforms.putFact(submitButton);
	window.setTimeout(function(){
		location.reload(true);
	},1500);
};