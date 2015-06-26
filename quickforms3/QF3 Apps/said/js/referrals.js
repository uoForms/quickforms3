define([],function(){ 
	
	// Show missing summary text
	var DeceasedFields=$('#deceasedFields');
	quickforms.form.domParsers.push(function(formObj){
		formObj.completedListeners.push(function(){
			DeceasedFields.toggle($('#Deceased').is(":checked"));
		});
	});	
	$('#Deceased,#Active,#Discharged').on('click',function(){
		if ($('#Deceased').is(":checked") == true)
		{
			DeceasedFields.show();
		}
		else
		{
		
			DeceasedFields.hide();
		}
	});
	
});