require(['dom/form/form','server/executeQuery'],function(){ 
	var missingText=$('#Results');
	quickforms.form.domParsers.push(function(formObj){
		formObj.completedListeners.push(function(){
			missingText.parent().toggle($('#testComplete').is(":checked"));
		});
	});	
	$('#testComplete').on('click',function(){
		if ($(this).is(":checked") == true)
		{
			missingText.val("Results: ").change();// Notify quickforms of change
			missingText.parent().show();
		}
		else
		{
			missingText.val("").change();// Notify quickforms of change
			missingText.parent().hide();
		}
	});
});

 