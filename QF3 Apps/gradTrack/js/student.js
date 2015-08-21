define(['dom/form/form','server/executeQuery'],function(){ 

	 // Save Summary
	quickforms.extendClass('FormElement',function(formObj){

		var oldSummary = formObj.updateSummary;

		formObj.updateSummary = function(){
			oldSummary.call(formObj);
			if(formObj.summaryId == 'assessment_summary')
			{	
				
				var summary = $('#'+formObj.summaryId).html();
				var assessmentTextDom = $('#assessmentHiddenSummary');
				var visitsForm = quickforms['currentFormvisitsForm'];
				
				if(assessmentTextDom.length == 0)
				{
					assessmentTextDom = $('<input type="hidden" name = "diagnosis" id = "assessmentHiddenSummary"/>')
					visitsForm.dom.append(assessmentTextDom);
					var hiddenSum = new quickforms.TextElement(assessmentTextDom,visitsForm);
					hiddenSum.parseDom(visitsForm);
				}

				var summaries = summary.split('<br>');
				for(var i=0;i<summaries.length-1;i++)
				{
					if(summaries[i].indexOf('<b>')>=0)
					{
						summaries.splice(i,1);
					}
				}
				if(summaries.length > 2)
				{
					if (summaries.length-3>0) summary = summaries[0] + ' , '+summaries[1]+' ... and '+(summaries.length-3)+' more.';
					else summary = summaries[0] + ' , '+summaries[1];
				}
				assessmentTextDom.val(summary);
				assessmentTextDom.trigger('change');

			}		
		}
	});
	 // End Save Summary
	
	
	//Redirect Submit Button
		window.redirectSubmitButton=function(button){
			//if (getCookie('pageType')== 'calendarSummary') {
				quickforms.putFact(button,'homePage.html');
			/* } else {
				quickforms.putFact(button,'visits.html');
			} */
		}
	//End Redirect Submit Button

	//Redirect Cancel Button
		window.redirectCancelButton=function(){
			//if (getCookie('pageType')== 'calendarSummary') {
				window.location = 'homePage.html';
			/* } else {
				window.location = 'visits.html';
			} */
		}
	// End Cancel Button

	
});