
define(['helper/helper','dom/form/text'],
function (){
	
	var loginPage = "/"+quickforms.app+"/login.html"
	var username = getCookie('username');
		userId = getCookie('userid');

		var header = $('div[data-role="header"]'),
		logoutDiv = $('<div align="center" data-role="controlgroup"  data-type="horizontal" ></div>'),
		reportButton = $('<a href="reportProblem.html" data-role="button" data-rel="dialog" data-theme="c" style="position:relative;">Report a Problem</a>'),
		topRightContainer = $('<div data-role="controlgroup" data-type="horizontal" ></div>'),
		topLeftContainer=$('<div data-role="controlgroup" data-type="horizontal" ></div>');
		topRightContainer.append(reportButton);
		header.children().append(' - '+username);
		header.append (logoutDiv);
		logoutDiv.append(topRightContainer);
		header.trigger('create');
		quickforms.form.domParsers.push(function(formObj){
				
                var addedBy = $('input[name="addedBy"]');
				if(addedBy.length<=0)
					addedBy = $('<input type="hidden" name="addedBy" value="'+username+'" />');
                //$('form').append(addedBy);
                var texObj = new quickforms.TextElement(addedBy,formObj);
				texObj.summary = function(){
					return '';
				};
				texObj.parseDom(formObj);
           });		
});
