define(function(){ 
	var config = {};
	config.app = 'hospital'; 
	//config.build = 101;
	//config.version = 1.0;
	config.debug = false;
	config.loginLocation = '../index.html';
	config.extraScripts=['../js/auth.js'];
	//config.quickformsUrl = 'http://quickforms3.eecs.uottawa.ca/quickforms/';
	config.dataTransferType = "text";
	return config;
});