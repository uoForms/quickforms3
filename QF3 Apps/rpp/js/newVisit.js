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
	
	// Age Tab Diagnosis auto nav
	quickforms.form.domParsers.push(function(formObj){
		formObj.completedListeners.push(function(){
			$('#assessmentLink').on('click',function(){
				formObj.dom.find('ul a').removeClass('ui-state-persist'); // add / remove persist to ensure state stays the same between dialog navigation
				$('a[href="#medicalconditions"]').trigger('click');
				$('a[href="#medicalconditions"]').addClass('ui-btn-active ui-state-persist');
			});
		});
		/*if(formObj.id.indexOf('assessment')>=0)
		{
			formObj.completedListeners.push(function(){
				$('#assessmentLink').on('click',function(){
					var ageId = $('#age').val();
					formObj.dom.find('ul a').removeClass('ui-state-persist'); // add / remove persist to ensure state stays the same between dialog navigation
					('a[href="#medicalconditions"]').addClass('ui-btn-active ui-state-persist');
					if(ageId <= 5 && ageId >1)
					{
						$('a[href="#children"]').trigger('click');
						$('a[href="#children"]').addClass('ui-btn-active ui-state-persist');
					}
					else if(ageId <= 8)
					{
						$('a[href="#medicalconditions"]').trigger('click');
						$('a[href="#medicalconditions"]').addClass('ui-btn-active ui-state-persist');
					}
					else 
					{
						$('a[href="#elderly"]').trigger('click');
						$('a[href="#elderly"]').addClass('ui-btn-active ui-state-persist');
					}
				});
			});
		}*/
	});
	// End Age Tab Diagnosis auto nav	
	
	
	// Assessment auto nav
	quickforms.form.domParsers.push(function(formObj){
		if(formObj.id.indexOf('assessment')>=0)
		{
			formObj.completedListeners.push(function(){
				$('#assessmentLink').on('click',function(){

					$('#medicalconditions').on('click',function() {
						formObj.dom.find('ul a').removeClass('ui-state-persist'); // add / remove persist to ensure state stays the same between dialog navigation
						$('a[href="#medicalconditions"]').trigger('click');
						$('a[href="#medicalconditions"]').addClass('ui-btn-active ui-state-persist');
					});
					
					$('#children').on('click',function() {
						formObj.dom.find('ul a').removeClass('ui-state-persist'); 
						$('a[href="#children"]').trigger('click');
						$('a[href="#children"]').addClass('ui-btn-active ui-state-persist');
					});
					
					$('#elderly').on('click',function() {
						formObj.dom.find('ul a').removeClass('ui-state-persist'); 
						$('a[href="#elderly"]').trigger('click');
						$('a[href="#elderly"]').addClass('ui-btn-active ui-state-persist');
					});
					
					$('#maternity').on('click',function() {
						formObj.dom.find('ul a').removeClass('ui-state-persist'); 
						$('a[href="#maternity"]').trigger('click');
						$('a[href="#maternity"]').addClass('ui-btn-active ui-state-persist');
					});
					
					$('#endoflife').on('click',function() {
						formObj.dom.find('ul a').removeClass('ui-state-persist'); 
						$('a[href="#endoflife"]').trigger('click');
						$('a[href="#endoflife"]').addClass('ui-btn-active ui-state-persist');
					});	
					
					$('#procedure').on('click',function() {
						formObj.dom.find('ul a').removeClass('ui-state-persist'); 
						$('a[href="#procedure"]').trigger('click');
						$('a[href="#procedure"]').addClass('ui-btn-active ui-state-persist');
					});	
				});
			});
		}
	});
	// Assessment auto nav	
	
	// Calculate Notes Field
	$('#reading, #moreCases, #comfortable').on('click',function(){
		var text = "",
			totalNote = "",
			noteDom = $('#noteInput');
		if (text.indexOf('|') !== -1)
			text = $('#notesInput').val();
		else
			text = $.trim(noteDom.val().split("|").pop());
		var note1 = $('#reading').is(':checked');
		var note2 = $('#moreCases').is(':checked');
		var note3 = $('#comfortable').is(':checked');
		if(note1)
			totalNote +="Reading ";
		if(note2)
			totalNote+="More Cases ";
		if(note3)
			totalNote+="Comfortable ";
		if (totalNote == "")	
			noteDom.val(text);
		else
			noteDom.val(totalNote +" | " + text);
		quickforms.currentFormvisitsForm.childMap.noteInput.currentVal = noteDom.val();

	});
	// End Calculate Notes Field
	
	// Show missing summary text
	var missingText=$('#missingText');
	quickforms.form.domParsers.push(function(formObj){
		formObj.completedListeners.push(function(){
			missingText.parent().toggle($('#missingAssessment').is(":checked"));
		});
	});	
	$('#missingAssessment').on('click',function(){
		if ($(this).is(":checked") == true)
		{
			missingText.val("Missing Assessment: ").change();// Notify quickforms of change
			missingText.parent().show();
		}
		else
		{
			missingText.val("").change();// Notify quickforms of change
			missingText.parent().hide();
		}
	});
	// end Show missing summary text

	
	//Redirect Submit Button
		window.redirectSubmitButton=function(button){
			if (getCookie('pageType')== 'calendarSummary') {
				quickforms.putFact(button,'calendar.html');
			} else {
				quickforms.putFact(button,'visits.html');
			}
		}
	//End Redirect Submit Button

	//Redirect Cancel Button
		window.redirectCancelButton=function(){
			if (getCookie('pageType')== 'calendarSummary') {
				window.location = 'calendar.html';
			} else {
				window.location = 'visits.html';
			}
		}
	// End Cancel Button

	
});