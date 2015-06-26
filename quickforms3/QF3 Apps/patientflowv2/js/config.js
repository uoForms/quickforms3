define(function(){
	var config = {};
	//config.jqueryVersion="1.7.1.min";
	//config.jqueryMobileVersion="1.3.2.min";
	
	//config.jqueryMobileTheme = "/patientflowv2/css/greenshade.css"; //
	
	
	//config.dataNativeMenu = false;
	config.app = 'patientflowv2';
	config.quickformsEnding = ""; // "" or ".asp"
	config.defaultPageTransition = "none"; // slide, pop, none
	config.defaultDialogTransition = "none"; // slide, pop, none
	config.extraScripts =[]; // gets rid of authentication or is generally set to "dom/authentication"
	return config;
});
