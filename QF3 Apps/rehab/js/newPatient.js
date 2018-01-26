define(['dom/form/form','server/executeQuery'],function(){

	//Redirect Submit Button
		window.redirectSubmitButton=function(button){
			if (getCookie('pageType')== 'calendarSummary') {
				quickforms.putFact(button,'calendar.html');
			} else {
				quickforms.putFact(button,'patients.html');
			}
		}
	//End Redirect Submit Button

	//Redirect Cancel Button
		window.redirectCancelButton=function(){
			if (getCookie('pageType')== 'calendarSummary') {
				window.location = 'calendar.html';
			} else {
				window.location = 'patients.html';
			}
		}
	// End Cancel Button


	quickforms.getUrlParameter = function(sParam) {
			var sPageURL = decodeURIComponent(window.location.search.substring(1)),
					sURLVariables = sPageURL.split('&'),
					sParameterName,
					i;

			for (i = 0; i < sURLVariables.length; i++) {
					sParameterName = sURLVariables[i].split('=');

					if (sParameterName[0] === sParam) {
							return sParameterName[1] === undefined ? true : sParameterName[1];
					}
			}
	};
});
