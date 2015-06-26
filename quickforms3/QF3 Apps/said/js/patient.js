define(['dom/form/form','server/executeQuery'],function(){ 

	$('#active').on('click',function(){
		if($(this).is("[checked]") == true)
				{
				    $('#DeceasedDate').parent().hide();
					$('#ER2WeeksPrior').parent().hide();
          		}   
	 else
			{
			
			}
	});
	
	
});
