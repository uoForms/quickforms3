define(function(){ 
	var config = {};
	config.app = 'boatsafe';
		//config.build = 101;
	//config.version = 1.0;

	config.loginLocation = 'login.html';
    config.extraScripts=['js/auth.js'];
	//config.quickformsUrl = "http://quickforms3.eecs.uottawa.ca/quickforms/";
	config.dataTransferType = "jsonp";
	config.debug = true;
	return config;
});