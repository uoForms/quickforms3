define(['dom/form/form'],function(){
	quickforms.extendClass('FormElement',function(formObj){
		var oldSummary = formObj.updateSummary;
		formObj.updateSummary = function(){
			//oldSummary.call(formObj);
			var summary = "",
				summaryDom = $('#CourseTypeSelectionWinter_summary'),
				winter = quickforms.currentFormCourseTypeSelectionWinter_form,
				summer = quickforms.currentFormCourseSelectionSummer_form,
				fall = quickforms.currentFormCourseTypeSelectionFall_form;
			if(summaryDom.length>0 && winter && summer && fall)
			{
				for(var child in summer.children)
				{
					summary += summer.children[child].summary();
				}
				for(var child in fall.children)
				{
					summary += fall.children[child].summary();
				}
				for(var child in winter.children)
				{
					summary += winter.children[child].summary();
				}
				summaryDom.html(summary);
			}
			$('#CourseTypeSelectionFall_summary').remove();
			$('#CourseSelectionSummer_summary').remove();
		}
	});

});