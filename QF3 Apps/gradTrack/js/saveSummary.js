define(['dom/form/form'],function(){
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
				for(var i=0;i<summaries.length;i++)
				{
					if(summaries[i].indexOf('<b>')>=0)
					{
						summaries.splice(i,1);
					}
				}
				if(summaries.length > 2)
				{
					summary = summaries[0] + ' : '+summaries[1]+' ... and '+(summaries.length-2)+' more.';
				}
				assessmentTextDom.val(summary);
				assessmentTextDom.trigger('change');
			}
		}
	});
});